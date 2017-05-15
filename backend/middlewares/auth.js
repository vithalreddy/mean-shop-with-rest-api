//auth setup.
var mongoose = require('mongoose');
module.exports.isLoggedIn = function(req , res , next){
  if(!req.admin && !req.session.admin){
		res.redirect('/admin/login');
	}
	else{
		next();
	}
};
