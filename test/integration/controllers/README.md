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

* Manager can create a user non-manager cannot
* Manager can edit a user non-manager cannot
* Manager can create a rota non-manager cannot
  + rota requires all fields: code, description [todo: start, end ]
* Manager can edit a rota non-manager cannot
* Manager can add individual sessions to a rota non-manager cannot
* Manager can remove individual sesisons to a rota non-manager cannot
* Manager can create a repeating shifting pattern in a rota non-manager cannot
* Manager can remove a period of sessions from a rota non-manager cannot
* Manager can replace a users on all rotas between two dates a non-manager cannot
* Manager can display / get the sessions for all rotas for a particular month
* Manager can run a report to display all sessions on all rotas between a period (can download)
* Non-manager can run a report to display all their sesisons on all rotas between a period (can download)

