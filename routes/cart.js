const mongoose = require('../models/connection');
const router = express.Router();
const productModel = require('../models/productModel');

/*
 *  GET method: Add Product to Cart 
 */
router.get('/add_to_cart/:product', (req, res) => {
  const slug = req.params.product;

  productModel.findOne({slug: slug}, (err, product) => {
    if(err) console.log(err);
    if(typeof req.session.cart == "undefined") {
      req.session.cart = [];
      req.session.cart.push({
        title: slug,
        quantity: 1,
        price: parseFloat(product.price).toFixed(2),
        img: "test" // testing
      });
    }
    else {
      var cart = req.session.cart;
      var newItem = true;
      for(var i=0; i<cart.length; i++) {
        if(cart[i].title == slug) {
          cart[i].quantity++;
          newItem = false;
          break;
        }
      }
      if(newItem) {
        cart.push({
          title: slug,
          quantity: 1,
          price: parseFloat(product.price).toFixed(2),
          img: "test" // testing
        });
      }
    }
    console.log(req.session.cart); // testing
    req.flash('success', 'Product added!');
    res.redirect('back');
  });
});

/*
 * GET method: Checkout Cart
 */
router.get('/checkout', (req, res) => {
  if(req.session.cart && req.session.cart.length == 0) {
    delete req.session.cart;
    res.redirect('/cart/checkout');
  }
  else {
    res.render('checkout', {title: 'Checkout', cart: req.session.cart});
  }
});

/*
 * GET method: Update Product in Cart
 */
router.get('/update/:product', (req, res) => {
  var slug = req.params.product;
  var cart = req.session.cart;
  var action = req.query.action;

  for(var i=0; i<cart.length; i++) {
    if(cart[i].title == slug) {
      switch(action) {
        case "add":
          cart[i].quantity++;
          break;
        case "remove":
          if(cart[i].quantity < 1) {
            cart.splice(i, 1);
          }
          break;
        case "clear":
          cart.splice(i, 1);
          if(cart.length == 0) {
            delete req.session.cart;
          }
          break;
        default:
          console.log('update problem');
          break;
      }
      break;
    }
  }
  req.flash('success', 'Cart updated!');
  res.redirect('/cart/checkout');
});

/*
 *  GET method: Clear Cart 
 */
router.get('/clear', (req, res) => {
  delete req.session.cart;
  req.flash('success', 'Cart cleared!');
  res.redirect('/cart/checkout');
});

/*
 *  GET method: Buy Now 
 */
router.get('/buynow', (req, res) => {
  delete req.session.cart;
  res.sendStatus(200);
});

// Exports
module.exports = router;