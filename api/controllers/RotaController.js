/**
 * RotaController
 *
 * @description :: Server-side logic for managing rotas
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
    create: function(req,res,next){
		var params = req.params.all();
	
		Rota.create(params, function(err, rota){
			if (err) return next(err);
		
			res.status(201);
		
			res.json(rota);
		});
	},
	
	list: function(req,res,next){
		Rota.find({},function(err,data){
			res.status(200);
			res.json(data);
		});
	},
	
    update: function(req,res,next){
		var params = req.params.all();
	
		Rota.update(params.id, params, function(err, rota){
			if (err) return next(err);
		
			res.status(201);
		
			res.json(rota);
		});
	},
	
};

