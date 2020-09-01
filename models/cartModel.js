// Connects to the database via Mongoose
const mongoose = require('./connection');

// Initializes a new cart schema
const cartSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
  cartItems: [{
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true},
    quantity: {type: Number, required: true},
    total: {type: Number, required: true}
  }],
});

// Creates a cart object called `cartModel`
const cartModel = mongoose.model('cart', cartSchema);

// Get a cart of a specific user
exports.getByUser = (user, next) => {
  cartSchema.find({user: user}, (err, cart) => {
    next(err, cart);
  });
};