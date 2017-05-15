var express = require('express');
var mongoose = require('mongoose');

var auth = require('../../middlewares/auth');

var router = express.Router();

var productModel = mongoose.model('product');
var userModel = mongoose.model('user');
var orderModel = mongoose.model('order');

module.exports.controller = function(app){

  router.get("/checkout/confirm-address",auth.checkLogin,function(req,res){
    res.render('checkout',
                {
                  title:"Checkout - MEAN Shop",
                  user:req.session.user,
                  cart:req.session.cart
                });
  });

  var address = {};

  router.post("/checkout/proceed",auth.checkLogin,function(req,res){

    address.contact = req.body.contact;
    address.houseNo = req.body.houseNo;
    address.city = req.body.city;
    address.state = req.body.state;
    address.country = req.body.country;
    address.pinCode = req.body.pinCode;
    address.landMark = req.body.landMark;

    res.render('checkout-final-step',
                {
                  title:" Checkout - MEAN Shop",
                  user:req.session.user,
                  cart:req.session.cart
                });
  });

  router.get("/checkout/make-order",auth.checkLogin,function(req,res){

    var arrId = [];
    var arrQty = [];
    var arrName = [];
    var arrPrice = [];
    var count = 0;
    for(id in req.session.cart.items){
      arrId.push(id);
      arrQty.push(req.session.cart.items[id].quantity);
      arrName.push(req.session.cart.items[id].item.productName);
      arrPrice.push(req.session.cart.items[id].item.price);
      count++;
    }

    today = Date.now();

    var newOrder = new orderModel({

      orderedBy : req.session.user.userId,
      productId : arrId,
      productName : arrName,
      productPrice : arrPrice,
      productQty : arrQty,
      uniqueProducts : count,
      quantity : req.session.cart.totalQuantity,
      price : req.session.cart.totalPrice,
      orderDate :today,
      contact : address.contact,
      houseNo : address.houseNo,
      city : address.city,
      state : address.state,
      country : address.country,
      pinCode : address.pinCode,
      landMark : address.landMark

    });

    newOrder.save(function(err,result){
      if(err){
        console.log(err);
        res.render('message',
                    {
                      title:"Error",
                      msg:"Something went wrong. Please try Placing Order Again.",
                      status:500,
                      error:err,
                      user:req.session.user,
                      cart:req.session.cart
                    });
      }
      else if(result == undefined || result == null || result == ""){
        res.render('message',
                    {
                      title:"Empty",
                      msg:"Order Is Not Placed. Please Try Again later.",
                      status:404,
                      error:"",
                      user:req.session.user,
                      cart:req.session.cart
                    });
      }
      else{
        delete req.session.cart;
        res.redirect('/user/orders');
      }
    });

  });

  app.use(router);

}
