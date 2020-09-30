const router = require('express').Router();
const cartController = require('../controllers/cartController');
const {isPrivate} = require('../middlewares/checkAuth');

// add an item to the cart
router.post('/add_to_cart/:id/', cartController.addToCart);

router.get('/delete_from_cart/:id', cartController.removeFromCart);

module.exports = router;