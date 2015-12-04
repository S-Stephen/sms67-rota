/**
* Schedules.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  identity: 'Schedules',
  
  attributes: {
    scd_rota_code: 'STRING',
    scd_date: 'DATE',
    scd_user_username: 'STRING',
    scd_status: 'STRING',
    //scd_request_by: 'INTEGER', //the request from another schedule
    //scd_request_to: 'INTEGER', // the promise to another schedule
    //requestby:{
	//	collection: 'Schedules',
	//	via: 'scd_request_to'
	//},
	//requestto:{
	//	collection: 'Schedules',
	//	via: 'scd_request_by'
	//},
	scd_start: 'STRING', //imported from the rots table
	scd_finish: 'STRING',
	scd_request_by:{
		model: 'Schedules'
	},
	scd_request_to:{
		model: 'Schedules' 
	}
  }
};

