// Connects to the database via Mongoose
const mongoose = require('./connection');

// Initializes a new cart schema
const purchaseSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
  cartItems: [{
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true},
    quantity: {type: Number, required: true},
    priceEach: {type: Number, required: true}
  }],
  shippingAddress: {type: String, required: true},
  billingAddress: {type: String, required: true},
  paymentMethod: {type: String, required: true},
  status: {type: String, required: true, enum: ['CoD', 'GCash', 'Bank Transfer']},
});

// Creates a purchase object called `purchaseModel`
const purchaseModel = mongoose.model('purchase', purchaseSchema);

exports.create = (object, next) => {
  const purchase = new purchaseModel(purchase);
  purchase.save((err, user) => {
    next(err, user);
  });
};

exports.getByStatus = (query, next) => {
  cartModel.find({status: query}).exec((err, purchases) => {
    if (err) throw err;
    const purchasesArr = [];
    purchases.forEach((doc) => {
      purchasesArr.push(doc.toObject());
    });
    next(err, purchasesArr);
  });
};
