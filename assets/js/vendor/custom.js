$(document).ready(function() {
    $('.custom').append("<h1>Yes Irl, javascript is here and if I'm red css is working as well.</h1>");
    $('.custom').addClass('working');
});

// Define some librray function that we do not want to re-implement
// See http://stackoverflow.com/questions/19841956/can-angularjs-reuse-a-service-across-several-ng-apps
angular.module('myReuseableMod', []).factory('handleMySocketsSrvc', function($rootScope) {
    // code here
	
	return function(io){
	//	console.log("myReusableSrvc says hello!")
		
		
	if (!io.socket.alreadyListeningToOrders){
		io.socket.alreadyListeningToOrders = true;
		io.socket.on('schedule', function onServerSentEvent(msg){
			switch(msg.verb){
				case 'removed':
					var ele = msg.ele;
					ele.scd_date = new Date(ele.scd_date);
					//remove this ele from our allrotas array:
					var index=-1
					var myind=0
					$rootScope.allrotas[ele.scd_rota_code][ele.scd_date.toDateString()].forEach(function(scd){
						if (scd.id == ele.id){
							index = myind;
						}
						myind++;
					});
					if (index>-1){
						$rootScope.allrotas[ele.scd_rota_code][ele.scd_date.toDateString()].splice(index,1);
					}
					$rootScope.$apply(); // this forecs our page to refresh after these changes
					break;
				case 'created':
					//add the schedule to our allrotas array
					var ele = msg.ele;
					ele.scd_date=new Date(ele.scd_date);
					ele.scd_date.setHours(12);
					v = $rootScope.allrotas[ele.scd_rota_code];
					if (v === undefined){
						$rootScope.allrotas[ele.scd_rota_code]={}; //TODO SummaryModule - ignore as it is not a day we will deliver
					}
					w = $rootScope.allrotas[ele.scd_rota_code][ele.scd_date.toDateString()];
					if (w === undefined){
						$rootScope.allrotas[ele.scd_rota_code][ele.scd_date.toDateString()]=[]; //TODO SummaryModule - ignore as it is not a day we will deliver
					}
					$rootScope.allrotas[ele.scd_rota_code][ele.scd_date.toDateString()].push(ele)
					//if I am the person assigned to the session add to my list
					
					$rootScope.$apply(); // this forecs our page to refresh after these changes
					break;
				case 'update':
					//RULE 1: WE never change the date of a session only user and status!
				
				
					//find the schedule in our allrotas array
					//re-displaying the allrotas array only semes to work for the actioning browser?!
					var ele = msg.ele;
					ele.scd_date=new Date(ele.scd_date);
					ele.scd_date.setHours(12);
					if (ele.scd_date.scd_request_by) { ele.scd_date.scd_request_by.scd_date=new Date(ele.scd_date.scd_request_by.scd_date); }
					if (ele.scd_date.scd_request_to){ele.scd_date.scd_request_to.scd_date=new Date(ele.scd_date.scd_request_to.scd_date);}
					var index=0;
					$rootScope.allrotas[ele.scd_rota_code][ele.scd_date.toDateString()].forEach(function(myele){
						if ( myele.id == ele.id )
						{	
							$rootScope.allrotas[ele.scd_rota_code][ele.scd_date.toDateString()][index]=ele;			
						}
						index++;
					})
					
					//For clients who are logged in requests for swap need to be updated (whether requester or requestee)
					//Update our rota if it is our session (NB it might have changed to our session in which case we muct add it! (and removed the old one)
					if (mysched && ele.scd_user_username == mysched.me){
						//end to remove
						//if update status is to requested then we need to ad dthis to our myrequests hash
						if (ele.scd_status=='requested'){
							$rootScope.requeststo[ele.id]=ele;
						}
						if (ele.scd_status=='requestto'){
							$rootScope.myrequests[ele.id]=ele;
						}
					}
					
					//For the users view (displayng their swap requests)
					if ($rootScope.myrequests){ // TODO  - check does this successfully test for empty myrequests array 
						//assume the update was not to add them into the pending lists
						//Why not working (remove from the pendinglist after update!
						//console.log(" the ele.id: "+ele.id);
						if (ele.scd_status=='accepted' && $rootScope.myrequests[ele.id]){
							//console.log("removed from myrequests");
							delete $rootScope.myrequests[ele.id];
						}
						if (ele.scd_status=='accepted' && $rootScope.requeststo[ele.id]){
							//console.log("removed from requeststo");
							delete $rootScope.requeststo[ele.id];
						}
					}
					
					$rootScope.$apply(); // this forecs our page to refresh after these changes
					break;
				case 'grabbed':
					//find the schedule in our allrotas array
					//re-displaying the allrotas array only semes to work for the actioning browser?!
					var ele = msg.ele;
					var olduser = (msg.givenupby == mysched.me)? 1 : 0 ;
					console.log(msg);
					//eledate=new Date(ele.scd_date);
					ele.scd_date=new Date(ele.scd_date);
					ele.scd_date.setHours(12);
					if (ele.scd_date.scd_request_by) { ele.scd_date.scd_request_by.scd_date=new Date(ele.scd_date.scd_request_by.scd_date); }
					if (ele.scd_date.scd_request_to){ele.scd_date.scd_request_to.scd_date=new Date(ele.scd_date.scd_request_to.scd_date);}
					var index=0;
					$rootScope.allrotas[ele.scd_rota_code][ele.scd_date.toDateString()].forEach(function(myele){
						if ( myele.id == ele.id )
						{	
							$rootScope.allrotas[ele.scd_rota_code][ele.scd_date.toDateString()][index]=ele;			
						}
						index++;
					})
					
					$rootScope.$apply(); // this forecs our page to refresh after these changes
					//console.log("end of update for "+ele.id);
					break;
				case 'sessionswapped':
				
					//what we need to do is update the sesison if we have it! ie test the dates!
				
					var ele1 = msg.theirs;
					ele1date=new Date(ele1.scd_date);
					ele1.scd_date=ele1date;
					ele1.scd_date.setHours(12);
					var ele2 = msg.mine;
					ele2date=new Date(ele2.scd_date);
					ele2.scd_date=ele2date;
					ele2.scd_date.setHours(12);
					var index=0;
					//updates the main schedule (everyone)
					$rootScope.allrotas[ele1.scd_rota_code][ele1date.toDateString()].forEach(function(myele){
						//the username and status has changed!!
						if ( myele.id == ele1.id ){	
							//console.log("replaced ele1");
							$rootScope.allrotas[ele1.scd_rota_code][ele1date.toDateString()][index]=ele1;			
						}
						index++;
					})
					index=0;
					$rootScope.allrotas[ele2.scd_rota_code][ele2date.toDateString()].forEach(function(myele){
						if ( myele.id == ele2.id ){	
							//console.log("replaced ele2");
							$rootScope.allrotas[ele2.scd_rota_code][ele2date.toDateString()][index]=ele2;			
						}
						index++;
					})
					
					//strangely otherstuff holds the users rota:
					//in this situtaion we have just swapped a session
					//we need to add /remove from our schedule if we are involved
					var involved=0;
					if(ele1.scd_user_username == mysched.me){
					
						involved=1;
						
						//removed the requestto
						if ($rootScope.myrequests[ele2.id]){
							//console.log("ele2 removed myrequests")
							delete $rootScope.myrequests[ele2.id];
						}
						if ($rootScope.requeststo[ele2.id]){
							//console.log("ele2 removed requeststo")
							delete $rootScope.requeststo[ele2.id];
						}
						
					}
					if(ele2.scd_user_username == mysched.me){

						involved=2;
						//removed the requestto
						if ($rootScope.myrequests[ele1.id]){
							//console.log("ele1 removed myrequests")
							delete $rootScope.myrequests[ele1.id];
						}
						if ($rootScope.requeststo[ele1.id]){
							//console.log("ele1 removed requeststo")
							delete $rootScope.requeststo[ele1.id];
						}
					}
					 
					 
					$rootScope.$apply(); // this forecs our page to refresh after these changes
					//console.log("end of accepted swap update for "+ele1.id);
					
					//if I am the person assigned to the session add to my list
					
					break;
					
				default: return;
			}
		});
	}
		
		
	}
	
});
