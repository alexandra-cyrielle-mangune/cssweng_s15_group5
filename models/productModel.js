// Connects to the database via Mongoose
const mongoose = require('./connection');
const { Double } = require('bson');

// Initializes a new product schema
const productSchema = new mongoose.Schema({
  _id: {type: Number, required: true},
  name: {type: String, required: true},
  img: {type: String, required: true},
  description: {type: String, required: true},
  price: {type: Double, required: true}
});

// Creates a product object called `productModel`
const productModel = mongoose.model('products', productSchema);

// Get all products from the database
exports.getAll = (query, next) => {
  productModel.find({}).exec((err, products) => {
    if (err) throw err;
    const productObjects = [];
    products.forEach((doc) => {
      productObjects.push(doc.toObject());
    });
    next(err, productObjects);
  });
};