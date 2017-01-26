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
})