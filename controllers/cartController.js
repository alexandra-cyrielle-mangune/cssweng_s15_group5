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
    var product = req.params.product;
    var user = req.session.user;
    if(!user) {
      console.log(user + ' ' + product); // testing
      res.redirect('/login');
    }
    else {
      cartModel.getByUser({user: user}, (err, result) => {
        if(result) {
          cartModel.addProduct(user, product, (err, cart) => {
            if(err) {
              req.flash('error_msg', 'Could not add product. Please try again.');
              res.redirect('/cart');
            }
            else {
              console.log(product); // for testing
              req.flash('success_msg', 'You have added a new product to the cart!');
              res.redirect('/cart');
            }
          });
        }
        else {
          const newCart = {
            prod: product,
            user: user,
            checkout: false
          };
          cartModel.create(newCart, (err, cart) => {
            if(err) {
              req.flash('error_msg', 'Could not add product. Cart does not exist.');
              res.redirect('/cart');
            }
            else {
              console.log("success! " + product); // for testing
              req.flash('success_msg', 'You have added a new product to the cart!');
              res.redirect('/cart');
            }
          });
        }
      });
    }
  }
};

exports.getUserCart = (req, res) => {
  const errors = validationResult(req);
  if(errors.isEmpty()) {
    var user = req.session.user;
    if(!user) {
      console.log(user + ' ' + product); // testing
      res.redirect('/cart');
    }
  }
  else {
    cartModel.getByUser({user: user}, (err, result) => {
      if(result) {
        res.render('cart', {
          name: req.session.name,
          title: "My Cart", 
          loggedIn: req.session.user,
          product: result
        });
      }
      else {
        console.log(err);
      }
    });
  }
};