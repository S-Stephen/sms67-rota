var assert = require("assert");
var request = require('supertest');
var session = require('supertest-session');
var utils = require('./utils.js')

describe('MemberSwapController', function() {

  describe('#memberOfferUp',function(){
    it('Test that a member can offer up a session, but not someone elses. Then the user (or any other) can gab the session back',function (done){
      
      var agent =  request.agent(sails.hooks.http.app);

      var startdate = new Date();
	  startdate.setMonth(startdate.getMonth())
	  startdate.setDate(1)
	  startdate.setHours(0,0,0,0);
	  var enddate = utils.addmonths(startdate,4)
      Schedules.destroy({scd_rota_code:'EVE',scd_user_username:'test0002',scd_date:{'>=':startdate,'<=':enddate}}).exec( function (err,records){ if (err){ return done(err) }
        Schedules.create({scd_rota_code:'EVE',scd_user_username:'test0002',scd_date:startdate}).exec(function (err,record1){ if (err){ return done(err) }
          Schedules.create({scd_rota_code:'EVE',scd_user_username:'test0003',scd_date:utils.adddays(startdate,1)}).exec(function (err,record2){ if (err){ return done(err) }
            //login as test0002 and attempt to offer up test0003 session - permission denied
            
            utils.loginnonmanager(agent,function(err){
                sails.log.debug("record2 : "+JSON.stringify(record2))
                utils.put(agent,'/member/schedule/offerup',{mine:record2},403,function (err,res){  if (err){ return done(err+" deny non owner") }
                    sails.log.debug("record1 : "+JSON.stringify(record1))
                    //deny ability to non owner to offer up
                    utils.put(agent,'/member/schedule/offerup',{mine:record1},201,function (err,res){  if (err){ return done(err+" allow owner to offer ") }
                        //allow owner to offer up
                        utils.put(agent,'/member/schedule/grab',{theirs:record1},201,function (err,res){  if (err){ return done(err+" allow owner to grab ") }
                        //allow owner to grab own offer
                        
                            done()
                        })
                    })
                })
            })
                //login as test0002 and offer up test0002 session

                //attempt to grab my (test0002) own offered up session allowed

                //test0002 offer up again

                //login as test0003 and grab session
            //})
          })
        })
      })
    })
  })

  
  describe('#memberRequestSwap',function(){
    it('Test that a memeber can request a swap',function (done){
        done()
    })
  })

  
  describe('#memberDeclineAcceptSwap',function(){
    it('Test that a memeber can decline / accept a swap',function (done){
        done()
    })
  })

  
  describe('#member',function(){
    it('Test that a memeber can request a swap',function (done){
        done()
    })
  })

})