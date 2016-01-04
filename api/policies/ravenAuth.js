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

  // in the scenario where th euser has not been formally added (no name associated to their account then deny access with -> you do not have an account contact ???
  
  
  if(req.isAuthenticated() && req.user.display_name != "" ) return next();
 
  
  if(req.isAuthenticated() ){
	res.redirect('/login');
  }else{
	res.redirect('/login');
  }
  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
//  if (req.session.authenticated) {
//    return next();
//  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
//  return res.forbidden('You are not permitted to perform this action.');
};
