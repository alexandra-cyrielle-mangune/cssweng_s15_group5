const router = require('express').Router();
const cartController = require('../controllers/cartController');
const {isPrivate} = require('../middlewares/checkAuth');

// add an item to the cart
router.get('/add_to_cart/:id', cartController.addToCart);
router.get('/add_checkout/:id', cartController.addToCartAndCheckout);

router.get('/delete_from_cart/:id', cartController.removeFromCart);

module.exports = router;