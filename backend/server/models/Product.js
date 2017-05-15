//including dependencies.
var mongoose = require('mongoose');

//declaring schema object.
var Schema = mongoose.Schema;

var productSchema = new Schema({

  productName : {type:String,default:"",required:true},
  category : {type:String,required:true},
  rating	:{type:Number,default:0},
	images	:[{ data: Buffer, contentType: String }],
  price : {type:Number,default:"",required:true},
  discount : {type:Number,default:""},
  description : {type:String,default:"Not Specified  by Seller"},
  quantity : {type:Number,default:0},
  size : {type:String,default:"Not Specified  by Seller"},
  color : {type:String,default:"Not Specified by Seller"},
  model : {type:String,default:"Not Specified by Seller"},
  brandName : {type:String,default:"Not Specified  by Seller"},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},
  url: {type:String}

});

mongoose.model('product',productSchema);
