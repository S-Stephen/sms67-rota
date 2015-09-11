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
   }
};

