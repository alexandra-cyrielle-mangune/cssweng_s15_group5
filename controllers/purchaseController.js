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
      cartModel.getByUser(user, (err, result) => {
        if (result) {
          var cartItems = [];
          // result contains {products: [{pName, img, subPrice, id, qty}], total}
          result.products.forEach(function(item) {
            var prod = {
              pName: item.pName,
              id: item.id,
              qty: item.qty,
              subPrice: item.subPrice
            };
            cartItems.push(prod);
          });
          
          var status = null;
          if (transactionType == 'COD') {
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
            totalPrice: result.total
          }

          purchaseModel.create(details, (err, result) => {
            if (result) {
              if (transactionType == "CoD") {
                res.redirect('/');
              }
              else { 
                res.redirect('payment_details');
              }
            }
            else {
              res.render('/cart', {
                name: req.session.name,
                title: "My Cart", 
                loggedIn: user,
                products: result.products
              });
            }
          });
        }
      });
    }
  }
}