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


  router.post("/signup",function(req,res){

//using js date function
    var today = Date.now();

    var newAdmin = new adminModel({

      username : req.body.username,
      firstName : req.body.firstName,
      lastName : req.body.lastName,
      email       : req.body.email,
      password : req.body.password,
      createdOn : today

    });
    //admin save to mongodb
    newAdmin.save(function(err,result){
      if(err){
        res.send("error :(");
      }
      else if(result === null || result === undefined || result === ""){
        res.send("Admin Signup failed");
      }
      else{
        res.send(result);
      }
    });
  });


  app.use("/admin",router);

}
