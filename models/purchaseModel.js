// Connects to the database via Mongoose
const mongoose = require('./connection');

// Initializes a new cart schema
const purchaseSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
  cartItems: [{
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true},
    quantity: {type: Number, required: true},
    total: {type: Number, required: true}
  }],
  shippingAddress: {type: String, required: true},
  billingAddress: {type: String, required: true},
  paymentMethod: {type: String, required: true},
});

// Creates a purchase object called `purchaseModel`
const purchaseModel = mongoose.model('purchase', cartSchema);

exports.create = (object, next) => {
  const purchase = new purchaseModel(purchase);
  purchase.save((err, user) => {
    next(err, user);
  });
};