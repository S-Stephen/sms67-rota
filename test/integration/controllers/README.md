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