var crypto = require('crypto');
module.exports.encryptPassword = function(password){
  var hash = crypto.createHmac('sha256',password)
                   .update("mean-key")
                   .digest('hex');
  return hash
};
