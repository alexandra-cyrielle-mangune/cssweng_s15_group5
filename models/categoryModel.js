// Connects to the database via Mongoose
const mongoose = require('./connection');

// Initializes a new category schema
const categorySchema = new mongoose.Schema({
  name: {type: String, required: true},
  slug: {type: String}
});

// Creates a product object called `productModel`
const categoryModel = mongoose.model('categories', categorySchema);

// Exports the module
module.exports = categoryModel;