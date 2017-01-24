
module.exports ={
	
	
	
  /** 
   * Create an endpoint to register a card
   *  - should this be here - perhaps better somewhere else (AuthController?)
   */
  register_card: function (req,res){
    sails.log("in the AuthActionservice.register_card ");
	
    passport.callback(req, res, function (err, user, challenges, statuses) {
      sails.log("finished");
	  
	  //we should return some code to clarify that the card has bene updated!
	});
  },
  /**
   * Create a authentication callback endpoint
   *
   * This endpoint handles everything related to creating and verifying Pass-
   * ports and users, both locally and from third-aprty providers.
   *
   * Passport exposes a login() function on req (also aliased as logIn()) that
   * can be used to establish a login session. When the login operation
   * completes, user will be assigned to req.user.
   *
   * For more information on logging in users in Passport.js, check out:
   * http://passportjs.org/guide/login/
   *
   * @param {Object} req
   * @param {Object} res
   */
  callback: function (req, res) {
    sails.log("in the AuthActionservice.callback ");
	sails.log("  "+req.param('provider'));
    function tryAgain (err) {
      sails.log("another attempt to login ");
      // Only certain error messages are returned via req.flash('error', someError)
      // because we shouldn't expose internal authorization errors to the user.
      // We do return a generic error and the original request body.
      var flashError = req.flash('error')[0];

      if (err && !flashError ) {
        req.flash('error', 'Error.Passport.Generic');
      } else if (flashError) {
        req.flash('error', flashError);
      }
      req.flash('form', req.body);

      // If an error was thrown, redirect the user to the
      // login, register or disconnect action initiator view.
      // These views should take care of rendering the error messages.
      var action = req.param('action');
      sails.log("action:  "+action);

      switch (action) {
        case 'register':
          res.redirect('/register');
          break;
        case 'disconnect':
          res.redirect('back');
          break;
        default:
          res.redirect('/login');
      }
    }

    passport.callback(req, res, function (err, user, challenges, statuses) {
      sails.log("in function ppassed to passport callback");
      if (err || !user) {
		sails.log("try again");
        return tryAgain(challenges);
      }
      sails.log("we are okay and will continue user:"+user);
      sails.log("we are okay and will continue");
      req.login(user, function (err) {
		sails.log("we are okay and will continue - do we have an error?");
        if (err) {
			sails.log("we are okay and will continue - we HAVE an error!");
          return tryAgain(err);
        }
        
		sails.log("we are okay and will continue - do we have an error?");
        sails.log("the session will be marked as authenticated");
        // Mark the session as authenticated to work with default Sails sessionAuth.js policy
        req.session.authenticated = true
        
        // Upon successful login, send the user to the homepage were req.user
        // will be available.
        sails.log("about to redirect to /");
		
		//are we  registered user?		
		//else direct to summary screen
        res.redirect('/index');
      });
	  
      sails.log("finished");
    });
  },
    
}