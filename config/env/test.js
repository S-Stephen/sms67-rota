/**
 * Test environment settings
 *
 * This file can include shared settings for a test team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  models: {
    migrate: 'drop',
    connection: 'testMysqlServer'
  },
  hookTimeout: 40000, // 40 seconds
  
  hostname: 'http://127.0.0.1:9998',
  port: 9998,
  
};

module.exports.passport = {
   bearer: {
    strategy: require('passport-http-bearer').Strategy
  }
}

//module.exports.passport.protocols = {
//  bearer : require('../../api/services/protocols/bearer') 
//}
