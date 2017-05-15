var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({

  userId : {type:String,default:"",required:true},
  firstName : {type:String,default:"",required:true},
  lastName : {type:String,default:"",required:true},
  email : {type:String,default:"",required:true},
  password : {type:String,default:"",required:true},
  secureQuestion : {type:String,default:"",required:true},
  secureAnswer : {type:String,default:"",required:true},
  contact : {type:String,default:"Not Provided."},
  houseNo : {type:String,default:"Not Provided."},
  city : {type:String,default:"Not Provided."},
  state : {type:String,default:"Not Provided."},
  country : {type:String,default:"Not Provided."},
  pinCode : {type:String,default:"Not Provided."},
  landMark: {type:String,default:"Not Provided."},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},
  wishList : []

});
mongoose.model('user',userSchema);
