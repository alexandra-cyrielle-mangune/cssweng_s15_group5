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
exports.getByUser = (query, next) => {
  cartModel.findOne({user: query}).exec((err, result) => {
    console.log('user');
    console.log(result);
    if (err) throw err;
    next(err, result);
  });
};

exports.getByUserWithPrices = (user, next) => {
  cartModel.findOne({user: user}).exec((err, cart) => {
    if (err) throw err;

    if (!cart)
      next(err, cart);
    var prodIds = [];
    cart.prod.forEach(function (item){
      prodIds.push(item.id);
    });
    console.log(prodIds);
    productModel.getAllIds(prodIds, function(err, products) {
      var totalPrice = 0;
      var subPrice;
      var prodArray = [];
      products.forEach(function (item){
        var index = cart.prod.findIndex(x => x.id.equals(item._id));
        var product = {};

        subPrice = item.price * cart.prod[index].qty;
        totalPrice += subPrice;

        product['img'] = item.img;
        product['subPrice'] = subPrice;
        product['qty'] = cart.prod[index].qty;

        prodArray.push(product);
      });
      next(err, {products: prodArray, total: totalPrice});
    });
  });
};
// Add item to cart
exports.addProduct = (filter, update, qty, next) => {
  console.log('filter');
  console.log(filter);
  console.log('update');
  console.log(update);
  cartModel.findOne({user: filter}).exec((err, cart) => {
    if (err) throw err;
    if (cart) {
      console.log('cart');
      console.log(cart)
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
          cart.prod.splice(prodIndex);
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
      if (qty < 0)
        throw new Error('Negative quantity when cart does not exist');

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
  });
};


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
// // This does not save to the database yet
// module.exports = function Cart(oldCart) {
//   // initialization of the information of the products
//   // that will be added to the cart
//   this.items = oldCart.items || {};
//   this.totalQuantity = oldCart.totalQuantity || 0;
//   this.totalPrice = oldCart.totalPrice || 0;

//   // function that allows products to be added to the cart
//   this.add = function(item, id) {
//     var storedItem = this.items[id];
//     if(!storedItem) {
//       storedItem = this.items[id] = {
//         item: item, 
//         qty: 0, 
//         price: 0
//       };
//     }
//     storedItem.qty++;
//     storedItem.price = storedItem.item.price * storedItem.qty;
//     this.totalQuantity++;
//     this.totalPrice += storedItem.item.price;
//   };

//   // function that decreases quantity of item by 1
//   this.reduceByOne = function(id) {
//     this.items[id].qty--;
//     this.items[id].price -= this.items[id].item.price;
//     this.totalQuantity--;
//     this.totalPrice -= this.items[id].item.price;

//     if(this.items[id].qty <= 0) {
//       delete this.items[id];
//     }
//   };

//   // function that increases quantity of item by 1
//   this.increaseByOne = function(id) {
//     this.items[id].qty++;
//     this.items[id].price += this.items[id].item.price;
//     this.totalQuantity++;
//     this.totalPrice += this.items[id].item.price;
//   };
  
//   // function removes an item from the cart
//   this.removeItem = function(id) {
//     this.totalQuantity -= this.items[id].qty;
//     this.totalPrice -= this.items[id].price;
//     delete this.items[id];
//   };

//   // function removes all items from the cart
//   this.removeAll = function() {
//     this.totalQuantity = 0;
//     this.totalPrice = 0;
//     delete this.items;
//   };

//   // function that retrieves items in the cart as an array
//   this.generateArray = function() {
//     var array = [];
//     for(var id in this.items) {
//       array.push(this.items[id]);
//     }
//     return array;
//   };
// };
