/**
 * IndexController
 *
 * @description :: Server-side logic for managing indices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
   index : function(req,res,next){
        sails.log("in Test controller");
        var today=new Date();
        Schedules.find().where({scd_date:{'>':today}}).sort({scd_date: 'asc'}).exec( function foundScheds(err,scheds){
                sails.log("queried the Schedules table");
        	res.view('local/index_root', {
			scheds : scheds
        	});
		}
	)
   }
};

