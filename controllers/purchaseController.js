const purchaseModel = require('../models/purchaseModel');
const cartModel = require('../models/cartModel');
const {validationResult} = require('express-validator');

exports.purchase = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const {shipping, billing, transactionType} = req.body;
    var user = req.session.user;
    if (!user) {
      res.redirect('/login');
    }
    else {
      cartModel.getByUser(user, (err, cart) => {
        // cart contains {products: [{pName, img, subPrice, id, qty}], total}
        if (err) throw err;
        if (cart) {
          var cartItems = [];
          cartModel.deleteByuser(user, (err, result) => {
            if (err) throw err;
            if (result.ok == 1) {
              cart.products.forEach(function(item) {
                var prod = {
                  pName: item.pName,
                  id: item.id,
                  qty: item.qty,
                  img: item.img,
                  subPrice: item.subPrice
                };
                cartItems.push(prod);
              });
              
              var status = null;
              if (transactionType == 'CoD') {
                status = 'Preparing Order';
              }
              else {
                status = 'Awaiting Proof of Payment';
              }
    
              var details = {
                user: user,
                cartItems: cartItems,
                shippingAddress: shipping,
                billingAddress: billing,
                paymentMethod: transactionType,
                status: status,
                totalPrice: cart.total
              }
    
              purchaseModel.create(details, (err, result) => {
                if (result) {
                  var purchaseId = result.toObject()._id;
                  if (transactionType == "CoD") {
                    res.redirect('/purchase_details/' + purchaseId);
                  }
                  else { 
                    res.render('paymentDetails', {
                      name: req.session.name,
                      title: 'Payment Details',
                      loggedIn: req.session.user,
                      purchaseId: purchaseId,
                    });
                  }
                }
                else {
                  res.render('/cart', {
                    name: req.session.name,
                    title: "My Cart", 
                    loggedIn: user,
                    products: cart.products
                  });
                }
              });
            }
            else {
              // delete cart failed
              res.redirect('/');
            }
          });
        
        }
      });
    }
  }
}

exports.getPurchaseDetails = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    console.log('test');
    console.log(req.params.slug);
    purchaseModel.getByID({_id: req.params.slug}, (err, purchase) => {
      if (purchase.user.equals(req.session.user)) {
        var cartItems = purchase.cartItems;

        cartItems.forEach(function(item){
          item.unitPrice = (item.subPrice / item.qty).toFixed(2);
          item.subPrice = (item.subPrice).toFixed(2);
        });
        console.log(purchase.cartItems);

        var date = purchase.purchaseDate;
        date = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
        if (purchase) {
          res.render('purchaseDetails', {
            name: req.session.name,
            title: 'Product Details',
            loggedIn: req.session.user,
            _id: purchase._id,
            status: purchase.status,
            purchaseDate: date,
            cartItems: cartItems,
            total: purchase.totalPrice.toFixed(2),
          });
        }
        else {
          res.redirect('/');
        }
      }
      else {
        res.redirect('/')
      }
    });
  }
}

exports.getPurchaseHistory = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()){
    purchaseModel.getByQuery({user: req.session.user}, (err, purchases) => {
      if (err) throw err;
      var purchasesCopy = JSON.parse(JSON.stringify(purchases));
      purchasesCopy.forEach(function(purchase){
        var products = purchase.cartItems;
        var totalQuantity = 0;

        var firstImg = null;
        products.forEach(function(product){
          if (firstImg == null) {
            firstImg = product.img;
          }
          totalQuantity += product.qty;
        });
        purchase.totalQty = totalQuantity;
        purchase.firstImg = firstImg;
        purchase.totalPrice = purchase.totalPrice.toFixed(2);
        purchase.purchaseDate = purchase.purchaseDate.match(/(\d{4}-\d{2}-\d{2})/)[1];
      });

      res.render('purchaseHistory', {
        name: req.session.name,
        title: 'Product History',
        loggedIn: req.session.user,
        purchases: purchasesCopy
      });
    });
  }
}

exports.getAllPurchases = (req, res) => {
  purchaseModel.getAll({}, (err, purchases) => {
    res.render('dashboard', {
      title: 'Lipay | Administrator',
      name: 'Admin Name',
      layout: 'main-admin',
      purchases: purchases
    });
  });
};