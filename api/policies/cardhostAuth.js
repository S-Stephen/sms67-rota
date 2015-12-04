/**
 * cardhostsAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow access to the end point from card hosts only (hosts with card readers)
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  sails.log("IP address: "+req.ip);

  sails.log("in auth list? "+sails.config.cardhosts.indexOf(req.ip));
  if (sails.config.cardhosts.indexOf(req.ip) > -1){
	return next();
  }
  return res.forbidden('You are not permitted to perform this action.');
  
};
