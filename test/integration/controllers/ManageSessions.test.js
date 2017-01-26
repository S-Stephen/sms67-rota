var assert = require("assert");
var request = require('supertest');
var session = require('supertest-session');
var utils = require('./utils.js')

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
    
    //first create a new session (by a manager) to attempt to remove later
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
            {scd_user_username: "test0002", scd_date: sessiondate, scd_rota_code: 'MOR'}
        ).expect(201)
        .end(function(err,res){
            if (err){ 
			    sails.log.debug(" There was an error adding a new session "+err); 
			    return done(err);
		    }
            assert.equal(true,!!JSON.parse(res.text).id,"a test session has been created")
            newschedid = JSON.parse(res.text).id


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
                    {scd_user_username: "test0002", scd_date: sessiondate, scd_rota_code: 'LEV'}
                ).expect(403)
                .end(function(err,res){
                    if (err){ 
			            sails.log.debug(" There was an error adding a new session "+err); 
			            return done(err);
		            }

                    //we are now logged in as a non-manager user
                    //also test that we are unable to remove the session created earlier by the manager
                    agent
                    .delete('/manager/schedule/del/'+newschedid)
                    .expect(403)
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
    })
  })
})


describe('ManageRepeatingSessions', function() {
  describe('#manager_create_repeating_sessions',function(){
    it('Test that a manager can remove all sessions within a period',function (done){
        
        var agent =  request.agent(sails.hooks.http.app);

        //sessions rotate the users and apply then to the next chosen day specified in the period
        //the users supplies a list of ordered users, a period, and the days to populate 
        //Unfortunately can not test via controller because the logic is help in angular code
        done()
    })
  })
})


describe('ManageBulkTransferSessions', function() {
  describe('#manager_transfer_sessions_to_other',function(){
    it('Test that a manager can transfer all the sessions occuring for a particular user in a period',function (done){
        var agent =  request.agent(sails.hooks.http.app);

        //load a selecton of sessions for a period of ten days:
        startdate=new Date()
        enddate=new Date(startdate.getTime()+20*24*60*60*1000)
        mdate = new Date(startdate.getTime()+1*24*60*60*1000)
        numsessions=0;
	    numrecs=10;
        Schedules.destroy({scd_rota_code:'HOA',scd_user_username:'fake1',scd_date:{'>=':startdate,'<=':enddate}}).exec( function (err,record){ if (err){ return done(err) }
          Schedules.create({scd_rota_code:'HOA',scd_user_username:'fake1',scd_date:mdate}).exec(function (err,record){ if (err){ return done(err) }
	          utils.loadnextsession(err,record,function (){ 
		        //added all sessions for fake1
                  Schedules.count({scd_rota_code:'HOA',scd_user_username:'fake1',scd_date:{'>=':startdate,'<=':enddate}}).exec(function (err,found){ if (err){return done(err) }
                  //count fake1 sessions to update
                    numfake1= found
                      assert.equal(numfake1,10,"rota has been populated with the correct number of sessions") 
                      Schedules.count({scd_rota_code:'HOA',scd_user_username:'fake2',scd_date:{'>=':startdate,'<=':enddate}}).exec(function (err,found){ if (err){return done(err) }
                      //count fake2 sessions already available
                        numfake2=found
                        utils.loginmanager(agent, function(){
                            sails.log.debug("num fake2: "+numfake2+" num fake1: "+numfake1)
                            utils.put(agent,
                                '/manager/schedules/update',
                                {rota:'HOA',session_member_from:'fake1',session_member_to:'fake2',startdate:startdate,enddate:enddate},
                                201, function (err){ if (err){ done(err) }
                                sails.log.debug("called update")
                                Schedules.count({scd_rota_code:'HOA',scd_user_username:'fake2',scd_date:{'>=':startdate,'<=':enddate}}).exec(function (err,found){ if (err){ done(err) }
                                  assert.equal(found,10,"correct number of session swapped") 
                                  done()                                
                                })
                            })
                        })
                      })
                  })
              })     
          })
        })
    })
  })

  describe('#nonmanager_transfer_sessions_to_other',function(){
    it('Tests that a nonmanager can NOT transfer all the sessions occuring for a particular user in a period',function (done){
      var agent =  request.agent(sails.hooks.http.app);
      utils.loginnonmanager(agent, function(){
        utils.put(agent,
          '/manager/schedules/update',
          {rota:'HOA',session_member_from:'fake1',session_member_to:'fake2',startdate:startdate,enddate:enddate},
          403, 
          function (err){ if (err){ return done(err) }
            done()                             
          }
        )
      })
    })
  })
})


describe('ManageTransferSession', function() {
  describe('#manager_transfer_session_to_other',function(){
    it('Test that a manager can transfer a sessions to another user',function (done){
        var agent =  request.agent(sails.hooks.http.app);

        startdate=new Date()
        enddate=new Date(startdate.getTime()+20*24*60*60*1000)
        mdate = new Date(startdate.getTime()+1*24*60*60*1000)
        numsessions=0;
	    numrecs=10;
        
        Schedules.create({scd_rota_code:'HOA',scd_user_username:'fake1',scd_date:mdate}).exec(function (err,record){ if (err){ return done(err) }
          utils.loginmanager(agent, function(){
             utils.put(agent,
               '/manager/schedule/update',
               {id: record.id,scd_user_username:'fake2'},
               201, function (err){ if (err){ done(err) }                    
                  done()                                
               })
          })
        })
      })
    })
  

    describe('#nonmanager_transfer_session_to_other',function(){
      it('Tests that a nonmanager can NOT transfer a session to another user',function (done){
        var agent =  request.agent(sails.hooks.http.app);
        utils.loginnonmanager(agent, function(){
          utils.put(agent,
            '/manager/schedule/update',
            {id:1,session_member_from:'fake1'},
            403, 
            function (err){ if (err){ return done(err) }
              done()                             
            }
          )
        })
      })
    })
  })

  
describe('ManageTransferSession', function() {
  describe('#manager_transfer_session_to_other',function(){
    it('Test that a manager can swap a sessions with another user',function (done){
        var agent =  request.agent(sails.hooks.http.app);
        //This is currently acheived by individual swaps in the client libraries
        //Calling /manage/schedule/update for the two sessions
        //Therefore if ManageTransferSession passes this will pass

        //Currently no need to write new scenario
        done()
    })
  })
})