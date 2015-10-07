/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  sails.log("running Session auth policy");
  sails.log("session object: %j",req.session);
  sails.log("user object is: %j",req.user);
  if(req.user){
	// attempt to provide access to the view (via layout.ejs)
	 res.locals.user = req.user;
	 return next();
  }
  
  //If we do not have a sessi
  
  res.redirect('/login');

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
//  if (req.session.authenticated) {
//    return next();
//  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
 //  return res.forbidden('You are not permitted to perform this action.');
};
