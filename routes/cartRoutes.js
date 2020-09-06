const router = require('express').Router();
const productModel = require('../models/productModel');
const cartModel = require('../models/cartModel');
const e = require('express');

router.get('/my_cart', (req, res) => {
  if(!req.session.cart) {
    return res.render('cart', {products: null});
  }
  else {
    var cart = new cartModel(req.session.cart);
    res.render('cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
  }
})

router.get('/add_to_cart/:id', (req, res) => {
  var productId = req.params.id;
  var cart = new cartModel(req.session.cart ? req.session.cart: {});
  productModel.findById(productId, (err, product) => {
    if (err) {
      return res.rendirect('/home');
    }
    cart.add(product, productId);
    req.session.cart = cart;
    console.log(req.session.cart); // for testing
    res.redirect('/home')
  });
});

module.exports = router;