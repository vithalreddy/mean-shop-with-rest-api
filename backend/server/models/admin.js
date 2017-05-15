var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var adminSchema = new Schema({

  username : {type:String,default:"",required:true,unique:true},
  firstName : {type:String,default:""},
  lastName : {type:String,default:""},
  email : {type:String,default:"",required:true,unique:true},
  password : {type:String,default:"",required:true},
  createdOn : {type:Date,default:Date.now},
  updatedOn: {type:Date,default:Date.now}

});

mongoose.model('admin',adminSchema);
