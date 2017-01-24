/**
 * Development environment settings
 *
 * Used both in the pipeline and to spin up a dev copy to test via localhost
 * 
 */

var fs = require('fs');

module.exports = {
  proxyHost: process.env.URL_HOST || 'http://localhost',
  
  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/
  hostname: process.env.URL_HOST || 'http://localhost:1337',

  cardhosts: [ '129.169.14.209' ],

  emailfrom: "sms67+rotadev@eng.cam.ac.uk",
  hookTimeout: 240000, // 240 seconds
  rotaemail: "sms67+rotadev@eng.cam.ac.uk"
};

module.exports.models = {
// DB_HOST=testmysql5-c6vm DB_NAME=securityrota_dev DB_PASS=securityrota_xx DB_USER=securityrota_web
  connection: 'devMysqlServer',
  migrate: 'drop'
};

module.exports.connections = {
  devMysqlServer:
  {
    adapter: 'sails-mysql',
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'sec_rota_web',
    password: process.env.DB_PASS || 'sec_rota_pass',
    database: process.env.DB_NAME || 'sec_rota_dev',
  },
}
