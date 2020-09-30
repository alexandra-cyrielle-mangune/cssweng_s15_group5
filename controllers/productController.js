const productModel = require('../models/productModel');
const {validationResult} = require('express-validator');
const {productValidation} = require('../validators');
const multer = require('multer');

// const db = require('../setters/db');
// const mongoose = require('mongoose');
// const path = require('path');
// const crypto = require('crypto');
// const GridFsStorage = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');
// const initDb = require('../setters/db');
// const getDb = require('../setters/db');


// let gfs;
// var db = getDb();

// db.once('open', () => {
//   gfs = Grid(db, mongoose.mongo);
//   gfs.collection('uploads');
// });

// const storage = new GridFsStorage({
//   db: db,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buffer) => {
//         if(err) {
//           return reject(err);
//         }
//         const filename = buffer.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads'
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });

// function generateName(oldName) {
//   console.log(oldName.replace(/\s+/g, '-').toLowerCase());
//   return oldName.replace(/\s+/g, '-').toLowerCase();
// }

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function(req, file, cb) {
    cb(null,file.originalname);
    // console.log(generateName(file.originalname));
  }
});

const upload = multer({
  storage: storage
});

exports.addProduct = (req, res) => {
  const errors = validationResult(req);
  if(errors.isEmpty()) {

    var image;
    var {pName, desc, pCat, price} = req.body;
    var slug = req.body.pName.replace(/\s+/g, '-').toLowerCase();

    // console.log(req.file); // testing

    if(req.file == undefined || req.file == null || req.file == "") {
      req.flash('error_msg', "Please upload an image!");
      res.redirect('/add_new_item');
    }
    else {
      image = req.file;
      if(image == undefined || image == null || image == "") {
        image = 'img/tote-bag-1.jpg';
      }
      else {
        // image = "uploads/" + req.file.originalname.replace(/\s+/g, '-').toLowerCase();
        image = "uploads/" + req.file.originalname;
      }
    }

    console.log(image);

    productModel.getOne({slug: slug}, (err, result) => {
      if(result) {
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
          archive: false,
          feature: false,
          img: image
        };
        productModel.create(newProduct, (err, product) => {
          if(err) {
            req.flash('error_msg', 'Could not create product. Please try again.');
            res.redirect('/add_new_item');
          }
          else {
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

// Edit a Product
exports.editProduct = (req, res) => {

  var image;
  var {pName, desc, pCat, price} = req.body;
  var slug = req.body.pName.replace(/\s+/g, '-').toLowerCase();
  var product_id = req.params._id;

  productModel.getOne({_id: product_id}, (err, product) => {
    if(err) {
      req.flash('error_msg', "Product not found.");
      res.redirect('/view_all_items');
    }
    else {
      if(product) {
        if(pName == "") {
          pName = product.pName;
          slug = product.slug;
        }
        if(desc == "") {
          desc = product.desc;
        }
        if(pCat == "") {
          pCat = product.category;
        }
        if(price == "") {
          price = product.price;
        }
        else {
          price = Math.round(price * 100) / 100.0;
        }
        if(req.file == undefined || req.file == null || req.file == "") {
          image = product.img;
        }
        else {
          // image = "uploads/" + req.file.originalname.replace(/\s+/g, '-').toLowerCase();
          image = "uploads/" + req.file.originalname;
        }

        productModel.updateItem(product_id, pName, slug, desc, pCat, price, image, (err, result) => {
          if(err) {
            req.flash('error_msg', "There was a problem updating product details. Please try again.");
            res.redirect('/edit_item/' + product_id);
          }
          else {
            req.flash('success_msg', "Successfully updated product details of " + pName + ".");
            res.redirect('/edit_item/' + product_id);
          }
        });
      }
    }
  });
};


// This functions gets all the products from the database 
// and displays them in the catalogue
exports.getAllProducts = (req, res) => {
  var query = {archive: false};
  var sort = {pName: 1};
  if (req.body.category && req.body.category != 'No Filter') {
    query.category = req.body.category;
  }

  if (req.body.sort && req.body.sort != 'name') {
    if (req.body.sort == "asc") {
      sort = {price: 1, pName: 1}
    }
    else {
      sort = {price: -1, pName: 1};
    }
  }
  console.log('---');
  productModel.getMany(query, sort, (err, products) => {
    var categories = [];
    products.forEach(function(item){
      if (!categories.includes(item.category)) {
        categories.push(item.category);
      }
    });

    console.log(products);
    res.render('catalogue', {
      name: req.session.name,
      title: 'Catalogue',
      products: products,
      loggedIn: req.session.user,
      categories: categories
    });
  });
};

exports.refreshProducts = (req, res) => {
  var query = {archive: false};
  var sort = {pName: 1};
  if (req.body.category && req.body.category != 'No Filter') {
    query.category = req.body.category;
  }

  if (req.body.sort && req.body.sort != 'name') {
    if (req.body.sort == "asc") {
      sort = {price: 1, pName: 1}
    }
    else {
      sort = {price: -1, pName: 1};
    }
  }
  console.log('---');
  productModel.getMany(query, sort, (err, products) => {
    var categories = [];
    products.forEach(function(item){
      if (!categories.includes(item.category)) {
        categories.push(item.category);
      }
    });

    console.log(products);
    res.render('products', {
      layout: null,
      products: products,
    });
  });
}

// This functions gets all the products from the database 
// and displays them in the admin 'view all products' pages
exports.viewAllProducts = (req, res) => {
  productModel.getMany({archive: false}, {pName: 1}, (err, products) => {
    products.forEach((item)=> {
      item.price = item.price.toFixed(2);
    });
    res.render('viewItems', {
      title: 'Lipay | Administrator',
      name: 'Admin Name',
      layout: 'main-admin',
      products: products
    });
  });
};

exports.getArchivedItems = (req, res) => {
  productModel.getMany({archive: true}, {pName: 1}, (err, products) => {
    res.render('archivedItems', {
      title: 'Lipay | Administrator',
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
}

// Delete a Product
exports.deleteProduct = (req, res) => {
  var product_id = req.params._id;
  console.log("delete product: " + product_id);
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

// Get a product then display its details
exports.getProduct = (req, res) => {
  var product_id = req.params._id;
  productModel.getById({_id: product_id}, (err, product) => {
    console.log("editPRoduct: " + req.params._id + " " + req.body.slug); // for testing
    if(err) {
      console.log(err);
    }
    else {
      res.render('editItem', {
        title: 'Lipay | Administrator',
        id: product_id,
        pName: product.pName,
        desc: product.desc,
        category: product.category,
        price: product.price,
        img: product.img,
        layout: 'main-admin'
      });
    }
  });
};

// Archive an item
exports.archiveItem = (req, res) => {
  var product_id = req.params._id;

  productModel.getOne({_id: product_id}, (err, product) => {
    if(err) {
      req.flash('error_msg', "Something went wrong. Please try again.");
      res.redirect('/view_all_items');
    }
    else {
      productModel.archive(product_id, (err, result) => {
        if(err) {
          req.flash('error_msg', "Something went wrong. Please try again.");
          res.redirect('/view_all_items');
        }
        else {
          req.flash('success_msg', "Successfully archived an item!");
          res.redirect('/view_all_items');
        }
      });
    }
  });
};

// Unarchive an item
exports.unarchiveItem = (req, res) => {
  var product_id = req.params._id;

  productModel.getOne({_id: product_id}, (err, product) => {
    if(err) {
      req.flash('error_msg', "Something went wrong. Please try again.");
      res.redirect('/archived_items');
    }
    else {
      productModel.unarchive(product_id, (err, result) => {
        if(err) {
          req.flash('error_msg', "Something went wrong. Please try again.");
          res.redirect('/archived_items');
        }
        else {
          req.flash('success_msg', "Successfully unarchived an item!");
          res.redirect('/archived_items');
        }
      });
    }
  });
};

exports.featureItem = (req, res) => {
  var product_id = req.params._id;

  productModel.getOne({_id: product_id}, (err, product) => {
    if(err) {
      req.flash('error_msg', "Something went wrong. Please try again.");
      res.redirect('/view_all_items');
    }
    else {
      productModel.feature(product_id, (err, result) => {
        if(err) {
          req.flash('error_msg', "Something went wrong. Please try again.");
          res.redirect('/view_all_items');
        }
        else {
          req.flash('success_msg', "Successfully featured an item!");
          res.redirect('/view_all_items');
        }
      });
    }
  });
};

exports.unfeatureItem = (req, res) => {
  var product_id = req.params._id;

  productModel.getOne({_id: product_id}, (err, product) => {
    if(err) {
      req.flash('error_msg', "Something went wrong. Please try again.");
      res.redirect('/featured_items');
    }
    else {
      productModel.unfeature(product_id, (err, result) => {
        if(err) {
          req.flash('error_msg', "Something went wrong. Please try again.");
          res.redirect('/featured_items');
        }
        else {
          req.flash('success_msg', "Successfully unfeatured an item!");
          res.redirect('/featured_items');
        }
      });
    }
  });
};

exports.getFeaturedItems = (req, res) => {
  productModel.getMany({feature: true, archive: false}, {pName: 1}, (err, products) => {
    res.render('featuredItems', {
      title: 'Lipay | Administrator',
      name: 'Admin Name',
      layout: 'main-admin',
      products: products
    });
  });
};

exports.displayFeaturedItems = (req, res) => {
  productModel.getMany({feature: true, archive: false}, {pName: 1}, (err, products) => {
    res.render('home', {
      name: req.session.name,
      title: 'Lipay',
      mastheadImg: 'img/masthead-banner-placeholder.jpg',
      products: products,
      loggedIn: req.session.user
    });
  })
}