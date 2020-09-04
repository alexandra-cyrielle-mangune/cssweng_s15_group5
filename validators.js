const {body} = require('express-validator');

const registerValidation = [
  // Name should not be empty
  body('name').not().isEmpty().withMessage("Name is required."),

  // Email should not be empty
  body('email').not().isEmpty().withMessage("Email is required."),

  // Email should be in a valid format
  body('email').isEmail().withMessage("Please provide a valid email."),

  // Password needs to be minimum 8 characters
  body('password').isLength({min: 8, max: 32}).withMessage("Password must be 8-32 characters."),

  // Confirm password needs to be minimum 8 characters
  body('confirm').isLength({min: 8, max: 32}).withMessage("Confirm passowrd must be 8-32 characters."),

  // Confirm passowrd needs to match req.body.password
  body('confirm').custom((value, {req}) => {
    if(value !== req.body.password) {
      throw new Error("Passwords do not match.");
    }
    return true;
  })
];

const loginValidation = [
  // Email should not be empty
  body('email').not().isEmpty().withMessage("Email is required."),

  // Email should be in a valid format
  body('email').isEmail().withMessage("Please provide a valid email."),

  // Password should not be empty
  body('password').not().isEmpty().withMessage("Password is required.")
];

const adminValidation = [
  // Username should not be empty
  body('username').not().isEmpty().withMessage("Username is required."),

  // Password should not be empty
  body('password').not().isEmpty().withMessage("Password is required.")
];

const productValidation = [
  // Product name should not be empty
  body('pName').not().isEmpty().withMessage('Product name is required.'),

  // Product description should not be empty
  body('desc').not().isEmpty().withMessage('Product description is required.'),

  // Product category should not be empty
  body('pCat').not().isEmpty().withMessage('Product category is required.'),

  // Product price should not be empty
  body('price').not().isEmpty().withMessage('Product price should not be empty.')
];

// Update exports
module.exports = {registerValidation, loginValidation, adminValidation, productValidation};