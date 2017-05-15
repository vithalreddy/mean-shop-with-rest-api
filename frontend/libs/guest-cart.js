var _ = require('lodash');

module.exports.cartModel = function(cart){
  if(cart == "" || cart == undefined || cart == null){
    var obj = {
                items : {},
                totalQuantity : 0,
                totalPrice : 0,
                empty : true
              };
  }
  else{
    var obj = {
                items : cart.items,
                totalQuantity : cart.totalQuantity,
                totalPrice : cart.totalPrice,
                empty : false
              };
  }
  obj.empty = _.isEmpty(obj.items);

  return obj;
}//end of cartModel/

//adding product.
module.exports.addProduct = function(cart,product,id){
  if(!cart.items[id]){
    cart.items[id]={
                      item : product,
                      quantity : 0,
                      price : 0
                   };
  }
  cart.items[id].quantity++;
  cart.items[id].price = product.price * cart.items[id].quantity;
  cart.totalQuantity++;
  cart.totalPrice += product.price;
  cart.empty = _.isEmpty(cart.items);

  return cart;
}//end of addProduct.

//deleting product.
module.exports.deleteProduct = function(cart,id){
  if(cart.items[id]){
    cart.totalQuantity -= cart.items[id].quantity;
    cart.totalPrice -= cart.items[id].price;
    delete cart.items[id];
    cart.empty = _.isEmpty(cart.items);

    return cart;
  }
}//end of deleteProduct.

//increase quantity by 1.
module.exports.addOne = function(cart,id){
  cart.items[id].quantity++;
  cart.items[id].price = cart.items[id].item.price * cart.items[id].quantity;
  cart.totalQuantity++;
  cart.totalPrice += cart.items[id].item.price;
  cart.empty = _.isEmpty(cart.items);

  return cart;
}//end of addOne.

//decrease quantity by 1.
module.exports.deleteOne = function(cart,id){
  if(cart.items[id].quantity == 1){
    cart.totalQuantity--;
    cart.totalPrice -= cart.items[id].item.price;
    delete cart.items[id];
    cart.empty = _.isEmpty(cart.items);
  }
  else{
    cart.items[id].quantity--;
    cart.items[id].price = cart.items[id].item.price * cart.items[id].quantity;
    cart.totalQuantity--;
    cart.totalPrice -= cart.items[id].item.price;
    cart.empty = _.isEmpty(cart.items);
  }

  return cart;
}
