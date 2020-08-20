const router = require('express').Router();
const {isPublic} = require('../middlewares/checkAuth');

// Homepage
router.get('/', isPublic, (req, res) => {
  res.render('home', {title: "Lipay"});
});

// Catalogue
router.get('/catalogue', isPublic, (req, res) => {
  res.render('catalogue', {title: "Lipay"});
});

// Contact Us
router.get('/contact_us', isPublic, (req, res) => {
  res.render('contact', {title: "Talk to Us"});
});

module.exports = router;