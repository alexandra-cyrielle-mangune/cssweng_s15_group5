const mongoose = require('../models/connection');
const router = express.Router();
const productModel = require('../models/productModel');

/*
 *  GET method: Add Product to Cart 
*/
router.get('/add_to_cart/:product', (req, res) => {
  const slug = req.params.product;

  productModel.findOne({slug: slug}, (err, product) => {
    if(err) throw err;
  });
});
