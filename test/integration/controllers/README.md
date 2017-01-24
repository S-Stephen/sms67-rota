# Controller tests

These tests check the success / failure of the Controller endpoints

## Logging in 

__Bearer__ authorization has been activated for the test environment.  

Two level of access are available:

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

