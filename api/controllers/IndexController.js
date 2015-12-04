/**
 * IndexController
 *
 * @description :: Server-side logic for managing indices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
   index : function(req,res,next){
        sails.log("in index controller");
		//NB this could all be acheived by using an angular controller to gather the data
		//infact shall we just do that? - and have this as a fall back
        Schedules.find(function foundScheds(err,scheds){
                sails.log("queried the Schedules table");
				//we need to pad the sched for each schedule
			Rota.find(function foundRotas(err,rotas){
				res.view('local/index', {
					rotas: rotas,
					user : req.user,
					scheds : scheds
				});
				
			});
		});
   },
   summary : function(req,res,next){
        sails.log("in index controller");
		//NB this could all be acheived by using an angular controller to gather the data
		//infact shall we just do that? - and have this as a fall back
		var nowd = new Date();
		nowd.setHours(12,0,0,0);
		var dates=[nowd,new Date(nowd.getTime()+1000*60*60*24),new Date(nowd.getTime()+1000*60*60*24*2)]
        Schedules.find({scd_date:dates}).exec(function foundScheds(err,scheds){
                sails.log("queried the Schedules table");
				//we need to pad the sched for each schedule
			Rota.find(function foundRotas(err,rotas){
				res.view('local/summary', {
					rotas: rotas,
					user : req.user,
					scheds : scheds
				});
				
			});
		});
   },
   
   
   summarydays : function(req,res,next){
		var days = req.param('days')
		sails.log("remove session id: "+req.param('days'));
   
		var nowd = new Date();
		nowd.setHours(12,0,0,0);
		var dates=[nowd]; //,new Date(nowd.getTime()+1000*60*60*24),new Date(nowd.getTime()+1000*60*60*24*2)]
		var i=1;
		while (i<days){
			dates.push(new Date(nowd.getTime()+1000*60*60*24*i))
			i++;
		}
        Schedules.find({scd_date:dates}).exec(function foundScheds(err,scheds){
                sails.log("queried the Schedules table");
				//we need to pad the sched for each schedule
			Rota.find(function foundRotas(err,rotas){
				res.view('local/summary_days', {
					rotas: rotas,
					user : req.user,
					scheds : scheds,
					days: days
				});
				
			});
		});
   },
 
};

