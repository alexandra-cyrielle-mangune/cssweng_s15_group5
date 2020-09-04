const router = require('express').Router();
const productModel = require('../models/productModel');
const cartModel = require('../models/cartModel');

router.get('/add_to_cart', (req, res) => {
  var productId = req.params.id;

  // if a cart already exists in the session, pass it
  // otherwise, pass an empty object
  var cart = new cartModel(req.session.cart ? req.session.cart: {});

  productModel.getById({id: productId}, (err, product) => {
    if(err) throw err;
    cart.add(product, product.id);
    req.session.cart = cart;
    res.redirect('/');
  });
});

module.exports = router;