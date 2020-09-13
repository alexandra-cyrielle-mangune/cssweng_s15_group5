const router = require('express').Router();
const cartController = require('../controllers/cartController');
const {isPrivate} = require('../middlewares/checkAuth');

// add an item to the cart
router.get('/add_to_cart/:id', cartController.addToCart);

module.exports = router;