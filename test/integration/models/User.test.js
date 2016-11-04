var assert = require('assert');

describe('UserModel', function() {
  describe('#findManager()', function() {
    it('should check to find the test manager', function (done) {
      User.findOne({username:'test0001'})
      .then(function(testManager) {
        // some tests
        console.log(JSON.stringify(testManager))
        assert.equal(true,testManager.manager)
        done();
      })
      .catch(done);
    });
  });

});
