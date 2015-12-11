/**
 * Passport configuration
 *
 * This is the configuration for your Passport.js setup and where you
 * define the authentication strategies you want your application to employ.
 *
 * I have tested the service with all of the providers listed below - if you
 * come across a provider that for some reason doesn't work, feel free to open
 * an issue on GitHub.
 *
 * Also, authentication scopes can be set through the `scope` property.
 *
 * For more information on the available providers, check out:
 * http://passportjs.org/guide/providers/
 */

module.exports.passport = {

/*
 * un comment for card reader
 * local: {
    protocol: 'mylocal',
    strategy: require('passport-local').Strategy
  },
*/
/*  bearer: {
    strategy: require('passport-http-bearer').Strategy
  },

  twitter: {
    name: 'Twitter',
    protocol: 'oauth',
    strategy: require('passport-twitter').Strategy,
    options: {
      consumerKey: 'your-consumer-key',
      consumerSecret: 'your-consumer-secret'
    }
  },

  github: {
    name: 'GitHub',
    protocol: 'oauth2',
    strategy: require('passport-github').Strategy,
    options: {
      clientID: 'your-client-id',
      clientSecret: 'your-client-secret'
    }
  },

  facebook: {
    name: 'Facebook',
    protocol: 'oauth2',
    strategy: require('passport-facebook').Strategy,
    options: {
      clientID: 'your-client-id',
      clientSecret: 'your-client-secret',
      scope: ['email'] *//* email is necessary for login behavior */
/*    }
  },
*/
/*   google: {
     name: 'Google',
     protocol: 'oauth2',
     strategy: require('passport-google-oauth').OAuth2Strategy,
     options: {
       clientID: '972117638860-3fmdsmj1sahc48d24tvjelpulia4crr1.apps.googleusercontent.com',
       //clientID: '972117638860-4uvfb32bp2pm3a4u4642q6bj5o873erp.apps.googleusercontent.com',
       clientSecret: '7KvZjoe_nu96tnMATGT2KlZ6',
       //clientSecret: 'aPamjW0_qZq0GvFoYP-qp7Mc',
       callbackURL: 'http://www.securityrota.co.uk/auth/google/callback',
       scope: "email"
     }
   },
*/
/*
  cas: {
    name: 'CAS',
    protocol: 'cas',
    strategy: require('passport-cas').Strategy,
    options: {
      ssoBaseURL: 'http://your-cas-url',
      serverBaseURL: 'http://localhost:1337',
      serviceURL: 'http://localhost:1337/auth/cas/callback'
    }
  },

*/
  raven: {
    name: 'raven',
    protocol: 'WAAWLS', // NB protocol must be alpha numeric (not WAA->WLS) to store in passport
    strategy: require('passport-raven').Strategy,
    options: {
        audience: 'http://localhost:1337',
	desc: 'My Raven Application',
  	msg: 'we need to check you are a current student',
  // use demonstration raven server in development
  	debug: process.env.NODE_ENV !== 'production'},
   
    func:  function (crsid, response, cb) {
  	console.dir(response);
  	console.log('login with crsid: ' + crsid);
  	cb(null, {crsid: crsid, isCurrent: response.isCurrent});
    }
  }
};
