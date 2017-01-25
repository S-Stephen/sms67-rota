var assert = require("assert");
var request = require('supertest');
var session = require('supertest-session');

describe('ManageSessionsController', function() {
  describe('#manager_create_session',function(){
    it('Test that a manager can create and remove a session',function (done){
    //sails.log.debug("Test sessions controller");
    var agent =  request.agent(sails.hooks.http.app);
    sessiondate = new Date()
    var mreq = agent
    .get('/auth/bearer')
    .set('authorization','Bearer goldenticket')
    .redirects(1)
    .expect(200)
    .end(function(err,res){

        if (err){
		    sails.log.debug("Authorization failed"); 
		    return done(err) 
	    }
        agent
        .post('/manager/schedule/add')
        .send(
            {scd_user_username: "test0002", scd_date: sessiondate, scd_rota_code: 'EVE'}
        ).expect(201)
        .end(function(err,res){
            if (err){ 
			    sails.log.debug(" There was an error adding a new session "+err); 
			    return done(err);
		    }
            assert.equal(true,!!JSON.parse(res.text).id,"a test session has been created")
            newschedid = JSON.parse(res.text).id
            
            agent
            .delete('/manager/schedule/del/'+newschedid)
            .expect(201)
            .end(function(err,res){
                if (err){ 
			        sails.log.debug(" There was an error removing the new session "+err); 
			        return done(err);
		        }
                done()  
            })
        })
    })
    })
  })

  describe('#nonmanager_create_session',function(){
    it('test that a non-manager CANNOT create a new session',function (done){
    //sails.log.debug("Test sessions controller");
    var agent =  request.agent(sails.hooks.http.app);
    sessiondate = new Date()
    var mreq = agent
    .get('/auth/bearer')
    .set('authorization','Bearer silverticket')
    .redirects(1)
    .expect(200)
    .end(function(err,res){

        if (err){
		    sails.log.debug("Authorization failed"); 
		    return done(err) 
	    }
        agent
        .post('/manager/schedule/add')
        .send(
            {scd_user_username: "test0002", scd_date: sessiondate, scd_rota_code: 'EVE'}
        ).expect(403)
        .end(function(err,res){
            if (err){ 
			    sails.log.debug(" There was an error adding a new session "+err); 
			    return done(err);
		    }
            done()
        })
    })
    })
  })
})