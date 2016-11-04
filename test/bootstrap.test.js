var sails = require('sails');
var fixtures = require('sails-fixtures');

before(function(done) {

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(50000);

  sails.lift({
    // configuration for testing purposes
  }, function(err, server) {
    if (err) return done(err);
    // here you can load fixtures, etc.
    console.log("url: "+sails.getBaseUrl())
    //add a test user test0001 (the only user we need to add)
    
     User.create({username:'test0001',email:'sms67-test0001@cam.ac.uk',display_name:'Test Manager',manager:1})
      .then(function(myuser) {
        // some tests
        sails.log.debug("hopefully created our user!")
        sails.log.debug("myuser: "+JSON.stringify(myuser))
        sails.log.debug("dirname: "+__dirname);
        Passport.create({'protocol':'bearer','accessToken':'goldenticket','provder':'travis','user':myuser.id})
        .then(function(mypass){
            fixtures.init({
              'dir':__dirname+'/fixtures',
              'pattern':'*.json',
            },done)
        })
        //done();
        //done(err, sails);
      })
      .catch(function alertme(e) {
       sails.log.debug("failed to create our manager: "+e);
     })
    });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});
