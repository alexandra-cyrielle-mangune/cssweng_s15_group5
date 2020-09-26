// Connects to the database via Mongoose
const mongoose = require('./connection');

// Initializes a new product schema
const productSchema = new mongoose.Schema({
  pName: {type: String, required: true},
  slug: {type: String},
  desc: {type: String, required: true},
  category: {type: String, required: true},
  price: {type: Number, required: true},
  img: {type: String}
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
  productModel.findOne(query).exec((err, result) => {
    if (err) throw err;
    next(err, result);
  });
};

exports.getAllIds = (query, next) => {
  productModel.find({'_id': {$in: query}}).exec((err, result) => {
    if (err) throw err;
    next(err, result);
  });
};
// Get a specific product from the database using ID
exports.getById = (query, next) => {
  productModel.findById(query).populate('_id').exec((err, result) => {
    if (err) throw err;
    next(err, result);
  });
};

// Update details of a specific product
exports.updateItem = (id, pName, desc, category, price, img, next) => {
  productModel.updateOne(
    {_id: id}, 
    {$set: {pName: pName, desc: desc, category, category, price: price, img: img}}, 
    (err,result) => {
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
exports.removeProduct = (id, next) => {
  productModel.deleteOne(id, (err, result) => {
    if (err) throw err;
    next(err, result);
  });
};