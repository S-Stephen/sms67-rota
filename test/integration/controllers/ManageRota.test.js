var assert = require("assert");
var request = require('supertest');
var session = require('supertest-session');

describe('RotaManagementController', function() {
  //1 Test that we can log in as a manager and create a rota
  //2 That that rota then exists in the new database

  describe('#manager_create_edit_rota',function(){
    it('create a new rota',function (done){
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
            .post('/manager/rota/add/')
            .send(
                 {rot_code: "zzz", rot_description: "some rota"}
             ).expect(201)
              .end(function(err,res){
                    if (err){ 
			              sails.log.debug(" there was an error adding a new rota "+err); 
			              return done(err);
		            }
                    Rota.findOne({rot_code:'zzz'})
                    .then(function(testRota) {
                      //console.log(JSON.stringify(testUser))
                        assert.equal(true,!!testRota,"a new rota has been created")
                        // Now test edit rota:
                        agent
                        .put('/manager/rota/edit')
                        .send(
                            {id: testRota.id, rot_code:"zzz", rot_description:"changed rota"}
                        )
                        .expect(201)
                        .end(function(err,res){
                            if (err){
                                sails.log.debug("there was an error editing the rota"+err)
                                return done(err)
                            }
                            done()
                        })                      
                    }).catch(done);
             })
        })        
    }) 
  }) 
  describe('#nonmanager_create_rota',function(){
    it('create a new rota',function (done){
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
            .post('/manager/rota/add/')
            .send(
                 {rot_code: "zzz", rot_description: "some rota"}
             ).expect(403)
              .end(function(err,res){
                  if (err){ 
			              sails.log.debug(" there was an error adding a new rota "+err); 
			              return done(err);
		              }
                done();
             })
        })        
    }) 
  }) 
})