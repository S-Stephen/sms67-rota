# Controller tests

These tests check the success / failure of the Controller endpoints

## Logging in 

__Bearer__ authorization has been activated for the test environment.  

Two level of access are available (loaded via the passport elements in fixtures/travis.json):

* 'Bearer goldenticket' - mapped to a user with management privileges
* 'Bearer silverticket' - mapped to a user with regular privileges

to log in as a regular user we use:

```{r}
  agent
        .get('/auth/bearer')
        .set('authorization','Bearer silverticket')
        .redirects(1)
        .expect(200)
        .end(function(err,res){
            //next stage of process goes here
        })
```

## Test data

Test data is loaded from fixtures/travis.json

__Three__ fake users are created

* 'fake1' - is amanger
* 'fake2' 
* 'fake3'

Use these users when manipulating records

## List of tests:

### ManageUser.test.js
* Manager can create a user non-manager cannot
* Manager can edit a user non-manager cannot

### ManageRota.test.js 
* Manager can create a rota non-manager cannot
    + rota requires all fields: code, description [todo: start, end ]
* Manager can edit a rota non-manager cannot

### ManageSession.test.js
* Manager can add individual sessions to a rota non-manager cannot
* Manager can remove individual sessions to a rota non-manager cannot
* \*Manager can create a repeating shifting pattern in a rota non-manager cannot
* Manager can remove a period of sessions from a rota non-manager cannot
* Manager can replace a users on all rotas between two dates a non-manager cannot
* Manager can assign a sesion to another user
* Manager can swap a session with another
* Manager can action swap request (by selecting either requested or requester)
* Manager can decline swap request (by selecting either requested or requester)

### ManageReport.test.js
* Manager can display / get the sessions for all rotas for a particular month
* Manager can run a report to display all sessions on all rotas between a period (can download)

### UserReport.test.js
* Non-manager can run a report to display all their sesisons on all rotas between a period (can download)

### UserSession.test.js
* User can offer up own session, user cannot offer up someone elses session
* User can request to swap session with a user
* User can accept or decline requested swap
* User can not retract their request to swap

### Not covered by integrations

* When sessions have been created / updated the informatiom is pushed through to the summary pages (using ws, without refreshing pages)

\* not suitable for to test via controller at the moment
