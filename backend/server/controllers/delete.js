var express = require('express');
var mongoose = require('mongoose');

var auth = require('../../middlewares/auth.js');

var router = express.Router();

var productModel = mongoose.model('product');

module.exports.controller = function(app){

  router.post("/api/v1/product/delete/:id",auth.isLoggedIn,function(req,res){
    productModel.remove({'_id':req.params.id},function(err,result){
      var newResult = JSON.parse(result);

      if(err){
        console.log(err);
        res.render('message',
                    {
                      title:"Error",
                      msg:"Something went wrong",
                      status:500,
                      error:err,
                      admin:req.session.admin
                    });
      }
      else if(result === undefined || result === null || result == "" || newResult.n === 0){
        res.render('message',
                    {
                      title:"Product Not Found",
                      msg:"Product Does Not Exist. Please Check Your Input and try again.",
                      status:404,
                      error:"",
                      admin:req.session.admin
                    });

      }
      else{
        console.log("Product Deleted Successfully.");
        res.render('message',
                    {
                      title:" Product Deleted Successfully",
                      msg:"Product Deleted Successfully.",
                      status:200,
                      error:"",
                      admin:req.session.admin
                    });
      }
    });
  });

  app.use("/admin",router);

}//end product delete controller
