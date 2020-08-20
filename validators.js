const {body} = require('express-validator');

const registerValidation = [
  // Name should not be empty
  body('name').not().isEmpty().withMessage("Name is required."),

  // Email should not be empty
  body('email').not().isEmpty().withMessage("Email is required."),

  // Email should be in a valid format
  body('email').isEmail().withMessage("Please provide a valid email."),

  // Password needs to be minimum 8 characters
  body('password').isLength({min: 8}).withMessage("Password must be at least 8 characters."),

  // Confirm password needs to be minimum 8 characters
  body('confirm').isLength({min: 8}).withMessage("Confirm passowrd must be at least 8 characters."),

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

// Update exports
module.exports = {registerValidation, loginValidation};