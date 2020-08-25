// Connects to the database via Mongoose
const mongoose = require('./connection');

// Initializes a new cart schema
const cartSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
  product: {type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true},
  quantity: {type: Int32Array, required: true}
});

// Creates a cart object called `cartModel`
const cartModel = mongoose.model('cart', cartSchema);

// Get a cart of a specific user
exports.getByUser = (user, next) => {
  cartSchema.find({user: user}, (err, cart) => {
    next(err, cart);
  });
};

// Add a product to the cart



// Delete a product from the cart


// Delete all products from the cart