var assert = require("assert");
var request = require('supertest');
var session = require('supertest-session');

describe('ManageSessionsController', function() {
  describe('#manager_create_session',function(){
    it('create a new rota',function (done){
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
            done()
        })
    })
    })
  })

  describe('#nonmanager_create_session',function(){
    it('test that a non-manager CANNOT create a new rota',function (done){
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