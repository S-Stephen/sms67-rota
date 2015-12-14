/**
 * ScheduleController
 *
 * @description :: Server-side logic for managing schedules
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
    create_manager: function(req,res,next){
		var params = req.params.all();
		var mydate = new Date(params.scd_date);
		sails.log("DEBUG adding a new schedule here! "+mydate.getDay());
		
		
		//TODO this isn't yet there as the hours are different depending on the day
		
		RotaSessions.findOne({ros_rota_code:params.scd_rota_code,ros_day:{'like':'%'+mydate.getDay()+'%'}}).exec(function foundOne(err,data){
			
			//trouble if no data found!
			
			params.scd_start=data.ros_start_time;
			params.scd_finish=data.ros_end_time;
			
			params.scd_status="accepted";
			Schedules.create(params, function(err, data){
			//we need to populate the start finish times too!
				if (err) return next(err);
		
				res.status(201);
				sails.log("DEBUG new Schedule: "+data);
				sails.sockets.blast('schedule',{verb:'created',ele:data});
				res.json(data);
			});
		})

	},
	
	usernamelookup: function(req,res,next){
		User.find().exec(function(err,data){
			res.status(200);
			res.json(data);
		});
	},
	
	//list the scheules for the current user (req.user.username)
	list: function(req,res,next){
		Schedules.find().where({'scd_user_username':req.user.username}).populate('scd_request_by').populate('scd_request_to').sort('scd_date ASC').exec(function(err,data){
			res.status(200);
			res.json(data);
		});
	},
	
	//retrieve the schedules for all rotas all dates!! 
	listall: function(req,res,next){
		Schedules.find().where({}).sort('scd_rota_code').populate('scd_request_by').populate('scd_request_to').sort('scd_date ASC').exec(function(err,data){
			res.status(200);
			res.json(data);
		});
	},
	
	//list the schedules for the current and next two days
	summarylist: function(req,res,next){
		var nowd = new Date();
		nowd.setHours(12,0,0,0);
		var dates=[]
		dates.push(nowd)
		dates.push(new Date(nowd.getTime()+1000*60*60*24))
		dates.push(new Date(nowd.getTime()+1000*60*60*24*2))
		var first_date=(new Date(nowd.getTime()-1000*60*60*24)) //scd_date is a date not date time nowd will be after scd_date as it also has hours
																//todo handle the hours correctly as time zone is applied each time
		sails.log("nowd: "+nowd);
        Schedules.find().where({scd_date:{'>=':first_date,'<=':dates[2]}}).exec(function foundScheds(err,scheds){
                sails.log("queried the Schedules table schesd : "+scheds);
				//we need to pad the sched for each schedule
			Rota.find({sort:'rot_order'}).exec(function foundRotas(err,rotas){
			
				var rota_arr=[];
				rotas.forEach(function(rot){
					rota_arr.push(rot); // thi swill be used in an ng-orderBy
				});
				User.find().exec(function users(err,users){
					var user_hash={};
					sails.log("users: "+users);
					users.forEach(function(muser){
						//assume it's okay for public to have emails
						user_hash[muser.username]=muser;
					})
					res.status(200);
				//how do we send back the aarrays via keys!!!?//
					sails.log("DEBUG dates: "+dates);
					sails.log("DEBUG rota_arr: "+rota_arr);
					res.json({rotas:rota_arr,scheds:scheds,mdates:dates,users:user_hash,iscardhost:sails.config.cardhosts.indexOf(req.ip)});
					//res.json({rotas:rota_arr,scheds:scheds,mdates:dates,users:user_hash});
				})
			});
		});
	},
	
	summarylistdays: function(req,res,next){
		var days = req.param('days')
		sails.log("remove session id: "+req.param('days'));
		var nowd = new Date();
		nowd.setHours(12,0,0,0);
		var dates=[]
		dates.push(nowd)
		var i=1;
		while (i<days){
			dates.push(new Date(nowd.getTime()+1000*60*60*24*i))
			i++;
		}
		//dates.push(new Date(nowd.getTime()+1000*60*60*24))
		//dates.push(new Date(nowd.getTime()+1000*60*60*24*2))
		var first_date=(new Date(nowd.getTime()-1000*60*60*24)) //scd_date is a date not date time nowd will be after scd_date as it also has hours
																//todo handle the hours correctly as time zone is applied each time
		sails.log("nowd: "+nowd);
        Schedules.find().where({scd_date:{'>=':first_date,'<=':dates[days-1]}}).exec(function foundScheds(err,scheds){
                sails.log("queried the Schedules table schesd : "+scheds);
				//we need to pad the sched for each schedule
			Rota.find({sort:'rot_order'}).exec(function foundRotas(err,rotas){
			
				var rota_arr=[];
				if (rotas){
				rotas.forEach(function(rot){
					rota_arr.push(rot); // thi swill be used in an ng-orderBy
				});
				}
				User.find().exec(function users(err,users){
					var user_hash={};
					sails.log("users: "+users);
					if (users){
					users.forEach(function(muser){
						//assume it's okay for public to have emails
						user_hash[muser.username]=muser;
					})
					}
					res.status(200);
				//how do we send back the aarrays via keys!!!?//
					sails.log("DEBUG dates: "+dates);
					sails.log("DEBUG rota_arr: "+rota_arr);
					res.json({rotas:rota_arr,scheds:scheds,mdates:dates,users:user_hash,iscardhost:sails.config.cardhosts.indexOf(req.ip)});
					//res.json({rotas:rota_arr,scheds:scheds,mdates:dates,users:user_hash});
				})
			});
		});
	},
	//list the schedules for the current and next two days
	summarylistweek: function(req,res,next){
		var nowd = new Date();
		nowd.setHours(12,0,0,0);
		var dates=[]
		dates.push(nowd)
		var i=1;
		while (i<8){
			dates.push(new Date(nowd.getTime()+1000*60*60*24*i))
			i++;
		}
		//dates.push(new Date(nowd.getTime()+1000*60*60*24))
		//dates.push(new Date(nowd.getTime()+1000*60*60*24*2))
		var first_date=(new Date(nowd.getTime()-1000*60*60*24)) //scd_date is a date not date time nowd will be after scd_date as it also has hours
																//todo handle the hours correctly as time zone is applied each time
		sails.log("nowd: "+nowd);
        Schedules.find().where({scd_date:{'>=':first_date,'<=':dates[7]}}).exec(function foundScheds(err,scheds){
                sails.log("queried the Schedules table schesd : "+scheds);
				//we need to pad the sched for each schedule
			Rota.find({sort:'rot_order'}).exec(function foundRotas(err,rotas){
			
				var rota_arr=[];
				rotas.forEach(function(rot){
					rota_arr.push(rot); // thi swill be used in an ng-orderBy
				});
				User.find().exec(function users(err,users){
					var user_hash={};
					sails.log("users: "+users);
					users.forEach(function(muser){
						//assume it's okay for public to have emails
						user_hash[muser.username]=muser;
					})
					res.status(200);
				//how do we send back the aarrays via keys!!!?//
					sails.log("DEBUG dates: "+dates);
					sails.log("DEBUG rota_arr: "+rota_arr);
					res.json({rotas:rota_arr,scheds:scheds,mdates:dates,users:user_hash,iscardhost:sails.config.cardhosts.indexOf(req.ip)});
					//res.json({rotas:rota_arr,scheds:scheds,mdates:dates,users:user_hash});
				})
			});
		});
	},
	
	//list the schedules for the current and next two days
	summarylistmonth: function(req,res,next){
		var nowd = new Date();
		nowd.setHours(12,0,0,0);
		var dates=[]
		dates.push(nowd)
		dates.push(new Date(nowd.getTime()+1000*60*60*24))
		dates.push(new Date(nowd.getTime()+1000*60*60*24*2))
		var first_date=(new Date(nowd.getTime()-1000*60*60*24)) //scd_date is a date not date time nowd will be after scd_date as it also has hours
																//todo handle the hours correctly as time zone is applied each time
		sails.log("nowd: "+nowd);
        Schedules.find().where({scd_date:{'>=':first_date,'<=':dates[2]}}).exec(function foundScheds(err,scheds){
                sails.log("queried the Schedules table schesd : "+scheds);
				//we need to pad the sched for each schedule
			Rota.find({sort:'rot_order'}).exec(function foundRotas(err,rotas){
			
				var rota_arr=[];
				rotas.forEach(function(rot){
					rota_arr.push(rot); // thi swill be used in an ng-orderBy
				});
				User.find().exec(function users(err,users){
					var user_hash={};
					sails.log("users: "+users);
					users.forEach(function(muser){
						//assume it's okay for public to have emails
						user_hash[muser.username]=muser;
					})
					res.status(200);
				//how do we send back the aarrays via keys!!!?//
					sails.log("DEBUG dates: "+dates);
					sails.log("DEBUG rota_arr: "+rota_arr);
					res.json({rotas:rota_arr,scheds:scheds,mdates:dates,users:user_hash,iscardhost:sails.config.cardhosts.indexOf(req.ip)});
					//res.json({rotas:rota_arr,scheds:scheds,mdates:dates,users:user_hash});
				})
			});
		});
	},
	
	icaloutput: function(req,res,next){
		var nowd = new Date();
		var fdate=(new Date(nowd.getTime()-1000*60*60*24)) 
		var cal="BEGIN:VCALENDAR\r\n";
		cal+="VERSION:2.0\r\n"
		cal+="PRODID:-//hacksw/handcal//NONSGML v1.0//EN\r\n";
		cal+="X-WR-CALNAME:All Rotas\r\n";
		cal+="X-PUBLISHED-TTL:PT1H\r\n";
		var row=0
		Schedules.find().where({ scd_date: { '>': fdate} }).sort('scd_date ASC').exec(function(err,data){
			//sails.log("found some swaps: "+data);
			data.forEach(function gen_cal(ev){
				//sails.log("have row");
				cal+="BEGIN:VEVENT\r\n";
				cal+="UID:wq-AF23B2"+row+"@eng.cam\r\n";
				cal+="DTSTAMP:"+ev.scd_date.getFullYear()+("0" + (ev.scd_date.getMonth() + 1)).slice(-2)+("0" + ev.scd_date.getDate()).slice(-2)+"T000000Z\r\n";
				cal+="DTSTART:"+ev.scd_date.getFullYear()+("0" + (ev.scd_date.getMonth() + 1)).slice(-2)+("0" + ev.scd_date.getDate()).slice(-2)+"T"+ev.scd_start+"Z\r\n";
				cal+="DTEND:"+ev.scd_date.getFullYear()+("0" + (ev.scd_date.getMonth() + 1)).slice(-2)+("0" + ev.scd_date.getDate()).slice(-2)+"T"+ev.scd_finish+"Z\r\n";
				cal+="SUMMARY:"+ev.scd_user_username+" "+ev.scd_rota_code+"\r\n";
				cal+="END:VEVENT\r\n";
				row++;
			})
			
			res.status(200);
			cal+="END:VCALENDAR\r\n"
			res.send(cal);
			//res.send("your ical: ");
			//res.json(data);
		});
	},
	icaloutput_code: function(req,res,next){
	
		var code = req.param('code');
	
		var nowd = new Date();
		var fdate=(new Date(nowd.getTime()-1000*60*60*24)) 
		var cal="BEGIN:VCALENDAR\r\n";
		cal+="VERSION:2.0\r\n"
		cal+="PRODID:-//hacksw/handcal//NONSGML v1.0//EN\r\n";
		cal+="X-WR-CALNAME:"+code+" Rota\r\n";
		cal+="X-PUBLISHED-TTL:PT1H\r\n";
		//cal+="X-WR-TIMEZONE:Europe/London\r\n";
		var row=0
		Schedules.find().where({ scd_date: { '>': fdate}, scd_rota_code : code }).sort('scd_date ASC').exec(function(err,data){
			//sails.log("found some swaps: "+data);
			data.forEach(function gen_cal(ev){
				//sails.log("have row");
				var utcdate=new Date(ev.scd_date.getTime())
				cal+="BEGIN:VEVENT\r\n";
				cal+="UID:wq"+code+"-"+row+"@eng.cam\r\n";
				//cal+="DTSTAMP:"+ev.scd_date.getFullYear()+("0" + (ev.scd_date.getMonth() + 1)).slice(-2)+("0" + ev.scd_date.getDate()).slice(-2)+"T000000Z\r\n";
				cal+="DTSTART;Europe/London:"+ev.scd_date.getFullYear()+("0" + (ev.scd_date.getMonth() + 1)).slice(-2)+("0" + ev.scd_date.getDate()).slice(-2)+"T"+ev.scd_start+"\r\n";
				cal+="DTEND;Europe/London:"+ev.scd_date.getFullYear()+("0" + (ev.scd_date.getMonth() + 1)).slice(-2)+("0" + ev.scd_date.getDate()).slice(-2)+"T"+ev.scd_finish+"\r\n";
				cal+="SUMMARY:"+ev.scd_user_username+"\r\n";
				cal+="END:VEVENT\r\n";
				row++;
			})
			
			res.status(200);
			cal+="END:VCALENDAR\r\n"
			res.send(cal);
			//res.send("your ical: ");
			//res.json(data);
		});
	},
	
	//swapfor - list the valid swaps for this user same rota different user day not yet passed
	swapfor: function(req,res,next){
		sails.log("ran the find for schedukes to swap");
		sails.log("ran the find for schedukes to swap "+req.param('user')+"  --  "+req.param('rota'));
		//TODO put back in the != username clause
		var nowd = new Date();
		var yestd = new Date(nowd.getTime()-1000*60*60*24);
		Schedules.find().where({scd_date: { '>': nowd}, scd_user_username: { '!': req.param('user')}, scd_rota_code: req.param('rota'), scd_status: {'!': 'requested'}  }).sort('scd_date ASC').exec(function(err,data){
			//sails.log("found some swaps: "+data);
			res.status(200);
			res.json(data);
		});
	},
	
	update_manager: function(req,res,next){
		SwapActionsService.update(req,res,next);
	},
	
    update: function(req,res,next){
		SwapActionsService.update(req,res,next);
	},
	
    requestswap: function(req,res,next){
		SwapActionsService.requestSwap(req,res,next);
	},
	
	declineswap_manager: function(req,res,next){
		SwapActionsService.declineSwap(req,res,next);
	},
	
	declineswap: function(req,res,next){
		//we have been provided a schedule id which contains details of a swap request the user will decline (only one swap request at a time can happen
		//therefore the status will go back to accepted
		SwapActionsService.declineSwap(req,res,next);
	},
	
	acceptswap_manager: function(req,res,next){
		SwapActionsService.acceptSwap(req,res,next);
	},
	
	acceptswap: function(req,res,next){
		SwapActionsService.acceptSwap(req,res,next);
	},
	
    offerup: function(req,res,next){
		SwapActionsService.offerup(req,res,next);
	},
    grab: function(req,res,next){
		SwapActionsService.grab(req,res,next);
	},
	
	del_manager: function(req,res,next){
		SwapActionsService.del(req,res,next);
	},
	
    del: function(req,res,next){
		SwapActionsService.del(req,res,next);
	},
};

