console.log("Starting mean shop frontend");

//setup
var express = require('express');
var mongoose = require('mongoose');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var methodOverride = require('method-override');
var port = process.env.PORT || 5000

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
//guest cart
var cart = require('./libs/guest-cart');


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

app.use(function(req,res,next){
  var oldCart = req.session.cart;
  req.session.cart = cart.cartModel(oldCart);
  req.cart = req.session.cart;
  next();
});

// public folder as static
app.use(express.static(path.resolve(__dirname,'./public')));

//views folder
app.set('views', path.resolve(__dirname,'./app/views'));

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
fs.readdirSync("./app/models").forEach(function(file){
  if(file.indexOf(".js")){
    require("./app/models/"+file);
  }
});

// controllers files dynamic
fs.readdirSync("./app/controllers").forEach(function(file){
  if(file.indexOf(".js")){
    var route = require("./app/controllers/"+file);
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
                            user:req.session.user,
                            cart:req.session.cart
                            });

});

//app level middleware for setting logged in user.
var userModel = mongoose.model('user');

app.use(function(req,res,next){

	if(req.session && req.session.user){
		userModel.findOne({'email':req.session.user.email},function(err,user){

			if(user){
        req.user = user;
        delete req.user.password;
				req.session.user = user;
        delete req.session.user.password;
				next();
			}

		});
	}
	else{
		next();
	}

});//end of user login

app.listen(port);
console.log('MEAN Shop frontend app started on port ' + port);
