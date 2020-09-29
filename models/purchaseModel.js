// Connects to the database via Mongoose
const mongoose = require('./connection');
const cartModel = require('./cartModel');
const userModel = require('./userModel');
const dateFormat = require('dateformat');

// Initializes a new cart schema
const purchaseSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
  cartItems: [{
    pName: {type: String, required: true},
    id: {type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true},
    qty: {type: Number, required: true},
    img: {type: String},
    subPrice: {type: Number, required: true}
  }],
  shippingAddress: {type: String, required: true},
  billingAddress: {type: String, required: true},
  paymentMethod: {type: String, required: true, enum: ['CoD', 'Online', 'Bank Transfer']},
  purchaseDate: {type: Date, required: true, default: Date.now()},
  status: {
    type: String, 
    required: true, 
    enum: ['Awaiting Proof of Payment', 'Awaiting Confirmation', 'Preparing Order', 'Sent For Delivery', 'Delivered']
  },
  totalPrice: {type: Number, required: true}
});

// Creates a purchase object called `purchaseModel`
const purchaseModel = mongoose.model('purchase', purchaseSchema);

exports.create = (obj, next) => {
  const purchase = new purchaseModel(obj);
  purchase.save((err, purchase) => {
    if (err) throw err;
    next(err, purchase);
  });
}

exports.getByQuery = (query, next) => {
  purchaseModel.find(query).exec((err, purchases) => {
    if (err) throw err;
    const purchasesArr = [];
    purchases.forEach((doc) => {
      purchasesArr.push(doc.toObject());
    });
    next(err, purchasesArr);
  });
}

exports.getByID = (id, next) => {
  purchaseModel.findById(id).exec((err, purchase) => {
    if (err) throw err;
    next(err, purchase.toObject());
  });
}

exports.getAll = (query, next) => {
  purchaseModel.find({}).exec((err, products) => {
    if (err) throw err;
    const productObjects = [];
    i=0;
    products.forEach((doc) => {
      productObjects.push(doc.toObject());
      temp = dateFormat(productObjects[i].purchaseDate, "mm/dd/yyyy");
      productObjects[i].purchaseDate = temp;
      // console.log(temp); // testing
      i++;
    });
    next(err, productObjects);
  });
};

exports.editStatus = (id, newStatus, next) => {
  purchaseModel.updateOne(id, {$set: {status: newStatus}}, (err, result) => {
    if (err) throw err;
    next(err, result);
  })
};