var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

var adminModel = mongoose.model('admin');

module.exports.controller = function(app){

  router.get('/login',function(req,res){
    console.log("Someone accessing admin login.....");
    res.render('login',{title:"MEAN Shop Admin Login"});
  });

  router.get('/logout',function(req,res){
    //Single line session destroy
    req.session.destroy(function(err){
      if(err){
        res.render('message',
                    {
                      title:"Error",
                      msg:"Some Error Occured During Logout.",
                      status:500,
                      error:err,
                      admin:req.session.admin
                    });
      }
      else{
        res.redirect('/admin/login');
      }
    });
  });

//rest login api
  router.post('/api/v1/login',function(req,res){
    adminModel.findOne({$and:[{'username':req.body.username},{'password':req.body.password}]},function(err,result){
      if(err){
        res.render('message',
                    {
                      title:"Error",
                      msg:"Some Error Occured During Login.",
                      status:500,
                      error:err,
                      admin:req.session.admin
                    });
      }
      else if(result === null || result === undefined){
        res.render('message',
                    {
                      title:"Error",
                      msg:"User Not Found. Please Check Your Username and Password and Try Again",
                      status:404,
                      error:"",
                      admin:req.session.admin
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

  app.use('/admin',router);

}//end login controller
