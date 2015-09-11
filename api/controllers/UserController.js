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

