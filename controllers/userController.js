// userController.js controls the 

const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const {validationResult} = require('express-validator');

// This function registers a new user
exports.registerUser = (req, res) => {
  const errors = validationResult(req);
  if(errors.isEmpty()) {
    const {name, email, password} = req.body;
    console.log(req.body.name); // for testing

    // checks if the user already exists in the database
    // if the user already exists, the user is redirected to the login page
    // if not, then a new user will be created 
    userModel.getOne({email: email}, (err, result) => {
      if(result) {
        console.log(result); // for testing
        req.flash('error_msg', 'User already exists. Please login.');
        res.redirect('/login');
      }
      else {
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, hashed) => {
          const newUser = {
            name: name,
            email: email,
            password: hashed
          };
          userModel.create(newUser, (err, user) => {
            if(err) {
              req.flash('error_msg', 'Could not create user. Please try again.');
              res.redirect('/register');
            }
            else {
              console.log(user); // for testing
              req.flash('success_msg', 'You are now registered! Login below.');
              res.redirect('/login');
            }
          });
        });
      }
    });
  }
  else {
    const messages = errors.array().map((item) => item.msg);
    req.flash('error_msg', messages.join(' '));
    res.redirect('/register');
  }
};

// This function logs in a user
exports.loginUser = (req, res) => {
  const errors = validationResult(req);
  if(errors.isEmpty()) {
    const {email, password} = req.body;
    console.log(req.body.email); // for testing

    userModel.getOne({email: email}, (err, user) => {
      if(err) {
        req.flash('error_msg', 'Something happened! Please try again.');
        res.redirect('/login');
      }
      else {
        if(user) {
          bcrypt.compare(password, user.password, (err, result) => {
            if(result) {
              req.session.user = user._id;
              req.session.name = user.name;
              res.redirect('/home');
            }
            else {
              req.flash('error_msg', 'Incorrect password. Please try again.');
              res.redirect('/login');
            }
          });
        }
        else {
          req.flash('error_msg', 'No registered user with that email. Please register here.');
          res.redirect('/register');
        }
      }
    });
  }
  else {
    const messages = errors.array().map((item) => item.msg);
    req.flash('error_msg', messages.join(' '));
    res.redirect('/login');
  }
};

// This function logs out a user
exports.logoutUser = (req, res) => {
  if(req.session) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid')
      res.redirect('/');
    });
  }
}

// Missing: Admin login function