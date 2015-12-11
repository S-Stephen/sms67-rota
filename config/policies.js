/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  //'*': true,

  /***************************************************************************
  *                                                                          *
  * Here's an example of mapping some policies to run before a controller    *
  * and its actions                                                          *
  *                                                                          *
  ***************************************************************************/
	// RabbitController: {

		// Apply the `false` policy as the default for all of RabbitController's actions
		// (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
		// '*': false,

		// For the action `nurture`, apply the 'isRabbitMother' policy
		// (this overrides `false` above)
		// nurture	: 'isRabbitMother',

		// Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
		// before letting any users feed our rabbits
		// feed : ['isNiceToAnimals', 'hasRabbitFood']
	// }
	//
	//
   // mine for PAssport:
   //
   // 'AuthController':  { 
		// '*': true,
		// 'callback': ['cardhostAuth']			
	// },
   'indexController': { 
		'*': ['passport', 'sessionAuth'],
		'summary': ['passport',true],
		'summaryDays': ['passport',true]
	},
   'ScheduleController' :  { 
		'*': ['passport', 'sessionAuth'],
		'declineswap_manager':['passport','sessionAuth','isManager'],
		'acceptswap_manager':['passport','sessionAuth','isManager'],
		'create_manager':['passport','sessionAuth','isManager'],
		'update_manager':['passport','sessionAuth','isManager'],
		'del_manager':['passport','sessionAuth','isManager'],
		summarylistdays: true,
		icaloutput: true,
		icaloutput_code: true
	},
	
   'RotaController' : { 
		'*' : ['passport','sessionAuth','isManager'],
		'list' : ['passport','sessionAuth']
	},
   'ReportsController' : { '*': ['passport', 'sessionAuth'], 'manager_index': ['passport','sessionAuth','isManager'], 'manager_fullsummary': ['passport','sessionAuth','isManager']},
   'UserController' :  ['passport','sessionAuth','isManager'],
   'ManageController': ['passport', 'sessionAuth','isManager'],
   '*': ['passport', 'sessionAuth'],
   'AuthController': {
		'*': ['passport'],
		'registercard': ['passport','cardhostAuth'],
		'callback_local': ['passport','cardhostAuth']	
	},
  // //we could writ eabove as:
  // 'auth': {
    // '*': ['passport'],
    // 'callback': ['cardhostAuth']	
  // },
  // DEBUG allow everthing through whilst we investigate the model access (seems to break passport)
  //'*': true
};
