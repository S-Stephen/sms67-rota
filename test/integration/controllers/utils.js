module.exports ={

    //function recurses until number of records loaded
    loadnextsession: function(error,record,last){
        if (error){
            sails.log.debug("Error counting sessions for fake1"); 
            return last(error) 
        }
        numrecs=numrecs-1;
        sails.log.debug("records: "+JSON.stringify(record));
        sails.log.debug("numrecs: "+numrecs);
        if (!numrecs){;
            sails.log.debug("numrecs not defined: ");
            return last("Did you forget to set numrecs, the number of sessions required?")
        }
        if (numrecs > 0){
            sails.log.debug("in date: "+record.scd_date.getTime())
            mdate = new Date(record.scd_date.getTime()+24*60*60*1000)
            sails.log.debug("next date: "+mdate)
            Schedules.create({scd_rota_code:'HOA',scd_user_username:'fake1',scd_date:mdate}).exec(function (err,rec) {sails.log.debug("entered: "+rec); module.exports.loadnextsession(err,rec,last) })
        }else{
            sails.log.debug("all done: "+JSON.stringify(record));
            return last()
        }
    },

    loginmanager: function(agent,next){
        var mreq = agent
        .get('/auth/bearer')
        .set('authorization','Bearer goldenticket')
        .redirects(1)
        .expect(200)
        .end(function(err,res){ if (err){return next(err) }
            next() 
        })
    },

    loginnonmanager: function(agent,next){
        var mreq = agent
        .get('/auth/bearer')
        .set('authorization','Bearer silverticket')
        .redirects(1)
        .expect(200)
        .end(function(err,res){ if (err){return next(err) }
            next() 
        })
    },

    post: function(agent,url,payload,next){    
        agent
        .post(url)
        .send(payload)
        .expect(403)
        .end(function(err,res){ if (err){  return next(err);}
            next(err,res)
        })
    },

    put: function(agent,url,payload,expect,next){  
        agent
        .put(url)
        .send(payload)
        .expect(expect)
        .end(function(err,res){ if (err){  return next(err);}
            next(err,res)
        })
    },

    get: function(agent,url,expect,next){  
        agent
        .get(url)
        .expect(expect)
        .end(function(err,res){ if (err){  return next(err);}
            next(err,res)
        })
    }

}