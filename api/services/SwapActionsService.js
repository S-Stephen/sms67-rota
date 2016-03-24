
module.exports ={
	
	del: function(req,res,next){
		var okay = 0;
		if (  req.user.manager){
			//console.log("we are the manager or we are the user");
			okay =1;
		}
		if (!okay){
			res.status(403);
			return;
		}
		var params = req.params.all();
		sails.log("remove session id: "+req.param('scd_id'));
		Schedules.findOne({id:req.param('scd_id')}).exec(function(err,myscd){
				
			if (err) return next(err);
			
			//if we ar epart of a request to swap then we need to undo the request
			//console.log("TODO place in a transaction");
			//todo ho wdo we put this in a transaction?
			
			if (myscd.scd_request_to){
				sails.log("updating the request_to object : "+myscd.scd_request_to);
				Schedules.update(myscd.scd_request_to, {scd_status:'accepted'}, function(err, mine1){
					if (err) return next(err);
					//res.status(201);
					sails.sockets.blast('schedule',{verb:'update',ele:mine1[0]});
					//res.json(mine);
			
				});		
			}
			if  (myscd.scd_request_by){
				sails.log("updating the request_by object "+myscd.scd_request_by);
				Schedules.update(myscd.scd_request_by, {scd_status:'accepted'}, function(err, mine2){
					if (err) return next(err);
					//res.status(201);
					sails.sockets.blast('schedule',{verb:'update',ele:mine2[0]});
					//res.json(mine);
			
				});		
			}
			
			sails.log("totd test that the object actualy exists");
			Schedules.destroy({id:req.param('scd_id')}).exec(function(err){
			
				sails.log("remove session id: "+req.param('scd_id'));
				if (err) return next(err);
				res.status(201);
				sails.sockets.blast('schedule',{verb:'removed',ele:myscd});
				res.json(params);
				
			});
		});
	},
	
    grab: function(req,res,next){
		
	
		//protect by auth user && session grabable
		var params = req.params.all();
		var okay = 0;
		if ( ( req.user.username || req.user.manager ) && params.theirs.scd_status=='offerup'){
			sails.log("we are the manager or we are the user");
			okay =1;
		}
		if (!okay){
			res.status(403);
			return;
		}
	
		//TODO test we are allowed to grab -> user logged in as  && of, status of session
		
		//the params represent the schedule to change - generally this will be the assignment of another user?
		//but we need to pass the user's schedule to swap
		
		sails.log("grab session: "+params.theirs.id);
		
		//who is the current user?????
		
		sails.log("TODO check user can grab session (are they on the system?) - user passport object query?");
		
		//set the status for our schedule to requested
		var givenupby=params.theirs.scd_user_username; //so we can remove it from the otherstuff array
		params.theirs.scd_status='accepted';
		params.theirs.scd_user_username=req.user.username;
		
		params.theirs.scd_date=new Date(params.theirs.scd_date);
		var message = req.user.username+" has just taken the session: "+params.theirs.scd_rota_code+" on "+params.theirs.scd_date.toDateString();
		//set the status to their schedule to requested and requested_by to our id
		//params.theirs.scd_status='requested';
		//params.theirs.scd_request_by=params.mine.id;
		
		Schedules.update(params.theirs.id, params.theirs, function(err, mine){
			if (err) return next(err);
				res.status(201);
				sails.sockets.blast('schedule',{verb:'grabbed',ele:mine[0],givenupby:givenupby});
				res.json(mine);
				
				//we also want to broadcast this to others?
			
		});		
		var nodemailer = require('nodemailer');
		var transporter = nodemailer.createTransport(); //uses local transport:
		transporter.sendMail({
				from: sails.config.emailfrom, //'sms67@eng.cam.ac.uk',
				to: 'sms67@eng.cam.ac.uk',
				subject:  "SR "+params.theirs.scd_rota_code+" "+params.theirs.scd_date.toDateString()+" Session taken",
				text: message
		});
	},
	update: function(req,res,next){	
		var params = req.params.all(); //all gets body and 
		
		// HELP I tried to set the params before calling this func in ScheduleController update_manager_bulk but not working
		if (req.body.scd_user_username){params.scd_user_username = req.body.scd_user_username}
		if (req.body.id){params.id = req.body.id}
		
		//we must be the mine user or manager to decline a swap
		var okay = 0;
		if ( req.user.username == params.scd_user_username || req.user.manager ){
			//console.log("we are the manager or we are the user");
			okay =1;
		}
		if (!okay){
			if (!res.headersSent) { res.status(403); } // we migh tneed to avoid sending thi sif the headers have already been sent by a bulk update
			return;
		}
	
		//console.log("the schedule we are updating: "+params.id+" or "+req.body.id+" username:"+params.scd_user_username)
		
		var id = params.id
		delete params['id'] //passing the id seems to attempt to update the id to itself ->not allowed as it already exists
		Schedules.update(id, params, function(err, data){
			if (err) return next(err);
		
			sails.sockets.blast('schedule',{verb:'update',ele:data[0]});
			if (!res.headersSent) { res.status(201);res.json(data); }
			
		});
		
	},
		
    offerup: function(req,res,next){
		//me is mine!
		var params = req.params.all();
		//the params represent the schedule to change - generally this will be the assignment of another user?
		//but we need to pass the user's schedule to swap
		var okay = 0;
		if ( req.user.username == params.mine.scd_user_username || req.user.manager){
			//console.log("we are the manager or we are the user");
			okay =1;
		}
		if (!okay){
			res.status(403);
			return;
		}
		sails.log("giving up session: "+params.mine.id);
		
		//set the status for our schedule to requested
		params.mine.scd_status='offerup';
		//set the status to their schedule to requested and requested_by to our id
		//params.theirs.scd_status='requested';
		//params.theirs.scd_request_by=params.mine.id;
		params.mine.scd_date=new Date(params.mine.scd_date);
		var message = params.mine.scd_user_username+" has given up the session: "+params.mine.scd_rota_code+" on "+params.mine.scd_date.toDateString();
		
		Schedules.update(params.mine.id, params.mine, function(err, mine){
			if (err) return next(err);
				res.status(201);
				sails.sockets.blast('schedule',{verb:'update',ele:mine[0]});
				res.json(mine);
			
		});		//a request has been made to swap sesisons email:
		var nodemailer = require('nodemailer');
		var transporter = nodemailer.createTransport(); //uses local transport:
		transporter.sendMail({
				from: sails.config.emailfrom, //'sms67@eng.cam.ac.uk',
				to: 'sms67@eng.cam.ac.uk',
				subject: "SR "+params.mine.scd_rota_code+" "+params.mine.scd_date.toDateString()+" Session given up",
				text: message
		});
	},	
    requestSwap: function(req,res,next){
		var params = req.params.all();
		//the params represent the schedule to change - generally this will be the assignment of another user?
		//but we need to pass the user's schedule to swap
		var okay = 0;
		if ( req.user.username == params.mine.scd_user_username || req.user.manager){
			//console.log("we are the manager or we are the user");
			okay =1;
		}
		if (!okay){
			res.status(403);
			return;
		}
		sails.log("swapping schedule: "+params.mine.id+"  "+params.theirs.id);
		
		sails.log("ONLY swap if the statuses or both are not requested and requestto!! does this work?:");
		
		if (params.mine.scd_status!='requested' && params.mine.scd_status!='requestto' && params.theirs.scd_status!='requested' && params.theirs.scd_status!='requestto'){ 
		
		var minedate = new Date(params.mine.scd_date);
		var theirdate = new Date(params.theirs.scd_date);
		var message=params.mine.scd_user_username+" would like to swap "+params.mine.scd_rota_code+"  "+minedate.toDateString()+" with "+theirdate.toDateString()+"  ("+params.theirs.scd_user_username+") ";
		
		//set the status for our schedule to requested
		params.mine.scd_status='requested';
		params.mine.scd_request_to=params.theirs.id;
		//set the status to their schedule to requested and requested_by to our id
		params.theirs.scd_status='requestto';
		params.theirs.scd_request_by=params.mine.id;
		
		Schedules.update(params.mine.id, params.mine, function(err, mine){
			if (err) return next(err);
			Schedules.update(params.theirs.id, params.theirs, function(err1, theirs){
				res.status(201);
				var tmpid = theirs[0].id;
				var theirs_out =undefined;
				var mine_out =undefined;
				Schedules.find({id:theirs[0].id}).populate('scd_request_by').exec(function(err,rowres1){
					theirs_out=rowres1[0];
					theirs_out.scd_request_by.scd_date = new Date(theirs_out.scd_request_by.scd_date);
					Schedules.find({id:mine[0].id}).populate('scd_request_to').exec(function(err,rowres2){
						mine_out=rowres2[0];
						mine_out.scd_request_to.scd_date = new Date(mine_out.scd_request_to.scd_date);
						sails.sockets.blast('schedule',{verb:'update',ele:theirs_out});
						sails.sockets.blast('schedule',{verb:'update',ele:mine_out});
				
						res.json([mine_out,theirs_out]);
					});
				});
				//sails.log("their schedule: "+JSON.stringify(theirs));
				//sails.log("their schedule: "+theirs[0].scd_user_username);
				//sails.log("their schedule: "+tmpid);
				
			});
		});
		
		
		//a request has been made to swap sesisons email:
		var nodemailer = require('nodemailer');
		var transporter = nodemailer.createTransport(); //uses local transport:
		transporter.sendMail({
				from: sails.config.emailfrom, //'sms67@eng.cam.ac.uk',
				to: 'stephen.shorrock@gmail.com',
				cc: ['sms67@eng.cam.ac.uk','sms67@cam.ac.uk'],
				subject: "SR - "+params.mine.scd_rota_code+" "+minedate.toDateString()+" - "+theirdate.toDateString(),
				text: "There has been a request to swap a session: \n\n"+message
		});
		
		}else{
			res.status(403);
			res.json({error:"invalid privileges"});
		}
	},
	
	
	acceptSwap: function(req,res,next){
	
		//we have been provided a schedule id which contains details of a swap request the user will decline (only one swap request at a time can happen
		//therefore the status will go back to accepted
		
		var params = req.params.all();
		//console.log("DEBUG TODO check auths that I own can update 'mine'");
		//console.log("DEBUG TODO should we chnage dates or user?");
		
		//we must be the mine user or manager to decline a swap
		var okay = 0;
		if ( req.user.username == params.mine.scd_user_username || req.user.manager ){
			//console.log("we are the manager or we are the user");
			okay =1;
		}
		if (!okay){
			res.status(403);
			return;
		}
		
		//params.message; // not used at the moment but we shoul dput in th eemail and record in database
		
		var minedate = new Date(params.mine.scd_date);
		var theirdate = new Date(params.theirs.scd_date);
		var message="Swap accepted\n\nThe request by "+params.mine.scd_user_username+" to swap "+params.mine.scd_rota_code+"  "+minedate.toDateString()+" with "+theirdate.toDateString()+"  ("+params.theirs.scd_user_username+") has been ACCEPTED";
		
		params.mine.scd_status='accepted';
		params.mine.scd_request_by=undefined;
		params.mine.scd_request_to=undefined;
		var username = params.mine.scd_user_username;
		params.mine.scd_user_username=params.theirs.scd_user_username;
		//set the status to their schedule to requested and requested_by to our id
		params.theirs.scd_status='accepted';
		params.theirs.scd_request_to=undefined;
		params.theirs.scd_request_by=undefined;
		params.theirs.scd_user_username=username;
		
		Schedules.update(params.mine.id, params.mine, function(err, mine){
			if (err) return next(err);
			
			Schedules.update(params.theirs.id, params.theirs, function(err1, theirs){
				res.status(201);
				var tmpid = theirs[0].id;
				sails.log("their schedule: "+JSON.stringify(theirs));
				sails.log("their schedule: "+theirs[0].scd_user_username);
				sails.log("their schedule: "+tmpid);
				sails.sockets.blast('schedule',{verb:'sessionswapped',theirs:theirs[0],mine:mine[0]});
//				sails.sockets.blast('schedule',{verb:'sessionswapped',ele:mine[0]});
				res.json([mine[0],theirs[0]]);
			});
			
		});		//a request has been made to swap sesisons email:
		var nodemailer = require('nodemailer');
		var transporter = nodemailer.createTransport(); //uses local transport:
		transporter.sendMail({
				from: sails.config.emailfrom, //'sms67@eng.cam.ac.uk',
				to: 'sms67@eng.cam.ac.uk',
				subject: "SR - "+params.mine.scd_rota_code+" "+minedate.toDateString()+" - "+theirdate.toDateString()+" accepted",
				text: message
		});
	},
	
	
	declineSwap: function(req,res,next){
	
		var params = req.params.all();
		//console.log("DEBUG TODO check auths that I own can update 'mine'");
		//params.message; // not used at the moment but we shoul dput in th eemail and record in database
	
		//we must be the mine user or manager to decline a swap
		var okay = 0;
		if ( req.user.username == params.mine.scd_user_username || req.user.manager ){
			//console.log("we are the manager or we are the user");
			okay =1;
		}
		if (!okay){
			res.status(403);
			return;
		}

	
		var minedate = new Date(params.mine.scd_date);
		var theirdate = new Date(params.theirs.scd_date);
		var message="Swap declined\n\nThe request by "+params.mine.scd_user_username+" to swap "+params.mine.scd_rota_code+"  "+minedate.toDateString()+" with "+theirdate.toDateString()+"  ("+params.theirs.scd_user_username+") has been DECLINED";
	
		params.mine.scd_status='accepted';
		params.mine.scd_request_by=undefined;
		//set the status to their schedule to requested and requested_by to our id
		params.theirs.scd_status='accepted';
		params.theirs.scd_request_to=undefined;
	
		Schedules.update(params.mine.id, params.mine, function(err, mine){
			if (err) return next(err);
		
			Schedules.update(params.theirs.id, params.theirs, function(err1, theirs){
				res.status(201);
				var tmpid = theirs[0].id;
				sails.log("their schedule: "+JSON.stringify(theirs));
				sails.log("their schedule: "+theirs[0].scd_user_username);
				sails.log("their schedule: "+tmpid);
				sails.sockets.blast('schedule',{verb:'update',ele:theirs[0]});
				sails.sockets.blast('schedule',{verb:'update',ele:mine[0]});
				res.json([mine[0],theirs[0]]);
			});
		});
		//a request has been made to swap sesisons email:
		var nodemailer = require('nodemailer');
		var transporter = nodemailer.createTransport(); //uses local transport:
		transporter.sendMail({
				from: sails.config.emailfrom, //'sms67@eng.cam.ac.uk',
				to: 'sms67@eng.cam.ac.uk',
				subject: "SR - "+params.mine.scd_rota_code+" "+minedate.toDateString()+" - "+theirdate.toDateString()+" rejected",
				text: message
		});
		
	}
}