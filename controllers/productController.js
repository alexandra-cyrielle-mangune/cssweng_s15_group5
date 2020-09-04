const productModel = require('../models/productModel');
const {validationResult} = require('express-validator');

// This functions gets all the products from the database
exports.getAllProducts = (req, res) => {
  productModel.getAll({}, (err, products) => {
    res.render('catalogue', {
      title: 'Catalogue',
      products: products});
  });
};

// This function add a new product to the database
exports.addProduct = (req, res) => {
  const errors = validationResult(req);
  if(errors.isEmpty()) {
    var {pName, desc, pCat, price, img} = req.body;
    var slug = req.body.pName.replace(/\s+/g, '-').toLowerCase();
    if(img == undefined) var temp = 'img/tote-bag-1.jpg';

    productModel.getOne({slug: slug}, (err, result) => {
      if(result) {
        console.log(result); // for testing
        req.flash('error_msg', 'Product already exists.');
        res.redirect('/add_new_item');
      }
      else {
        const newProduct = {
          name: pName,
          slug: slug,
          desc: desc,
          category: pCat,
          price: price,
          img: temp
        };
        productModel.create(newProduct, (err, product) => {
          if(err) {
            req.flash('error_msg', 'Could not create product. Please try again.');
            res.redirect('/add_new_item');
          }
          else {
            console.log(slug); // for testing
            req.flash('success_msg', 'You have added a new product in the catalogue!');
            res.redirect('/add_new_item');
          }
        });
      }
    });
  }
  else {
    const messages = errors.array().map((item) => item.msg);
    req.flash('error_msg', messages.join(' '));
    res.redirect('/add_new_item');
  }
}