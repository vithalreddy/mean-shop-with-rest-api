var express = require('express');
var mongoose = require('mongoose');

var auth = require('../../middlewares/auth.js');

var router = express.Router();

var adminModel = mongoose.model('admin');

module.exports.controller = function(app){

  router.get("/signup", function(req,res){
    res.render('signup',
                {
                  title:"New Admin Account Signup",
                  admin:req.session.admin

                });
  });

  //rest api in action
  router.post("/signup",function(req, res){

    var today = Date.now();

    var newAdmin = new adminModel({

      username : req.body.username,
      firstName : req.body.firstName,
      lastName : req.body.lastName,
      email       : req.body.email,
      password : req.body.password,
      createdOn : today

    });

    newAdmin.save(function(err,result){
      if(err){
        console.log(err);
        res.render('message',
                    {
                      title:"Error",
                      msg:"Something went wrong!",
                      status:500,
                      error:err,
                    });
      }
      else if(result == undefined || result == null || result == ""){
        res.render('message',
                    {
                      title:"Admin  account signup failed",
                      msg:"Admin  account signup failed. Please Try Again.",
                      status:500,
                      error:"",
                    });
      }
      else{
        req.admin = result;
        delete req.admin.password;
        req.session.admin = result;
        delete req.session.admin.password;
        res.redirect('/admin');


      }
    });

  });


  app.use("/admin",router);

}//end create product api controller
