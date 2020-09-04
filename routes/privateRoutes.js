const router = require('express').Router();
const {isPrivate, isPublic} = require('../middlewares/checkAuth');

// Homepage (private)
// router.get('/home', isPrivate, (req, res) => {
router.get('/home', isPublic, (req, res) => {
  res.render('home', {
    name: 'Username',
    title: 'Lipay',
    layout: 'main-private',
    mastheadImg: 'img/masthead-banner-placeholder.jpg',
    products: [
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
    ],
    catalogueLink: '/catalogue_',
    contactUsLink: '/contact_us_'
  });
});

// Catalogue (private)
// router.get('/catalogue_', isPrivate, (req, res) => {
router.get('/catalogue_', isPublic, (req, res) => {
  res.render('catalogue', {
    name: 'Username',
    title: "Catalogue",
    layout: 'main-private',
    products: [
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
    ],
    contactUsLink: '/contact_us_'
  });
});

// Product Details (private)
// router.get('/product_details_', isPrivate, (req, res) => {
router.get('/product_details_', isPublic, (req, res) => {
  res.render('productDetails', {
    name: 'Username',
    title: 'Lipay', 
    layout: 'main-private',
    addToCart: '/add_to_cart',
    checkout: 'checkout'
  });
});

// Contact Us (private)
// router.get('/contact_us_', isPrivate, (req, res) => {
router.get('/contact_us_', isPublic, (req, res) => {
  res.render('contact', {
    name: 'Username',
    title: 'Talk to Us', 
    layout: 'main-private',
    img: 'img/contact-us-image.png'
  });
});

// Cart GET method
// router.get('/cart', isPrivate, (req, res) => {
router.get('/cart', isPublic, (req, res) => {
  res.render('cart', {
    name: 'Username',
    title: "Lipay", 
    layout: 'main-private'
  });
});

// Purchase History
// router.get('/purchase_history', isPrivate, (req, res) => {
router.get('/purchase_history', isPublic, (req, res) => {
  res.render('purchaseHistory', {
    name: 'Username',
    title: "Lipay", 
    layout: 'main-private'
  });
});

// Purchase Details
// router.get('/purchase_details', isPrivate, (req, res) => {
router.get('/purchase_details', isPublic, (req, res) => {
  res.render('purchaseDetails', {
    name: 'Username',
    title: "Lipay", 
    layout: 'main-private'
  });
});

// User Settings
// router.get('/settings', isPrivate, (req, res) => {
router.get('/settings', isPublic, (req, res) => {
  res.render('settings', {
    name: 'Username',
    title: "Lipay", 
    layout: 'main-private'
  });
});

// Billing
// router.get('/billing', isPrivate, (req, res) => {
router.get('/billing', isPublic, (req, res) => {
  res.render('billing', {
    name: req.session.name,
    title: "Lipay", 
    layout: 'main-private'
  });
});

// Payment Details (Online Payment / GCash)
router.get('/payment_details', isPublic, (req, res) => {
  res.render('paymentDetails', {
    name: req.session.name,
    title: "Lipay", 
    layout: 'main-private'
  });
});

module.exports = router;