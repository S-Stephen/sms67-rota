/**
 * ReportsController
 *
 * @description :: Server-side logic for managing reports
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
   manager_index : function(req,res,next){
       
		//NB this could all be acheived by using an angular controller to gather the data
		//infact shall we just do that? - and have this as a fall back
		res.view('local/manage/reports', {
		});		
   },
   member_index : function(req,res,next){
       
		//NB this could all be acheived by using an angular controller to gather the data
		//infact shall we just do that? - and have this as a fall back
		res.view('local/member/reports', {
		});		
   },
   
   // excel_output : function(req,res,next){
       
		// //NB this could all be acheived by using an angular controller to gather the data
		// //infact shall we just do that? - and have this as a fall back
		
		// var xl = require('excel4node');
		// var wb = new xl.WorkBook();
 
		// var wbOpts = {
			// jszip : {
				// compression : 'DEFLATE'
			// },
// //			fileSharing : {
// //				password : 'Password',
// //				userName : 'John Doe'
// //			},
			// allowInterrupt : true
		// }
		// var wb2 = new xl.WorkBook(wbOpts);
		// var ws = wb2.WorkSheet('New Worksheet');
		// ws.Cell(4,3).String('Price/Unit');
		
		// //get the data and put in sheet
		
		// res.send(wb2.write("somebook.xlsx",res));		
   // },
   
   manager_fullsummary : function(req,res,next){
		res.setHeader('Content-Type', 'application/vnd.ms-excel');
		res.setHeader('content-disposition', 'attachment; filename=fullsummary.xlsx');
		
		var xl = require('excel4node');
		var wb = new xl.WorkBook();
 
		var wbOpts = {
			jszip : {
				compression : 'DEFLATE'
			},
//			fileSharing : {
//				password : 'Password',
//				userName : 'John Doe'
//			},
			allowInterrupt : true
		}
		var wb2 = new xl.WorkBook(wbOpts);
		var ws = wb2.WorkSheet('Attendance');
		var ws2 = wb2.WorkSheet('Summary');
		//ws.Cell(4,3).String('Price/Unit');
		
		var mydays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		var result_hsh={};
		Schedules.find().where({scd_date:{'>=':new Date(req.param('start')),'<=':new Date(req.param('end'))}}).sort('scd_user_username DESC').sort('scd_rota_code DESC').sort('scd_date ASC').exec(function foundScheds(err,scheds){
		//Schedules.find().exec(function foundScheds(err,scheds){
			
			
			if (req.param('output') == 'json'){
					scheds.forEach(function outputSched(sched){
						if(result_hsh[sched.scd_user_username+" "+sched.scd_rota_code+' '+mydays[sched.scd_date.getDay()]]){
							result_hsh[sched.scd_user_username+" "+sched.scd_rota_code+' '+mydays[sched.scd_date.getDay()]]++;
						}else{
							result_hsh[sched.scd_user_username+" "+sched.scd_rota_code+' '+mydays[sched.scd_date.getDay()]]=1;
						}
						row++;
					})
					res.json({results:scheds,summary:result_hsh});
			}else{
			
				var row=2;
				scheds.forEach(function outputSched(sched){
					ws.Cell(row,2).String(sched.scd_user_username);
					ws.Cell(row,3).String(sched.scd_date.toDateString());
					ws.Cell(row,4).String(mydays[sched.scd_date.getDay()]);
					if (sched.scd_rota_code) {
						ws.Cell(row,5).String(sched.scd_rota_code);
					}
					if(result_hsh[sched.scd_user_username+" "+sched.scd_rota_code+' '+mydays[sched.scd_date.getDay()]]){
						result_hsh[sched.scd_user_username+" "+sched.scd_rota_code+' '+mydays[sched.scd_date.getDay()]]++;
					}else{
						result_hsh[sched.scd_user_username+" "+sched.scd_rota_code+' '+mydays[sched.scd_date.getDay()]]=1;
					}
					row++;
				})
				row=1;
				for (var key in result_hsh){
					ws2.Cell(row,2).String(key);
					ws2.Cell(row,3).String(""+result_hsh[key]);
					row++;
				}
				res.send(wb2.write("somebook.xlsx",res));
			}
		})
   },

   
   
  
   member_summary : function(req,res,next){

		var mydays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		var result_hsh={};
		
		sails.log(new Date(req.param('start')));
		sails.log(new Date(req.param('end')));
		
		Schedules.find().where({scd_user_username:req.user.username,scd_date:{'>=':new Date(req.param('start')),'<=':new Date(req.param('end'))}}).sort('scd_user_username DESC').sort('scd_rota_code DESC').sort('scd_date ASC').exec(function foundScheds(err,scheds){
		//Schedules.find().exec(function foundScheds(err,scheds){
		
			if (req.param('output') == 'json'){
				scheds.forEach(function outputSched(sched){
					if(result_hsh[sched.scd_user_username+" "+sched.scd_rota_code+' '+mydays[sched.scd_date.getDay()]]){
						result_hsh[sched.scd_user_username+" "+sched.scd_rota_code+' '+mydays[sched.scd_date.getDay()]]++;
					}else{
						result_hsh[sched.scd_user_username+" "+sched.scd_rota_code+' '+mydays[sched.scd_date.getDay()]]=1;
					}
					row++;
				})
				res.json({results:scheds,summary:result_hsh});
			}else{
				//assume excel
		
				res.setHeader('Content-Type', 'application/vnd.ms-excel');
				res.setHeader('content-disposition', 'attachment; filename=fullsummary.xlsx');
				
				var xl = require('excel4node');
				var wb = new xl.WorkBook();
		 
				var wbOpts = {
					jszip : {
						compression : 'DEFLATE'
					},
		//			fileSharing : {
		//				password : 'Password',
		//				userName : 'John Doe'
		//			},
					allowInterrupt : true
				}
				var wb2 = new xl.WorkBook(wbOpts);
				var ws = wb2.WorkSheet('Attendance');
				var ws2 = wb2.WorkSheet('Summary');
				//ws.Cell(4,3).String('Price/Unit');
		
				var row=2;
				scheds.forEach(function outputSched(sched){
					ws.Cell(row,2).String(sched.scd_user_username);
					ws.Cell(row,3).String(sched.scd_date.toDateString());
					ws.Cell(row,4).String(mydays[sched.scd_date.getDay()]);
					if (sched.scd_rota_code) {
						ws.Cell(row,5).String(sched.scd_rota_code);
					}
					if(result_hsh[sched.scd_user_username+" "+sched.scd_rota_code+' '+mydays[sched.scd_date.getDay()]]){
						result_hsh[sched.scd_user_username+" "+sched.scd_rota_code+' '+mydays[sched.scd_date.getDay()]]++;
					}else{
						result_hsh[sched.scd_user_username+" "+sched.scd_rota_code+' '+mydays[sched.scd_date.getDay()]]=1;
					}
					row++;
				})
				row=1;
				for (var key in result_hsh){
					ws2.Cell(row,2).String(key);
					ws2.Cell(row,3).String(""+result_hsh[key]);
					row++;
				}
				res.send(wb2.write("somebook.xlsx",res));
				
			}
		})
	}
 
};

