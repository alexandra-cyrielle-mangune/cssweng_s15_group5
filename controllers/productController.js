const productModel = require('../models/productModel');
const {validationResult} = require('express-validator');

// This functions gets all the products from the database 
// and displays them in the catalogue
exports.getAllProducts = (req, res) => {
  productModel.getAll({}, (err, products) => {
    res.render('catalogue', {
      name: req.session.name,
      title: 'Catalogue',
      products: products,
      loggedIn: req.session.user,
    });
  });
};

// This functions gets all the products from the database 
// and displays them in the admin 'view all products' pages
exports.viewAllProducts = (req, res) => {
  productModel.getAll({}, (err, products) => {
    res.render('viewItems', {
      title: 'Lipay',
      name: 'Admin Name',
      layout: 'main-admin',
      products: products
    });
  });
};

// Get a product then display its details
exports.getAProduct = (req, res) => {
  productModel.getOne({slug: req.params.slug}, (err, product) => {
    if(err) {
      console.log(err);
    }
    else {
      res.render('productDetails', {
        title: 'Lipay',
        layout: 'main-1',
        name: req.session.name,
        pName: product.pName,
        desc: product.desc,
        img: '../' + product.img,
        price: product.price,
        _id: product._id,
        loggedIn: req.session.user,
      });
    }
  });
};

// Add a product to the CART
// exports.addToCart = (req, res) => {
//   var cart = new cartModel(req.session.cart ? req.session.cart: {});
//   productModel.getOne({slug: req.params.slug}, (err, product) => {
//     if (err) {
//       console.log(err);
//     }
//     else {
//       cart.addProduct(product, req.params._id);
//       req.session.cart = cart;
//       console.log(cart); // testing
//       res.redirect('/cart');
//     }
//   });
// };

// This function add a new product to the database
exports.addProduct = (req, res) => {
  const errors = validationResult(req);
  if(errors.isEmpty()) {
    var {pName, desc, pCat, price, img} = req.body;
    var slug = req.body.pName.replace(/\s+/g, '-').toLowerCase();
    if(img == undefined) var temp = 'img/tote-bag-1.jpg';

    productModel.getOne({slug: slug}, (err, result) => {
      if(result) {
        console.log(result); // for testing
        req.flash('error_msg', 'Product already exists.');
        res.redirect('/add_new_item');
      }
      else {
        const newProduct = {
          pName: pName,
          slug: slug,
          desc: desc,
          category: pCat,
          price: price.toFixed(2),
          img: temp
        };
        productModel.create(newProduct, (err, product) => {
          if(err) {
            req.flash('error_msg', 'Could not create product. Please try again.');
            res.redirect('/add_new_item');
          }
          else {
            console.log(slug); // for testing
            req.flash('success_msg', 'You have added a new product in the catalogue!');
            res.redirect('/add_new_item');
          }
        });
      }
    });
  }
  else {
    const messages = errors.array().map((item) => item.msg);
    req.flash('error_msg', messages.join(' '));
    res.redirect('/add_new_item');
  }
}