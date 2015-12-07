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

  
/*  '/': {
     action: 'index',
    controller: 'TestController'
  },
   '/index': {
    action: 'index',
    controller: 'IndexController'
  },
*/
 '/testapi': {
    action: 'index',
    controller: 'TestapiController'
  },


 '/manage': {
    action: 'index',
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
  
  
  
'get /login_card': { view: 'auth/login_card' }
,'post /login_card': 'AuthController.login_card'
,'get /login': 'AuthController.login'
,'post /login': 'AuthController.login'
,'get /logout': 'AuthController.logout'
,'post /logout': 'AuthController.logout'
,'get /register': 'AuthController.register'

//,'post /auth/local': { controller: 'AuthController' , action: 'callback_local' }
// NOTE TODO we must protect auth/local/register!!!! as this could allow people to generate accounts for themselves!
,'post /auth/local/:action': 'AuthController.callback_local'
,'post /auth/local/registercard': 'AuthController.registercard'
,'post /auth/:provider/:action': 'AuthController.callback'

,'get /auth/:provider': 'AuthController.provider'
,'get /auth/:provider/callback': 'AuthController.callback'
,'get /auth/:provider/:action': 'AuthController.callback'

// JSON ajax endpoints (mainly)


,'get /member/schedule': 'ScheduleController.list' // member
,'get /rota/schedule/all': 'ScheduleController.listall' // member
,'get /rota/schedule/swap/:rota/:user': 'ScheduleController.swapfor' // member- lists scheules we can swap with
//request a swap - two objects are passed mine theirs



,'post /member/schedule/swap': 'ScheduleController.requestswap'// checked in SwapActionsService
,'put /member/schedule/offerup': 'ScheduleController.offerup'// checked in SwapActionsService
,'put /member/schedule/grab': 'ScheduleController.grab'// checked in SwapActionsService
,'post /member/schedule/decline': 'ScheduleController.declineswap'// checked in SwapActionsService
,'post /member/schedule/accept': 'ScheduleController.acceptswap' // checked in SwapActionsService


,'get /manage/schedules': {action: 'schedules',controller: 'ManageController' }  //Change to /manage/schedules and protect by isManager
,'get /manage/help': {action: 'help',controller: 'ManageController' }  //Change to /manage/schedules and protect by isManager

,'post /manager/schedule/add': 'ScheduleController.create_manager'// is manager policy
,'delete /manager/schedule/del/:scd_id': 'ScheduleController.del_manager'// is manager policy
,'post /manager/schedule/decline': 'ScheduleController.declineswap_manager'// is manager policy
,'post /manager/schedule/accept': 'ScheduleController.acceptswap_manager'// is manager policy
,'put /manager/schedule/update': 'ScheduleController.update_manager' // is manager policy


,'get /manage/reports': {action: 'manager_index',controller: 'ReportsController' } //Change to /manage/schedules and protect by isManager

,'get /manage/reports/full': {action: 'manager_fullsummary',controller: 'ReportsController' } // isManager
,'post /manage/reports/full': {action: 'manager_fullsummary',controller: 'ReportsController' } // isManager



,'get /member/reports': {action: 'member_index',controller: 'ReportsController' } //Change to /manage/schedules and protect by isManager
,'post /member/report/attendance': {action: 'member_summary',controller: 'ReportsController' } // isManager


,'get /download/excel': {action: 'excel_output',controller: 'ReportsController' } // isManager



,'get /manager/memberships': 'UserController.list'// is manager policy
,'post /manager/memberships/add': 'UserController.create'// is manager policy
,'put /manager/memberships/edit': 'UserController.update'// is manager policy

,'get /manager/rotas': 'RotaController.list'// is manager policy
,'post /manager/rota/add': 'RotaController.create'// is manager policy
,'put /manager/rota/edit': 'RotaController.update'// is manager policy

// Q are these still used?
,'post /user': 'UserController.create'// is manager policy
,'post /rota': 'RotaController.create'// is manager policy
,'get /rotas': 'RotaController.list'// is manager policy


,'get /': 'IndexController.summary'
,'get /summary': 'IndexController.summary' //open 
,'get /summary/:days': 'IndexController.summarydays' //open


,'get /public/summary': 'ScheduleController.summarylist'
,'get /public/summary/:days': 'ScheduleController.summarylistdays'

//n.b there are summary end points in the ScheduleControllers but we don;t use them as we want to publically consume them 


,'get /icals': 'ScheduleController.icaloutput'
,'get /icals/:code': 'ScheduleController.icaloutput_code'


};
