var express = require('express');
var mongoose = require('mongoose');

var auth = require('../../middlewares/auth');
var encrypt = require('../../libs/encrypt');

var router = express.Router();

var userModel = mongoose.model('user');

module.exports.controller = function(app){

  router.get("/settings",auth.checkLogin,function(req,res){
    res.render('settings',
                {
                  title:"MEAN Shop",
                  user:req.session.user,
                  cart:req.session.cart
                });
  });

  router.put("/account/modify/:userId",auth.checkLogin,function(req,res){

    req.body.updatedOn = Date.now();
    var update = req.body;
    userModel.findOneAndUpdate({'userId':req.params.userId},update,function(err,result){
      if(err){
        console.log(err);
        res.render('message',
                    {
                      title:"Error",
                      msg:"Some Error Occured During Updation.",
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
                      msg:"User Does Not Exist. Please Check Your Input.",
                      status:404,
                      error:"",
                      user:req.session.user,
                      cart:req.session.cart
                    });

      }
      else{
        userModel.findOne({'userId':req.params.userId},function(err,newResult){

          if(err){
            console.log(err);
            res.render('message',
                        {
                          title:"Error",
                          msg:"Data Updated. But Some Error Occured In Reading Updated Data.",
                          status:500,
                          error:err,
                          user:req.session.user,
                          cart:req.session.cart
                        });
          }
          else{
            req.user = newResult;
            delete req.user.password;
            req.session.user = newResult;
            delete req.session.user.password;

            res.redirect('/user/settings');
          }
        });
      }
    });

  });

  router.put("/change/password/:userId",auth.checkLogin,function(req,res){

    var eoldPass = encrypt.encryptPassword(req.body.oldPassword);
    var epass = encrypt.encryptPassword(req.body.password);

    req.body.updatedOn = Date.now();
    req.body.password = epass;
    delete req.body.oldPassword;
    var update = req.body;

    userModel.findOne({$and:[{'userId':req.params.userId},{'password':eoldPass}]},function(err,result){
      if(err){
        console.log(err);
        res.render('message',
                    {
                      title:"Error",
                      msg:"Some Error Occured During Updation.",
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
                      msg:"User Does Not Exist. Please Check Your Input.",
                      status:404,
                      error:"",
                      user:req.session.user,
                      cart:req.session.cart
                    });

      }
      else{

        userModel.findOneAndUpdate({'userId':req.params.userId},update,function(err,newResult){
          if(err){
            console.log(err);
            res.render('message',
                        {
                          title:"Error",
                          msg:"Some Error Occured During Updation.",
                          status:500,
                          error:err,
                          user:req.session.user,
                          cart:req.session.cart
                        });
          }
          else{
            userModel.findOne({'userId':req.params.userId},function(err,updatedResult){
              if(err){
                console.log(err);
                res.render('message',
                            {
                              title:"Error",
                              msg:"Password Updated. But Some Error Occured During Session Resave.",
                              status:500,
                              error:err,
                              user:req.session.user,
                              cart:req.session.cart
                            });
              }
              else{
                req.user = updatedResult;
                delete req.user.password;
                req.session.user = updatedResult;
                delete req.session.user.password;
              }
            });

            res.redirect('/user/logout');
          }
        });
      }
    });
  });

  router.post("/account/delete/:userId",auth.checkLogin,function(req,res){
    userModel.remove({'userId':req.params.userId},function(err,result){
      var newResult = JSON.parse(result);

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
      else if(result == undefined || result == null || result == "" || newResult.n == 0){
        res.render('message',
                    {
                      title:"Not Found",
                      msg:"Product Does Not Exist. Please Check Your Input.",
                      status:404,
                      error:"",
                      user:req.session.user,
                      cart:req.session.cart
                    });

      }
      else{
        console.log("User Deletion Success.");
        res.redirect('/user/logout');
      }
    });
  });

  app.use('/user',router);

}
