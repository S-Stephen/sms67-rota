/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    create: function(req,res,next){
		var params = req.params.all();
	
		User.create(params, function(err, user){
			if (err) return next(err);
		
			res.status(201);
		
			res.json(user);
		});
	},
	
	
	
	proxy_students: function(req,res,next){
		//for the currently logged in user find all their students
		User.find({proxy:'!1',manager:'!1',inst_id:req.user.inst_id},function(err,data){
			res.status(200);
			res.json(data);
		});
	},
	
	list: function(req,res,next){
		User.find({},function(err,data){
			res.status(200);
			res.json(data);
		});
	},
	
	
    update: function(req,res,next){
		var params = req.params.all();
	
		User.update(params.id, params, function(err, user){
			if (err) return next(err);
		
			res.status(201);
		
			res.json(user);
		});
	},
};

