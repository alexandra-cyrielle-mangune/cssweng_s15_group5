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

// Create new product and save it in the database
exports.create = (obj, next) => {
  const product = new productModel(obj);
  product.save((err, product) => {
    if (err) throw err;
    next(err, product);
  });
};

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

// Get a specific product from the database
exports.getOne = (query, next) => {
  productModel.findOne(query).populate('_id').exec((err, result) => {
    if (err) throw err;
    next(err, result);
  });
};

// Update details of a specific product
exports.updateDetails = (num, name, img, desc, price, next) => {
  const filter = {_id: num, name: name};
  const update = {
    $set: {
      img: img,
      description: desc,
      price: price
    }
  };
  productModel.updateOne(filter, update, (err,result) => {
    if(err) throw err;
    next(err, result);
  });
};

// Delete all products
exports.deleteAll = (query, next) => {
  productModel.deleteMany({}, (err, result) => {
    if (err) throw err;
    next(err, result);
  });
};

// Delete a product
exports.deleteOne = (id, next) => {
  productModel.deleteOne({_id: id}, (err, result) => {
    if (err) throw err;
    next(err, result);
  });
};