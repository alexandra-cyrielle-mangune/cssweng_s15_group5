const router = require('express').Router();
const {isPrivate} = require('../middlewares/checkAuth');

// Homepage (private)
router.get('/home', isPrivate, (req, res) => {
  res.render('home', {
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
router.get('/catalogue_', isPrivate, (req, res) => {
  res.render('catalogue', {
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
router.get('/product_details_', isPrivate, (req, res) => {
  res.render('productDetails', {title: 'Lipay', layout: 'main-private'});
});

// Contact Us (private)
router.get('/contact_us_', isPrivate, (req, res) => {
  res.render('contact', {title: 'Talk to Us', layout: 'main-private'});
});

// Cart
router.get('/cart', isPrivate, (req, res) => {
  res.render('cart', {title: "Lipay", layout: 'main-private'});
});

// Purchase History
router.get('/purchase_history', isPrivate, (req, res) => {
  res.render('purchaseHistory', {title: "Lipay", layout: 'main-private'});
});

// Purchase Details
router.get('/purchase_details', isPrivate, (req, res) => {
  res.render('purchaseDetails', {title: "Lipay", layout: 'main-private'});
});

// User Settings
router.get('/settings', isPrivate, (req, res) => {
  res.render('settings', {title: "Lipay", layout: 'main-private'});
});

// Billing
router.get('/billing', isPrivate, (req, res) => {
  res.render('billing', {title: "Lipay", layout: 'main-private'});
});

module.exports = router;