var express = require('express');
var mongoose = require('mongoose');

var cart = require('../../libs/guest-cart');

var router = express.Router();

var userModel = mongoose.model('user');
var productModel = mongoose.model('product');

module.exports.controller = function(app){

  router.get("/cart",function(req,res){
    res.render('cart',
                {
                  title:"Your Cart - MEAN Shop",
                  user:req.session.user,
                  cart:req.session.cart
                });
  });

  router.get("/cart/empty",function(req,res){
    delete req.session.cart;
    res.redirect("/cart");
  });

  router.get("/product/add-to-cart/:id",function(req,res){

    productModel.findOne({'_id':req.params.id},function(err,result){
      if(err){
        console.log(err);
        res.render('message',
                    {
                      title:"Error",
                      msg:"Something went wrong.",
                      status:500,
                      error:err,
                      user:req.session.user,
                      cart:req.session.cart
                    });
      }
      else if(result == undefined || result == null || result == ""){
        res.render('message',
                    {
                      title:"Not Found",
                      msg:"Product Does Not Exist.",
                      status:404,
                      error:"",
                      user:req.session.user,
                      cart:req.session.cart
                    });
      }
      else{
        var oldCart = req.session.cart;
        req.session.cart = cart.addProduct(oldCart,result,req.params.id);
        req.cart = req.session.cart;

        res.redirect("/cart");
      }
    });

  });

  router.get("/product/delete-from-cart/:id",function(req,res){

    var oldCart = req.session.cart;
    req.session.cart = cart.deleteProduct(oldCart,req.params.id);
    req.cart = req.session.cart;

    res.redirect("/cart");
  });


  router.get("/product/addOne-to-cart/:id",function(req,res){

    var oldCart = req.session.cart;
    req.session.cart = cart.addOne(oldCart,req.params.id);
    req.cart = req.session.cart;

    res.redirect("/cart");
  });

  router.get("/product/deleteOne-from-cart/:id",function(req,res){

    var oldCart = req.session.cart;
    req.session.cart = cart.deleteOne(oldCart,req.params.id);
    req.cart = req.session.cart;

    res.redirect("/cart");
  });

  app.use(router);

}
