var express = require('express');
var mongoose = require('mongoose');

var auth = require('../../middlewares/auth.js');

var router = express.Router();

var productModel = mongoose.model('product');

module.exports.controller = function(app){

  router.get("/edit-product/:id",auth.isLoggedIn,function(req,res){
    productModel.findById({'_id':req.params.id},function(err,result){
      if(err){
        console.log(err);
        res.render('message',
                    {
                      title:"Error",
                      msg:"Some Error Occured.",
                      status:500,
                      error:err,
                      admin:req.session.admin
                    });
      }
      else if(result === undefined || result === null || result === ""){
        res.render('message',
                    {
                      title:"Product Not Found",
                      msg:"Product Does Not Exist. Please Check Your Input and Try Agian.",
                      status:404,
                      error:"",
                      admin:req.session.admin
                    });

      }
      else{
        res.render('edit-product',
                    {
                      title:"Editing The Product",
                      admin:req.session.admin,
                      product:result
                    });
      }
    });

  });

  //rest api editing product.
  router.put("/api/v1/product/edit/:id",auth.isLoggedIn,function(req,res){

    req.body.updatedOn = Date.now();

    var update = req.body;

    //mongoose and mongodb in action
    productModel.findOneAndUpdate({'_id':req.params.id},update,function(err,result){
      if(err){
        console.log(err);
        res.render('message',
                    {
                      title:"Error",
                      msg:"Something went wrong during product update process.",
                      status:500,
                      error:err,
                      admin:req.session.admin
                    });
      }
      else if(result === undefined || result === null || result === ""){
        res.render('message',
                    {
                      title:"Product Not Found",
                      msg:"Product Does Not Exist. Please Check Your Input and Try Again",
                      status:404,
                      error:"",
                      admin:req.session.admin
                    });

      }
      else{
        productModel.findOne({'_id':req.params.id},function(err,newResult){
          res.render('view-product-single',
                      {
                        title:"Our  Product",
                        admin:req.session.admin,
                        product:newResult
                      });
        });
      }

    });
  });

  app.use("/admin",router);

}//end product update controller
