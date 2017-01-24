var assert = require("assert");
var request = require('supertest');
var session = require('supertest-session');

describe('ManageController', function() {
  describe('#new_user',function(){
    it('create a new user',function (done){
      var agent =  request.agent(sails.hooks.http.app);

      var mreq = agent
        .get('/auth/bearer')
        .set('authorization','Bearer goldenticket')
        .redirects(1)
        .expect(200)
       //.get(myapp)
        .end(function(err,res){
            agent
            .post('/3djob/'+options.job.id)
            .send(
                 {username: "testaddu", display_name: "adduser", email: "taduser@eng.cam.ac.uk", manager: false}
             ).expect(200)
              .end(function(err,res){
                  if (err){ sails.log.debug(" there was an error adding costs "+err); }
                  done()
             })
        })        
    }) 
  }) 
})