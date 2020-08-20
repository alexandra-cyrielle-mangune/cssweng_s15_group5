const router = require('express').Router();
const {isPrivate} = require('../middlewares/checkAuth');

// Homepage - private
router.get('/home', isPrivate, (req,res) => {
  res.render('home-private', {title: "Lipay", layout: 'main-private'});
});

// Shop - private
router.get('/my_catalogue', isPrivate, (req, res) => {
  res.render('catalogue-private', {title: 'Lipay', layout: 'main-private'});
});

// Contact Us - private
router.get('/contact_us_', isPrivate, (req, res) => {
  res.render('contact', {title: 'Lipay', layout: 'main-private'});
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