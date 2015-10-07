/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/summary': {
	action: 'summary',
	controller: 'IndexController'
  },
  
  '/': {
     action: 'index',
    controller: 'TestController'
  },
   '/index': {
    action: 'index',
    controller: 'IndexController'
  },

 '/testapi': {
    action: 'index',
    controller: 'TestapiController'
  },


 '/manage': {
    action: 'index',
    controller: 'ManageController'
  },

 '/schedules': {
    action: 'schedules',
    controller: 'ManageController'
  },

  '/auth/raven': {
     action: 'callback',
     controller: 'AuthController'
  },
  /*'/': {
    view: 'homepage'
  },*/

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
  
  
'get /login': 'AuthController.login',
'post /login': 'AuthController.login',
'get /logout': 'AuthController.logout',
'post /logout': 'AuthController.logout',
'get /register': 'AuthController.register',

'post /auth/local': 'AuthController.callback',
'post /auth/local/:action': 'AuthController.callback',

'get /auth/:provider': 'AuthController.provider',
'get /auth/:provider/callback': 'AuthController.callback',
'get /auth/:provider/:action': 'AuthController.callback',

'post /user': 'UserController.create'
,'post /rota': 'RotaController.create'
,'get /rotas': 'RotaController.list'

// JSON ajax endpoints (mainly)

,'get /manager/memberships': 'UserController.list'
,'post /manager/memberships/add': 'UserController.create'
,'put /manager/memberships/edit': 'UserController.update'
,'get /manager/rotas': 'RotaController.list'
,'post /manager/rota/add': 'RotaController.create'
,'put /manager/rota/edit': 'RotaController.update'
,'get /member/schedule': 'ScheduleController.list'
,'post /manager/schedule/add': 'ScheduleController.create'
,'get /rota/schedule/all': 'ScheduleController.listall'
,'get /rota/schedule/swap/:rota/:user': 'ScheduleController.swapfor'
//request a swap - two objects are passed mine theirs
,'post /member/schedule/swap': 'ScheduleController.requestswap'
,'put /member/schedule/giveup': 'ScheduleController.giveup'
,'put /member/schedule/grab': 'ScheduleController.grab'
,'post /member/schedule/decline': 'ScheduleController.declineswap'
,'post /member/schedule/accept': 'ScheduleController.acceptswap'
,'delete /manager/schedule/del/:scd_id': 'ScheduleController.del'
,'post /manager/schedule/decline': 'ScheduleController.declineswap'
,'post /manager/schedule/accept': 'ScheduleController.acceptswap'
,'put /manager/schedule/update': 'ScheduleController.update'


,'get /public/summary': 'ScheduleController.summarylist'


};
