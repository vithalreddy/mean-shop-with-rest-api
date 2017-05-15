var express = require('express');
var mongoose = require('mongoose');
var sync = require('synchronize');

var auth = require('../../middlewares/auth.js');

var router = express.Router();

var adminModel = mongoose.model('admin');
var productModel = mongoose.model('product');
var userModel = mongoose.model('user');
var orderModel = mongoose.model('order');

module.exports.controller = function(app){

  router.get("/", auth.isLoggedIn, function(req,res){
    console.log("my admin dash board");


    //synchronize in use
    try{
      sync.fiber(function(){
        //for product synchronize
        ProductX = sync.await(productModel.count({},sync.defer()));
        //for user synchronize
        userX = sync.await(userModel.count({},sync.defer()));
        //for order synchronize
        OrderX = sync.await(orderModel.count({},sync.defer()));
        //for deliveryStatus synchronize
        deliveryStatusX = sync.await(orderModel.count({'deliveryStatus':1},sync.defer()));

        res.render('dashboard',
                    {
                      title:"MEAN SHOP Admin Dashboard",
                      admin:req.session.admin,
                      totalProduct:ProductX,
                      totalUser:userX,
                      totalOrder:OrderX,
                      pendingOrder:deliveryStatusX
                    });
      });
    } catch(err){
        console.log("error is "+err);
    }

  });




  app.use("/admin",router);

}
