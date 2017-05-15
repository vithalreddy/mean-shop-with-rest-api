console.log("Starting mean shop server");

//setup
var express = require('express');
var mongoose = require('mongoose');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var methodOverride = require('method-override');
var port = process.env.PORT || 8000

var path = require('path');
var fs = require('fs');

//express app
var app = express();

//parser middlewares
app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(cookieParser());

//logging all requests in dev mode
app.use(logger('dev'));

//auth middleware
var auth = require('./middlewares/auth');

//connecting to mongodb
require('./config/database');

//session setup
app.use(session({
  name : 'mean-shop',
  secret : '9743-980-270',
  resave : true,
  httpOnly : true,
  saveUninitialized: true,
  store : new mongoStore({mongooseConnection : mongoose.connection}),
  cookie : { maxAge : 80*80*800 }
}));

// public folder as static
app.use(express.static(path.resolve(__dirname,'./public')));

//views folder
app.set('views', path.resolve(__dirname,'./server/views'));

//ejs engine
app.set('view engine', 'ejs');

app.use(methodOverride(function(req,res){
    if(req.body && typeof req.body === 'object' && '_method' in req.body){
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// models files dynamic
fs.readdirSync("./server/models").forEach(function(file){
  if(file.indexOf(".js")){
    require("./server/models/"+file);
  }
});

// controllers files dynamic
fs.readdirSync("./server/controllers").forEach(function(file){
  if(file.indexOf(".js")){
    var route = require("./server/controllers/"+file);
    route.controller(app);
  }
});

//defining  404
app.use(function(req,res){
  console.log("Page Not Found.");
  res.status(404).render('message',
                          {
                            title:"404",
                            msg:"Page Not Found.",
                            status:404,
                            error:"",
                            admin:req.session.admin
                          });
});

//app level middleware for setting logged in user.
var adminModel = mongoose.model('admin');

app.use(function(req,res,next){

	if(req.session && req.session.admin){
		adminModel.findOne({'email':req.session.admin.email},function(err,admin){

			if(admin){
				req.admin = admin;
				delete req.admin.password;
				req.session.admin = admin;
        delete req.session.admin.password;
				next();
			}

		});
	}
	else{
		next();
	}

});//end of setLoggedInAdmin.

app.listen(port);
console.log('MEAN Shop backend app started on port ' + port);
