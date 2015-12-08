/**
* RotaSessions.js
*
* @description :: Stores the sesison information for the rota eg start end on day X
*				  at the moment this 
*
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  identity: 'RotaSessions',
  
  attributes: {
    ros_rota_code: 'STRING',//{collection: 'Schedules',via: 'scd_request_by'},
    ros_date_start: 'DATE', // start of logic period
    ros_date_end: 'DATE', // end of logic period
	ros_day: 'String', // match a day - if set
    ros_start_time: 'STRING',
	ros_end_time: 'STRING'
  }
};

