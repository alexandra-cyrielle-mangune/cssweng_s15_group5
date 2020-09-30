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
    var quantity = 1;

    if (req.body.qty){
      quantity = parseInt(req.body.qty);
    }


    if(!user) {
      console.log(user + ' ' + product); // testing
      res.redirect('/login');
    }
    else {
      if (req.body.btnPressed == "Add to Cart"){
        productModel.getOne({_id: product}, (err, cart) => {
          if (err) throw err;
          var slug = cart.toObject().slug;
          cartModel.addProduct(user, product, quantity, (err, cart) => {
            console.log('cart(addtocart): ' + cart);
            if(err) {
              req.flash('error_msg', 'Could not add product. Please try again.');
              return res.redirect('/product_details/' + slug);
            }
            else {
              req.flash('success_msg', 'You have added a new product to the cart!');
              return res.redirect('/product_details/' + slug);
            }
          });
        });
      }
      else if (req.body.btnPressed = "Add and Checkout"){
        cartModel.addProduct(user, product, quantity, (err, cart) => {
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
  }
};

exports.removeFromCart = (req, res) => {
  const errors = validationResult(req);
  if(errors.isEmpty()) {
    var product = req.params.id;
    var user = req.session.user;
    console.log('product(deletefromcart): ' + product);
    console.log('user(deletefromcart): ' + user);
    if(!user) {
      console.log(user + ' ' + product); // testing
      res.redirect('/login');
    }
    else {
      cartModel.removeProduct(user, product, (err, cart) => {
        console.log('cart(deletefromcart): ' + cart);
        if(err) {
          req.flash('error_msg', 'Could not remove product. Please try again.');
          return res.redirect('/cart');
        }
        else {
          req.flash('success_msg', 'You have removed a product from the cart!');
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
        // console.log('ayyyy');
        // console.log('CART(GETBYUSER): ' + result.products[0].pName);
        if(result) {
          res.render('cart', {
            name: req.session.name,
            title: "My Cart", 
            loggedIn: user,
            products: result.products,
            total: result.total
          });
        }
        else {
          console.log(err);
          res.render('cart', {
            name: req.session.name,
            title: "My Cart", 
            loggedIn: user,
            products: null
          });
        }
      });
    }
  }
  else {
    console.log(errors);
  }
};