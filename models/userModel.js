// Connects to the database via Mongoose
const mongoose = require('./connection');

// Initializes a new user schema
const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, min: 8, required: true}
});

// Creates a user object called `userModel`
const userModel = mongoose.model('users', userSchema);

// This function creates a new user
exports.create = (object, next) => {
  const user = new userModel(object);
  user.save((err, user) => {
    next(err, user);
  });
};

// This function looks for one existing user in the database
exports.getOne = (query, next) => {
  userModel.findOne(query, (err, user) => {
    next(err, user);
  });
};