const productModel = require('../models/productModel');
const {validationResult} = require('express-validator');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, file.filename);
  }
});
const upload = multer({ storage: storage });

// This functions gets all the products from the database 
// and displays them in the catalogue
exports.getAllProducts = (req, res) => {
  productModel.getAll({}, (err, products) => {
    res.render('catalogue', {
      name: req.session.name,
      title: 'Catalogue',
      products: products,
      loggedIn: req.session.user,
    });
  });
};

// This functions gets all the products from the database 
// and displays them in the admin 'view all products' pages
exports.viewAllProducts = (req, res) => {
  productModel.getAll({}, (err, products) => {
    res.render('viewItems', {
      title: 'Lipay',
      name: 'Admin Name',
      layout: 'main-admin',
      products: products
    });
  });
};

// Get a product then display its details
exports.getAProduct = (req, res) => {
  productModel.getOne({slug: req.params.slug}, (err, product) => {
    if(err) {
      console.log(err);
    }
    else {
      res.render('productDetails', {
        title: 'Lipay',
        name: req.session.name,
        pName: product.pName,
        desc: product.desc,
        img: '/' + product.img,
        price: product.price,
        _id: product._id,
        loggedIn: req.session.user,
      });
    }
  });
};

// Delete a Product
exports.deleteProduct = (req, res) => {
  var product_id = req.params._id;
  console.log(product_id);
  productModel.getOne({_id: product_id}, (err, product) => {
    if(err) {
      console.log(err);
    }
    else {
      productModel.removeProduct({_id: product_id}, (err, product) => {
        if(err) {
          console.log(err);
        }
        else {
          req.flash('success_msg', 'Successfully deleted a product!');
          res.redirect('/view_all_items');
        }
      })
    }
  });
};

// Edit a Product
exports.editProduct = (req, res) => {

};

// This function add a new product to the database
exports.addProduct = (req, res) => {
  const errors = validationResult(req);
  if(errors.isEmpty()) {
    var {pName, desc, pCat, price, prodImg} = req.body;
    
    console.log(prodImg); // testing

    // creates a slug from the product name
    var slug = req.body.pName.replace(/\s+/g, '-').toLowerCase();
    
    // error handling for image upload
    if(prodImg == undefined) {
      prodImg = 'img/tote-bag-1.jpg';
    }
    else {
      prodImg = 'uploads/' + prodImg;
    }

    productModel.getOne({slug: slug}, (err, result) => {
      if(result) {
        console.log(result); // for testing
        req.flash('error_msg', 'Product already exists.');
        res.redirect('/add_new_item');
      }
      else {
        const newProduct = {
          pName: pName,
          slug: slug,
          desc: desc,
          category: pCat,
          price: Math.round(price * 100) / 100.0,
          img: prodImg
        };
        productModel.create(newProduct, (err, product) => {
          if(err) {
            req.flash('error_msg', 'Could not create product. Please try again.');
            res.redirect('/add_new_item');
          }
          else {
            console.log(slug); // for testing
            req.flash('success_msg', 'You have added a new product in the catalogue!');
            res.redirect('/add_new_item');
          }
        });
      }
    });
  }
  else {
    const messages = errors.array().map((item) => item.msg);
    req.flash('error_msg', messages.join(' '));
    res.redirect('/add_new_item');
  }
};