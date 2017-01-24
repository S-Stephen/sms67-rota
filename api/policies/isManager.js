/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow a Manager access to the route
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  sails.log("running Session is Manager");
  sails.log("session object: %j",req.session);
  sails.log("user object is: %j",req.user);
  
  //NB chnages to the database will not necessarily trigger chnages to the session object!  
  //Once a manager in a session always a manager for that session?!
  
  if(req.user.manager){
	// attempt to provide access to the view (via layout.ejs)
	 res.locals.user = req.user;
	 return next();
  }
  
  //If we do not have a sessi
  return res.forbidden('You are not permitted to perform this action.');
  //res.redirect('/accessdenied');

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
//  if (req.session.authenticated) {
//    return next();
//  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
 //  return res.forbidden('You are not permitted to perform this action.');
};
