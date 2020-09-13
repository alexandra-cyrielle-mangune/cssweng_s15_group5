const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');
const {validationResult} = require('express-validator');

// This function gets all existing carts in the database
exports.getAllCarts = (req, res) => {
  cartModel.getAll({}, (err, carts) => {
    res.render('dashboard');
  });
};

// This function adds a product to the cart
exports.addToCart = (req, res) => {
  const errors = validationResult(req);
  if(errors.isEmpty()) {
    var product = req.params.id;
    var user = req.session.user;
    console.log('product(addtocart): ' + product);
    console.log('user(addtocart): ' + user);
    // console.log(req.session.name);
    if(!user) {
      console.log(user + ' ' + product); // testing
      res.redirect('/login');
    }
    else {
      cartModel.addProduct(user, product, 1, (err, cart) => {
        console.log('cart(addtocart): ' + cart);
        if(err) {
          req.flash('error_msg', 'Could not add product. Please try again.');
          return res.redirect('/cart');
        }
        else {
          req.flash('success_msg', 'You have added a new product to the cart!');
          return res.redirect('/cart');
        }
      });
    }
  }
};

exports.getUserCart = (req, res) => {
  const errors = validationResult(req);
  // console.log(errors);
  if(errors.isEmpty()) {
    var user = req.session.user;
    if (user) {
      cartModel.getByUser(user, (err, result) => {
        console.log('ayyyy');
        console.log('CART(GETBYUSER): ' + result.products[0].pName);
        if(result) {

          console.log(result.products); // testing

          res.render('cart', {
            layout: 'main-1',
            name: req.session.name,
            title: "My Cart", 
            loggedIn: user,
            products: result.products
          });
        }
        else {
          console.log(err);
        }
      });
    }
  }
  else {
    console.log(errors);
  }
};