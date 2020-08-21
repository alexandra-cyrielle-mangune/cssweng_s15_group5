const router = require('express').Router();
const {isPublic} = require('../middlewares/checkAuth');

// Homepage
router.get('/', isPublic, (req, res) => {
  res.render('home', {
    title: 'Lipay',
    mastheadImg: 'img/masthead-banner-placeholder.jpg',
    featuresImg1: 'img/features-placeholder-1.jpg',
    featuresImg2: 'img/features-placeholder-2.jpg',
    featuresImg3: 'img/features-placeholder-3.jpg',
    featuresImg4: 'img/features-placeholder-4.jpg',
    catalogueLink: '/catalogue',
    contactUsLink: '/contact_us'
  });
});

// Catalogue
router.get('/catalogue', isPublic, (req, res) => {
  res.render('catalogue', {
    title: "Catalogue",
    products: [
      {img: 'img/features-placeholder-1.jpg',
      info: 'Placeholder Item #1',
      productDetailsLink: '/product_details',
      price: '₱ 250.00'},
      {img: 'img/features-placeholder-2.jpg',
      info: 'Placeholder Item #2',
      productDetailsLink: '/product_details',
      price: '₱ 150.00'},
      {img: 'img/features-placeholder-3.jpg',
      info: 'Placeholder Item #3',
      productDetailsLink: '/product_details',
      price: '₱ 200.00'},
      {img: 'img/features-placeholder-4.jpg',
      info: 'Placeholder Item #4',
      productDetailsLink: '/product_details',
      price: '₱ 450.00'}
    ],
    contactUsLink: '/contact_us'
  });
});

// Contact Us
router.get('/contact_us', isPublic, (req, res) => {
  res.render('contact', {title: "Talk to Us"});
});

module.exports = router;