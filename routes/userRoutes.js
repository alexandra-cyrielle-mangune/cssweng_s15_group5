const router = require('express').Router();
const cartController = require('../controllers/cartController');
const productController = require('../controllers/productController');
const purchaseController = require('../controllers/purchaseController');
const {purchaseValidation} = require('../validators.js');
const {isPrivate} = require('../middlewares/checkAuth');
const { purchase } = require('../controllers/purchaseController');

// Homepage
router.get('/', productController.displayFeaturedItems);

// Catalogue
router.get('/catalogue', productController.getAllProducts);
router.post('/catalogue', productController.refreshProducts);

// Contact Us
router.get('/contact_us', (req, res) => {
  res.render('contact', {
    name: req.session.name,
    title: "Talk to Us",
    img: 'img/contact-us-image.png',
    loggedIn: req.session.user,
  });
});

// Product Details
router.get('/product_details/:slug', productController.getAProduct);

// Cart GET method
router.get('/cart', isPrivate, cartController.getUserCart);

// Purchase History
router.get('/purchase_history', isPrivate, purchaseController.getPurchaseHistory);

// Purchase Details
router.get('/purchase_details/:slug', isPrivate, purchaseController.getPurchaseDetails);

// User Settings
router.get('/settings', isPrivate, (req, res) => {
  res.render('settings', {
    name: req.session.name,
    title: "Lipay", 
    loggedIn: req.session.user,
  });
});

// Billing
router.get('/billing', isPrivate, (req, res) => {
  res.render('billing', {
    name: req.session.name,
    title: "Lipay", 
    loggedIn: req.session.user,
  });
});

// Payment Details (Online Payment / GCash)
router.get('/payment_details', isPrivate, (req, res) => {
  res.render('paymentDetails', {
    name: req.session.name,
    title: "Lipay", 
    loggedIn: req.session.user,
  });
});

router.post('/billing', isPrivate, purchaseValidation, purchaseController.purchase);

module.exports = router;