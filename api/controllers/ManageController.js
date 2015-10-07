/**
 * ManageController
 *
 * @description :: Server-side logic for managing manages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	// to access this controller we need to be a manager (check via policies)
	
   index : function(req,res,next){
        sails.log("DEBUG in manage controller");
        User.find(function foundUsers(err,users){
			Rota.find( function foundRotas(err,rotas){
                sails.log("queried the Rotas table");
				res.view('local/manage/index', {
					user : req.user,
					rotas : rotas,
					users : users
				});
			});
		}
	)
   },
   
   schedules : function(req,res,next){
		sails.log("DEBUG in manage schedules controller");
		//we will retrieve the sessions via an angular app / controller
		res.view('local/manage/schedules',{
			user:req.user
		});
   }
};

