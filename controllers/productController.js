const productModel = require('../models/productModel');

exports.getAllProducts = (req, res) => {
  productModel.getAll({}, (err, products) => {
    res.render('catalogue', {
      title: 'Catalogue',
      products: products});
  });
};