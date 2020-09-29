// Connects to the database via Mongoose
const mongoose = require('./connection');

// Initializes a new product schema
const productSchema = new mongoose.Schema({
  pName: {type: String, required: true},
  slug: {type: String},
  desc: {type: String, required: true},
  category: {type: String, required: true},
  price: {type: Number, required: true},
  archive: {type: Boolean, required: true},
  feature: {type: Boolean, required: true},
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

// Get specific products from the database
exports.getMany = (query, sort, next) => {
  productModel.find(query).sort(sort).exec((err, products) => {
    if(err) throw err;
    const productObjects = [];
    products.forEach((doc) => {
      productObjects.push(doc.toObject());
    });
    next(err, productObjects);
  })
}

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
exports.updateItem = (id, pName, slug, desc, category, price, img, next) => {
  productModel.updateOne(
    {_id: id}, 
    {$set: {pName: pName, slug: slug, desc: desc, category: category, price: price, img: img}}, 
    (err,result) => {
    if(err) throw err;
    next(err, result);
  });
};

// Archive an item
exports.archive = (id, next) => {
  productModel.updateOne({_id: id}, {$set: {archive: true}}, (err,result) => {
    if(err) throw err;
    next(err, result);
  });
};

// Unarchive an item
exports.unarchive = (id, next) => {
  productModel.updateOne({_id: id}, {$set: {archive: false}}, (err,result) => {
    if(err) throw err;
    next(err, result);
  });
};

// Feature an item
exports.feature = (id, next) => {
  productModel.updateOne({_id: id}, {$set: {feature: true}}, (err,result) => {
    if(err) throw err;
    next(err, result);
  });
};

// Unfeature an item
exports.unfeature = (id, next) => {
  productModel.updateOne({_id: id}, {$set: {feature: false}}, (err,result) => {
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