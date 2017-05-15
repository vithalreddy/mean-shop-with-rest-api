var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

var productModel = mongoose.model('product');

module.exports.controller = function(app){

  router.get("/",function(req,res){
    productModel.find({},function(err,result){
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
      else{
        productModel.count({},function(err,count){
          if(err){
            console.log(err);
            res.render('message',
                        {
                          title:"Error",
                          msg:"Some Error Occured During Reading.",
                          status:500,
                          error:err,
                          user:req.session.user,
                          cart:req.session.cart
                        });
          }
          else{
            res.render('home',
                        {
                          title:"MEAN Shop",
                          user:req.session.user,
                          cart:req.session.cart,
                          product:result,
                          count:count
                        });
          }
        });
      }
    });
  });

  router.get('/product/single-product/:id',function(req,res){
    productModel.findOne({'_id':req.params.id},function(err,result){
      if(err){
        console.log(err);
        res.render('message',
                    {
                      title:"Error",
                      msg:"Some Error Occured During Reading.",
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
        res.render('single-product',
                    {
                      title:"Product Details",
                      user:req.session.user,
                      cart:req.session.cart,
                      product:result
                    });
      }
    });
  });

  app.use(router);

}
