const router = require('express').Router();
const productController = require('../controllers/productController');
const {isPrivate} = require('../middlewares/checkAuth');

var temp = [
  {img: 'img/features-placeholder-1.jpg',
  info: 'Placeholder Item #1',
  productDetailsLink: '/product_details_',
  price: '₱ 250.00'},
  {img: 'img/features-placeholder-2.jpg',
  info: 'Placeholder Item #2',
  productDetailsLink: '/product_details_',
  price: '₱ 150.00'},
  {img: 'img/features-placeholder-3.jpg',
  info: 'Placeholder Item #3',
  productDetailsLink: '/product_details_',
  price: '₱ 200.00'},
  {img: 'img/features-placeholder-4.jpg',
  info: 'Placeholder Item #4',
  productDetailsLink: '/product_details_',
  price: '₱ 450.00'}
];

// Homepage (private)
router.get('/', (req, res) => {
  res.render('home', {
    name: req.session.name,
    title: 'Lipay',
    layout: 'main',
    mastheadImg: 'img/masthead-banner-placeholder.jpg',
    products: temp,
    loggedIn: req.session.user
  });
});

// Catalogue
router.get('/catalogue', productController.getAllProducts);

// Contact Us
router.get('/contact_us', (req, res) => {
  res.render('contact', {
    name: req.session.name,
    title: "Talk to Us",
    img: 'img/contact-us-image.png',
    loggedIn: req.session.user,
  });
});

// Product Details (public)
router.get('/product_details', (req, res) => {
  res.render('productDetails', {
    name: req.session.name,
    title: 'Lipay',
    loggedIn: req.session.user,
  });
});

// Cart GET method
router.get('/cart', isPrivate, (req, res) => {
  res.render('cart', {
    name: req.session.name,
    title: "Lipay", 
    loggedIn: req.session.user,
  });
});

// Purchase History
router.get('/purchase_history', isPrivate, (req, res) => {
  res.render('purchaseHistory', {
    name: req.session.name,
    title: "Lipay", 
    loggedIn: req.session.user,
  });
});

// Purchase Details
router.get('/purchase_details', isPrivate, (req, res) => {
  res.render('purchaseDetails', {
    name: req.session.name,
    title: "Lipay", 
    loggedIn: req.session.user,
  });
});

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

module.exports = router;