// Connects to the database via Mongoose
const mongoose = require('./connection');
const cartModel = require('./cartModel');

// Initializes a new cart schema
const purchaseSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
  cartItems: [{
    pName: {type: String, required: true},
    id: {type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true},
    qty: {type: Number, required: true},
    subPrice: {type: Number, required: true}
  }],
  shippingAddress: {type: String, required: true},
  billingAddress: {type: String, required: true},
  paymentMethod: {type: String, required: true, enum: ['CoD', 'Online', 'Bank Transfer']},
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
};

exports.getByStatus = (query, next) => {
  purchaseModel.find({status: query}).exec((err, purchases) => {
    if (err) throw err;
    const purchasesArr = [];
    purchases.forEach((doc) => {
      purchasesArr.push(doc.toObject());
    });
    next(err, purchasesArr);
  });
};

exports.makePurchase = (details, next) => {
  var {shipping, billing, transactionType, user} = details;
  cartModel.getByUser(user, next);

};