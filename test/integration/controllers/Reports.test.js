var assert = require("assert");
var request = require('supertest');
var session = require('supertest-session');
var utils = require('./utils.js')

describe('ManagerReportController', function() {
  describe('#manager_monthly_report',function(){
    it('Tests that a manager can retrieve the sessions for a particular month',function (done){
      //sails.log.debug("Test sessions controller");
      var startdate = new Date();
		  startdate.setMonth(startdate.getMonth())
		  startdate.setDate(1)
		  startdate.setHours(0,0,0,0);
		  var enddate = new Date(startdate)
		  enddate.setMonth(enddate.getMonth()+1)
      var agent =  request.agent(sails.hooks.http.app);
      Schedules.create({scd_rota_code:'HOA',scd_user_username:'fake1',scd_date:startdate}).exec(function (err,record){ if (err){ return done(err) }
        Schedules.count({scd_date:{'>=':startdate,'<=':enddate}}).exec(function (err,found){ if (err){return done(err) }
          sails.log.debug("number of sessins found in this month: "+found)
          utils.loginmanager(agent,function(err){
            utils.get(agent,'/rota/schedule/month/0',200,function (err,res){ if (err){ return done(err) }
              //res.body is array of sessions
              assert.equal(res.body.length,found,"days reported matches those in the month")
              done()
            })
          })
        })
      })
    })
  })

  describe('#nonmanager_monthly_report',function(){
    it('Tests that a nonmanager can also retrieve the sessions for a particular month',function (done){
      //sails.log.debug("Test sessions controller");
      var startdate = new Date();
		  startdate.setMonth(startdate.getMonth())
		  startdate.setDate(1)
		  startdate.setHours(0,0,0,0);
		  var enddate = new Date(startdate)
		  enddate.setMonth(enddate.getMonth()+1)
      var agent =  request.agent(sails.hooks.http.app);
      Schedules.create({scd_rota_code:'HOA',scd_user_username:'fake1',scd_date:startdate}).exec(function (err,record){ if (err){ return done(err) }
        Schedules.count({scd_date:{'>=':startdate,'<=':enddate}}).exec(function (err,found){ if (err){return done(err) }
          sails.log.debug("number of sessins found in this month: "+found)
          utils.loginnonmanager(agent,function(err){
            utils.get(agent,'/rota/schedule/month/0',200,function (err,res){ if (err){ return done(err) }
              //res.body is array of sessions
              assert.equal(res.body.length,found,"days reported matches those in the month")
              done()
            })
          })
        })
      })
    })
  })
  
  describe('#manager_full_report',function(){
    it('A manager can retrieve the sessions for all user on all rotas',function (done){
      //sails.log.debug("Test sessions controller");
      var startdate = new Date();
		  startdate.setMonth(startdate.getMonth())
		  startdate.setDate(1)
		  startdate.setHours(0,0,0,0);
		  var enddate = utils.addmonths(startdate,4)
      var agent =  request.agent(sails.hooks.http.app);
      mysessions=[
        {scd_rota_code:'HOA',scd_user_username:'fake2',scd_date:startdate},
        {scd_rota_code:'HOA',scd_user_username:'fake2',scd_date:utils.addmonths(startdate,1)},
        {scd_rota_code:'HOA',scd_user_username:'fake2',scd_date:utils.addmonths(startdate,2)}
      ]
      Schedules.create(mysessions).exec(function (err,record){ if (err){ return done(err) }
        sails.log.debug("records: "+JSON.stringify(record));
        Schedules.count({scd_date:{'>=':startdate,'<=':enddate}}).exec(function (err,found){ if (err){return done(err) }
          sails.log.debug("number of sessions found in this period: "+found)
          utils.loginmanager(agent,function(err){
            utils.post(agent,'/manage/reports/full',{output:'json',start:startdate.getTime(),end:enddate.getTime()},200,function (err,res){ if (err){ return done(err) }
              retarr = JSON.parse(res.text)['results']
              assert.equal(retarr.length,found,"days reported ("+retarr.length+") matches those in the period ("+found+")")
              done()
            })
          })
        })
      })
    })
  })

  describe('#nonmanager_full_report',function(){
    it('A manager can retrieve the sessions for all user on all rotas',function (done){
      //sails.log.debug("Test sessions controller");
      var startdate = new Date();
		  startdate.setMonth(startdate.getMonth())
		  startdate.setDate(1)
		  startdate.setHours(0,0,0,0);
		  var enddate = utils.addmonths(startdate,4)
      var agent =  request.agent(sails.hooks.http.app);
      mysessions=[
        {scd_rota_code:'HOA',scd_user_username:'fake2',scd_date:startdate},
        {scd_rota_code:'HOA',scd_user_username:'fake2',scd_date:utils.addmonths(startdate,1)},
        {scd_rota_code:'HOA',scd_user_username:'fake2',scd_date:utils.addmonths(startdate,2)}
      ]
      Schedules.create(mysessions).exec(function (err,record){ if (err){ return done(err) }
        sails.log.debug("records: "+JSON.stringify(record));
        Schedules.count({scd_date:{'>=':startdate,'<=':enddate}}).exec(function (err,found){ if (err){return done(err) }
          sails.log.debug("number of sessions found in this period: "+found)
          utils.loginnonmanager(agent,function(err){
            utils.post(agent,'/manage/reports/full',{output:'json',start:startdate.getTime(),end:enddate.getTime()},403,function (err,res){ if (err){ return done(err) }
              done()
            })
          })
        })
      })
    })
  })

  describe('#nonmanager_personal_report',function(){
    it('A nonmanager can retrieve their sessions between a particular period',function (done){
      //sails.log.debug("Test sessions controller");
      var startdate = new Date();
		  startdate.setMonth(startdate.getMonth())
		  startdate.setDate(1)
		  startdate.setHours(0,0,0,0);
		  var enddate = utils.addmonths(startdate,4)
      var agent =  request.agent(sails.hooks.http.app);
      mysessions=[
        {scd_rota_code:'HOA',scd_user_username:'test0002',scd_date:startdate},
        {scd_rota_code:'HOA',scd_user_username:'test0002',scd_date:utils.addmonths(startdate,1)},
        {scd_rota_code:'HOA',scd_user_username:'test0002',scd_date:utils.addmonths(startdate,2)}
      ]
      Schedules.create(mysessions).exec(function (err,record){ if (err){ return done(err) }
        sails.log.debug("records: "+JSON.stringify(record));
        Schedules.count({scd_user_username:'test0002',scd_date:{'>=':startdate,'<=':enddate}}).exec(function (err,found){ if (err){return done(err) }
          sails.log.debug("number of sessions found in this period: "+found)
          utils.loginnonmanager(agent,function(err){
            utils.post(agent,'/member/report/attendance',{output:'json',start:startdate.getTime(),end:enddate.getTime()},200,function (err,res){ if (err){ return done(err) }
              retarr = JSON.parse(res.text)['results']
              assert.equal(retarr.length,found,"days reported ("+retarr.length+") matches those in the period ("+found+")")
              done()
            })
          })
        })
      })
    })
  })
})