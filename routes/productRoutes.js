const router = require('express').Router();
const {isPublic, isPrivate} = require('../middlewares/checkAuth');

// Product details (public)
router.get('/product_details', isPublic, (req, res) => {
  res.render('productDetails', {title: 'Lipay'});
});

// Product details (private)
router.get('/product_details_', isPrivate, (req, res) => {
  res.render('productDetails', {title: 'Lipay', layout: 'main-private'});
});

module.exports = router;