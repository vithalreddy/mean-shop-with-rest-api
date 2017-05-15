var express = require('express');
var mongoose = require('mongoose');
var shortid = require("shortid");

var auth = require('../../middlewares/auth');
var validator = require('../../middlewares/validator');
var encrypt = require('../../libs/encrypt');

var router = express.Router();

var userModel = mongoose.model('user');

module.exports.controller = function(app){
  router.get("/signup",auth.loggedIn,function(req,res){
    res.render('signup',
                {
                  title:"New User Signup - MEAN Shop",
                  user:req.session.user,
                  cart:req.session.cart
                });
  });

  router.post("/api/v1/newuser/create",auth.loggedIn,validator.emailExist,function(req,res){

    var today = Date.now();
    var id = shortid.generate();
    var epass = encrypt.encryptPassword(req.body.password);

    var newUser = new userModel({

      userId : id,
      firstName : req.body.firstName,
      lastName : req.body.lastName,
      email : req.body.email,
      password : epass,
      secureQuestion : req.body.secureQuestion,
      secureAnswer : req.body.secureAnswer,
      contact : req.body.contact,
      houseNo : req.body.houseNo,
      city : req.body.city,
      state : req.body.state,
      country : req.body.country,
      pinCode : req.body.pinCode,
      landMark: req.body.landMark,
      createdOn : today,
      updatedOn : today

    });

    newUser.save(function(err,result){
      if(err){
        console.log(err);
        res.render('message',
                    {
                      title:"Error",
                      msg:"Some Error Occured During Creation.",
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
                      msg:"User Is Not Created. Please Try Again.",
                      status:404,
                      error:"",
                      user:req.session.user,
                      cart:req.session.cart
                    });
      }
      else{
        req.user = result;
        delete req.user.password;
        req.session.user = result;
        delete req.session.user.password;
        res.redirect('/');
      }
    });

  });

  app.use('/user',router);

}
