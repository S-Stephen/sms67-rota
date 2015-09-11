/**
 * TestapiController
 *
 * @description :: Server-side logic for managing testapis
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
       index : function(req,res,next){
        res.view('local/testapi', {
          user : req.user
        })
      }
};

