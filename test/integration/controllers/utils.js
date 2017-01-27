module.exports ={

    //function recurses until number of records loaded
    // TODO replace this by passing an array of sessions to the create statement
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
        .set('authorization','Bearer silverticket') //test0002 see fixtures: passport
        .redirects(1)
        .expect(200)
        .end(function(err,res){ if (err){return next(err) }
            next() 
        })
    },

    loginnonmanager2: function(agent,next){
        var mreq = agent
        .get('/auth/bearer')
        .set('authorization','Bearer bronzeticket') //test0003 see fixtures: passport
        .redirects(1)
        .expect(200)
        .end(function(err,res){ if (err){return next(err) }
            next() 
        })
    },

    post: function(agent,url,payload,expect,next){    
        agent
        .post(url)
        .send(payload)
        .expect(expect)
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
    },

    addmonths: function(date,num){
        //returns a new date by incrementing the month
        newdate = new Date(date)
        newdate.setMonth(newdate.getMonth()+num)
        return newdate
    },

    adddays: function(date,num){
        //returns a new date by incrementing the month
        newdate = new Date(date)
        newdate.setDate(newdate.getDate()+num)
        return newdate
    }

}