var express = require('express');
var mongoose = require('mongoose');

var auth = require('../../middlewares/auth');
var encrypt = require('../../libs/encrypt');

var router = express.Router();

var userModel = mongoose.model('user');

module.exports.controller = function(app){

  router.get('/login',auth.loggedIn,function(req,res){
    res.render('login',
                {
                  title:"User Login",
                  user:req.session.user,
                  cart:req.session.cart
                });
  });

  router.get('/logout',function(req,res){

    req.session.user = null;
    res.redirect('/user/login');
  });

  router.post('/api/v1/login',auth.loggedIn,function(req,res){

    var epass = encrypt.encryptPassword(req.body.password);

    userModel.findOne({$and:[{'email':req.body.email},{'password':epass}]},function(err,result){
      if(err){
        res.render('message',
                    {
                      title:"Error",
                      msg:"Some Error Occured During Login.",
                      status:500,
                      error:err,
                      user:req.session.user,
                      cart:req.session.cart
                    });
      }
      else if(result == null || result == undefined || result == ""){
        res.render('message',
                    {
                      title:"Error",
                      msg:"User Not Found. Please Check Your Username and Password.",
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
