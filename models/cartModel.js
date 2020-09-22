// Connects to the database via Mongoose
const mongoose = require('./connection');
const { ObjectID } = require('mongodb');
const e = require('express');
const productModel = require('./productModel');

// Initializes a new cart schema
const cartSchema = new mongoose.Schema({
  prod: [
    {
      id: {type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true},
      qty: {type: Number, required: true},
    }
  ],
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
  checkout: {type: Boolean, required: true},
});
// Creates a cart object called `cartModel`
const cartModel = mongoose.model('cart', cartSchema);

exports.create = (obj, next) => {
  const cart = new cartModel(obj);
  cart.save((err, cart) => {
    if (err) throw err;
    next(err, cart);
  });
};

// Get all carts
exports.getAll = (query, next) => {
  cartModel.find({}).exec((err, carts) => {
    if (err) throw err;
    const cartObjects = [];
    carts.forEach((doc) => {
      cartObjects.push(doc.toObject());
    });
    next(err, cartObjects);
  });
};

// Get a cart by user
exports.getByUser = (user, next) => {
  cartModel.findOne({user: user}).exec((err, cart) => {
    if (err) {
      console.log(err);
    }
    else {
      if (!cart) {
        next(err, cart);
      } 
      else {
        var prodIds = [];
        cart.prod.forEach(function (item) {
          prodIds.push(item.id);
        });
        console.log('prodIds(getbyuser model): ' + prodIds); // testing
        productModel.getAllIds(prodIds, function(err, products) {
          var totalPrice = 0;
          var subPrice;
          var prodArray = [];
          products.forEach(function (item){
            console.log('item(getbyuser model): ' + item); // for testing
            var index = cart.prod.findIndex(x => x.id.equals(item._id));
            var product = {};

            subPrice = item.price * cart.prod[index].qty;
            totalPrice += subPrice;

            product['pName'] = item.pName;
            product['img'] = item.img;
            product['subPrice'] = subPrice;
            product['qty'] = cart.prod[index].qty;
            product['id'] = item._id;

            prodArray.push(product);
          });
          next(err, {products: prodArray, total: totalPrice});
        });
      }
    }
  });
};

// Add item to cart
exports.addProduct = (filter, update, qty, next) => {
  cartModel.findOne({user: filter}).exec((err, cart) => {
    if (err) throw err;
    if (cart) {
      console.log(cart); // for testing
      console.log(cart.prod.some(prod => prod.id == update));
      if (!cart.prod.some(prod => prod.id == update)) {
        cart.prod.push({id: update, qty: qty})
        cart.save(next(err, cart));
      }
      else {
        var prodArray = cart.prod;
        var prodIndex = prodArray.findIndex(x => x.id == update);
        if (prodArray[prodIndex].qty + qty > 0) {
          cart.prod[prodIndex].qty += qty;
          cart.save(next(err, cart));
        }
        else {
          cart.prod.splice(prodIndex, 1);
          if (cart.prod.length == 0) {
            cartModel.deleteOne({user: filter}).exec((err, result) => {
              next(err, result);
            });
          }
          else {
            cart.save(next(err, cart));
          }
        }
      }
    }
    else {
      if (qty < 0) {
        throw new Error('Negative quantity when cart does not exist');
      }
      else {
        var newCart = {
          prod: [
            {
              id: update,
              qty: qty
            }
          ],
          user: filter,
          checkout: false,
        }; 
        cartModel.create(newCart, next);
      }
    }
  });
};

exports.removeProduct = (filter, update, next) => {
  cartModel.findOne({user: filter}).exec((err, cart) => {
    if (err) throw err;
    if (cart) {
      console.log(cart); // for testing
      console.log(cart.prod.some(prod => prod.id == update));
      if (!cart.prod.some(prod => prod.id == update)) {
        next(err, cart);
      }
      else {
        var prodArray = cart.prod;
        var prodIndex = prodArray.findIndex(x => x.id == update);
        cart.prod.splice(prodIndex, 1);
        if (cart.prod.length == 0) {
          cartModel.deleteOne({user: filter}).exec((err, result) => {
            next(err, result);
          });
        }
        else {
          cart.save(next(err, cart));
        }
      }
    }
  });
}
  
exports.deleteOne = (id, next) => {
  cartModel.deleteOne({_id: id}, (err, result) => {
    if (err) throw err;
    next(err, result);
  });
};

exports.deleteAll = (query, next) => {
  cartModel.deleteMany({}, (err, result) => {
    if (err) throw err;
    next(err, result);
  });
};