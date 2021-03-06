const router = require('express').Router();
const userController = require('../controllers/userController');
const { registerValidation, loginValidation, adminValidation } = require('../validators.js');
const { isPublic, isPrivate } = require('../middlewares/checkAuth.js');

// GET method for login
router.get('/login', isPublic, (req, res) => {
  res.render('login', {
    title: 'Log In',
    img: 'img/login-image-placeholder.jpg'
  });
});

// GET method for register
router.get('/register', isPublic, (req, res) => {
  res.render('register', {
    title: 'Create a New Account',
    img: 'img/register-image-placeholder.jpg'
  });
});

// GET method for admin login
router.get('/admin', isPublic, (req, res) => {
  res.render('admin', {
    title: 'Log In as Admin',
  });
});

// GET method for logout
router.get('/logout', isPrivate, userController.logoutUser);

// POST methods for form submissions
router.post('/login', isPublic, loginValidation, userController.loginUser);
router.post('/register', isPublic, registerValidation, userController.registerUser);
router.post('/admin', isPublic, adminValidation, userController.adminLogin);

module.exports = router;