var validator = require('validator');
var crypto    = require('crypto');

/**
 * MyLocal Authentication Protocol
 *
 * The most widely used way for websites to authenticate users is via a username
 * and/or email as well as a password. This module provides functions both for
 * registering entirely new users, assigning passwords to already registered
 * users and validating login requesting.
 *
 * For more information on local authentication in Passport.js, check out:
 * http://passportjs.org/guide/username-password/
 */

/**
 * Register a new user
 *
 * This method creates a new user from a specified email, username and password
 * and assign the newly created user a local Passport.
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
exports.register = function (req, res, next) {
  var email    = req.param('cardid')+"@eng.cam.ac.uk"
    , username = req.param('cardid')
    , cardid = req.param('cardid');
  // var email    = req.param('email')
    // , username = req.param('username')
    // , cardid = req.param('cardid');

  if (!email) {
    req.flash('error', 'Error.Passport.Email.Missing !! ');
    return next(new Error('No email was entered.'));
  }

  if (!username) {
    req.flash('error', 'Error.Passport.Username.Missing');
    return next(new Error('No username was entered.'));
  }

  if (!cardid) {
    req.flash('error', 'Error.Passport.Password.Missing');
    return next(new Error('No password was entered.'));
  }

  User.create({
    username : username
  , email    : email
  , cardid    : cardid
  }, function (err, user) {
    if (err) {
      if (err.code === 'E_VALIDATION') {
        if (err.invalidAttributes.email) {
          req.flash('error', 'Error.Passport.Email.Exists');
        } else {
          req.flash('error', 'Error.Passport.User.Exists ---- ');
        }
      }

      return next(err);
    }

    // Generating accessToken for API authentication
    var token = crypto.randomBytes(48).toString('base64');

    Passport.create({
      protocol    : 'mylocal'
    , password    : cardid
    , user        : user.id
    , accessToken : token
    }, function (err, passport) {
      if (err) {
        if (err.code === 'E_VALIDATION') {
          req.flash('error', 'Error.Passport.Password.Invalid');
        }

        return user.destroy(function (destroyErr) {
          next(destroyErr || err);
        });
      }

      next(null, user);
    });
  });
};

/**
 * Register a card to a user (note this is likely to NOT be the current user)
 *
 * This method registers a card for a user
 * The user must exist
 *  TODO ? needed? and if no passport exists) assign the newly created user a local Passport.
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
exports.registercard = function (req, res, next) {
  var 
     username = req.param('username')
    , cardid = req.param('cardid')
	, query   = {};
  // var email    = req.param('email')
    // , username = req.param('username')
    // , cardid = req.param('cardid');

      sails.log("in registercard  username: "+username);
  if (!username) {
    req.flash('error', 'Error.Passport.Username.Missing');
    return next(new Error('No username was entered.'));
  }

  if (!cardid) {
    req.flash('error', 'Error.Passport.Password.Missing');
    return next(new Error('No password was entered.'));
  }

  //we first need to check that the card has not already been registered by somebody:
  
  User.findOne({cardid: cardid},function(err,user){
	if (user){
		//we have a problem!!
		//res.send("Arghhh");
		//sails.log("Sorry this card is already registered with a user");
		res.json({status:"failed", message:"Sorry this card has already been registered with a user"})
		return;
		//return next(false, user); // if we return an erro rthen we attempt again!
		//return next(new Error('Card already registered'));
	}else{
		//go ahead and update
		  
	  query.username = username;
	  //query.cardid = cardid;
	  
	  User.findOne(query, function (err, user) {
		sails.log("in registercard   - finding user: "+query.username);
		if (err) {
		  return next(err);
		}

		sails.log(" no errors away we go! ");
		if (!user) {
		  req.flash('error', 'Error.Passport.Username.NotFound');
		  
		  sails.log("in registercard   - no user found ;-(");
		  return next(null, false);
		}
		query.cardid = cardid;
		query.id = user.id;
		User.update(user.id,query).exec(function afterwards(err, updated){
			if (err) {
				// handle error here- e.g. `res.serverError(err);`
				sails.log("error updating cardid");
				return;
			}
			sails.log("updated user with card id:");
		});
		
		Passport.findOne({
		  protocol : 'mylocal'
		, user     : user.id
		}, function (err, passport) {
		  if (passport) {
			// update with the cardid
			
				Passport.update(passport.id,{password:cardid}).exec(function afterwards(err, updated){
					if (err) {
						// handle error here- e.g. `res.serverError(err);`
						sails.log("error updating cardid");
						res.json({status:"failed", message:"problem updating passport"})
						return;
					}else{
						res.json({status:"success"})
						sails.log("updated user with card id:");
						return;
					}
				});
			
		  }
		  else {
			//create a new passport
			var token = crypto.randomBytes(48).toString('base64');
			Passport.create({
			  protocol    : 'mylocal'
			, password    : cardid
			, identifier  : cardid
			, provider    : 'mylocal'
			, user        : user.id
			, accessToken : token
			}, function (err, passport) {
			if (err) {
				if (err.code === 'E_VALIDATION') {
					req.flash('error', 'Error.Passport.Password.Invalid');
				}

				return user.destroy(function (destroyErr) {
					next(destroyErr || err);
				});
			}
			//req.flash('error', 'Error.Passport.Password.NotSet');
			//return next(null, false);
			res.json({status:"success"})
			sails.log("card already registered");
			return;
		  });
		}
	  });
	});
	}
  })
  

};
/**
 * Assign local Passport to user
 *
 * This function can be used to assign a local Passport to a user who doens't
 * have one already. This would be the case if the user registered using a
 * third-party service and therefore never set a password.
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
exports.connect = function (req, res, next) {
  var user     = req.user
    , password = req.param('password');

  Passport.findOne({
    protocol : 'mylocal'
  , user     : user.id
  }, function (err, passport) {
    if (err) {
      return next(err);
    }

    if (!passport) {
      Passport.create({
        protocol : 'local'
      , password : password
      , user     : user.id
      }, function (err, passport) {
        next(err, user);
      });
    }
    else {
      next(null, user);
    }
  });
};

/**
 * Validate a login request
 *
 * Looks up a user using the supplied identifier (email or username) and then
 * attempts to find a local Passport associated with the user. If a Passport is
 * found, its password is checked against the password supplied in the form.
 *
 * @param {Object}   req
 * @param {string}   identifier
 * @param {string}   password
 * @param {Function} next
 */
exports.login = function (req, res, next) {
  var  query   = {};

  sails.log("in the local protocol -> login");
  //sails.log("identifier: "+identifier);
	
  query.cardid = req.param('cardid');
  sails.log("card id: "+query.cardid);
  
  User.findOne(query, function (err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      req.flash('error', 'Error.Passport.CardId.NotFound');
	  
      return next(null, false);
    }

    Passport.findOne({
      protocol : 'mylocal'
    , user     : user.id
    }, function (err, passport) {
      if (passport) {
		sails.log("IN mylocal protocol: we have a passport ");
		
		//res.redirect('/index');
		//return;
		return next(null, user);
      }
      else {
        req.flash('error', 'Error.Passport.Password.NotSet');
        return next(null, false);
      }
    });
  });
};
