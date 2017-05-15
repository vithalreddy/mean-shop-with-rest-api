var express = require('express');
var mongoose = require('mongoose');

var auth = require('../../middlewares/auth.js');


var router = express.Router();

var productModel = mongoose.model('product');

module.exports.controller = function(app){

  router.get("/create-product",auth.isLoggedIn,function(req,res){
    res.render('create-product',
                {
                  title:"Add a Product",
                  admin:req.session.admin
                });
  });

  //rest api in action
  router.post("/api/v1/product/create",function(req, res){
    console.log("product creation api in action");

    var today = Date.now();

    var newProduct = new productModel({

      productName : req.body.productName,
      category : req.body.category,
      price : req.body.price,
      description : req.body.description,
      quantity : req.body.quantity,
      model : req.body.model,
      brandName : req.body.brandName,
      size : req.body.size,
      createdOn : today,
      updatedOn : today,
      url: req.body.productName+(0|Math.random()*9e6).toString(36) //generating uniq product url

    });

    //saving our awesome product
    newProduct.save(function(err,result){
      //console.log(entered product saving process);
      if(err){
        console.log(err);
        res.render('message',
                    {
                      title:"Error",
                      msg:"Something went wrong!",
                      status:500,
                      error:err,
                      admin:req.session.admin
                    });
      }
      else if(result == undefined || result == null || result == ""){
        res.render('message',
                    {
                      title:"Product Is Not Created!!!",
                      msg:"Something went wrong, Product Is Not Created. Please Try Again.",
                      status:404,
                      error:"",
                      admin:req.session.admin
                    });
      }
      else{
        res.redirect('/admin/view-product');
      }
    });

  });

  app.use("/admin",router);

}//end create product api controller
