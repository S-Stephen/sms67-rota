var assert = require("assert");
var request = require('supertest');
var session = require('supertest-session');

describe('ManageController', function() {
  //1 Test that we can log in as a manager and create a user
  //2 That that user exists in the database
  describe('#manager_create_user',function(){
    it('create a new user',function (done){
      var agent =  request.agent(sails.hooks.http.app);

      var mreq = agent
        .get('/auth/bearer')
        .set('authorization','Bearer goldenticket')
        .redirects(1)
        .expect(200)
       //.get(myapp)
        .end(function(err,res){
            if (err){
		          sails.log.debug("Authorization failed"); 
		          return done(err) 
	          }
            agent
            .post('/manager/memberships/add/')
            .send(
                 {username: "testaddu", display_name: "adduser", email: "taduser@eng.cam.ac.uk", manager: false}
             ).expect(201)
              .end(function(err,res){
                  if (err){ 
			              sails.log.debug(" there was an error adding a new user "+err); 
			              return done(err);
		              }
                    User.findOne({username:'testaddu'})
                      .then(function(testUser) {
                      //console.log(JSON.stringify(testUser))
                        assert.equal(true,!!testUser,"a test user has been created")
                        done();
                      }).catch(done);
             })
        })        
    }) 
  }) 
  //Test that we can log in as a regular user but are unable to add a new user
  describe('#nonmanager_NOT_create_user',function(){
    it('tests that a regular user is unable to create a new user',function (done){
      var agent =  request.agent(sails.hooks.http.app);

      var mreq = agent
        .get('/auth/bearer')
        .set('authorization','Bearer silverticket')
        .redirects(1)
        .expect(200)
       //.get(myapp)
        .end(function(err,res){
            if (err){
		          sails.log.debug("Authorization failed"); 
		          return done(err) 
	          }
            agent
            .post('/manager/memberships/add/')
            .send(
                 {username: "testaddu2", display_name: "adduser2", email: "taduser2@eng.cam.ac.uk", manager: false}
             ).redirects(1).expect(403)
              .end(function(err,res){
                  if (err){ 
			              sails.log.debug("Security issue: non manager was able to create a user "+err); 
			              return done(err);
		              }
                  done()
             })
        })        
    }) 
  }) 


})
