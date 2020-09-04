// This does not save to the database yet
module.exports = function Cart(oldCart) {
  // initialization of the information of the products
  // that will be added to the cart
  this.items = oldCart.items || {};
  this.totalQuantity = oldCart.totalQuantity || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  // function that allows products to be added to the cart
  this.add = function(item, id) {
    var storedItem = this.items[id];
    if(!storedItem) {
      storedItem = this.items[id] = {
        item: item, 
        qty: 0, 
        price: 0
      };
    }
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQuantity++;
    this.totalPrice += storedItem.item.price;
  };

  // function that retrieves items in the cart as an array
  this.generateArray = function() {
    var array = [];
    for(var id in this.items) {
      array.push(this.items[id]);
    }
    return array;
  };
};