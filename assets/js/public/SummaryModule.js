
(function(){  

  //change otherstuff from an array to a hash - >rename myschedule
  //change otherstuff from an array to a hash - >rename myschedule

  var app = angular.module('SummaryModule',['ui.bootstrap']);

  app.filter('easydate', function () {
   return function (indate) {
	 var tmpdate = new Date(indate);
     return tmpdate.toDateString();
   };
  });

  // get the summary list and wait for data re changes
  app.controller('SummaryController', ['$scope','$rootScope','$http','$log', function ($scope,$rootScope,$http,$log) {
	$scope.init = function(days){
		$scope.days = days;
		$scope.pop_summary();
	}
	 //populate the lists from our API
	$scope.rotas=[];
	$rootScope.allrotas=[];
	$scope.pop_summary = function (){
	
		$http.get('/public/summary/'+$scope.days).success(function(data){	
		$scope.rotas=data.rotas; //rots is sending back an array but we are not getting it nor the date objects!!
		$rootScope.rotas=data.rotas;
		
		$scope.users=data.users;
		$rootScope.users=data.users;
		
		//used to set the required field on our submit form
		$scope.iscardhost=(data.iscardhost < 0)? "" : "true";
		$rootScope.iscardhost=(data.iscardhost < 0)? "" : "true";
		
		console.log("users: "+data.users);
		//$scope.users.forEach(function(usr){
		//	console.log("users: -"+usr.display_name+"-   -");
		//});
		for (var usr in $rootScope.users){
			console.log("Users:  "+usr.username);
		}
		console.log("rotas: "+data.rotas);
		
		console.log("rotas: "+$rootScope.rotas);
		//for debug what is our rotas array like>
		for (var rot in $rootScope.rotas){
			console.log("ERRORORORORO we are getting sent back and array but are not inflating it!rota: "+rot);
		}
		
		//$scope.rotas.forEach(function(rot){
		//	console.log("setup array for: -"+rot.rot_code+"-   -");
		//});
		
		$scope.scheds=data.scheds;
		console.log("scheds: "+$scope.scheds);
		$scope.adates=data.mdates;
		console.log("dates: "+$scope.adates);
		//for all the rotas and dates setup the allrotas arrays:
		var i=0;
		$scope.adates.forEach(function(idate){
			var mdate=new Date(idate);
			//$scope.adates[i]=mdate; // update the dates array to be objects rather than the textual representation
			$scope.adates[i]=new Date(idate); // update the dates array to be objects rather than the textual representation
			$scope.adates[i].setHours(12,0,0,0);
			mdate=mdate.toDateString();
			$scope.rotas.forEach(function(rot){
				//console.log("setup array for: -"+rot.rot_code+"-   -"+mdate);
				//$rootScope.allrotas[rot.rot_code]={mdate:[]};
				$rootScope.allrotas[rot.rot_code]=[];
				$rootScope.allrotas[rot.rot_code][mdate]=[];
				
			});
			i++;
		});
		$rootScope.adates=$scope.adates;
		
		
		$scope.scheds=($scope.scheds)? $scope.scheds : [] ;
		console.log("scheds: "+$scope.scheds);
		$scope.scheds.forEach(function(ele){
			console.log("setup the scheds");
			eledate=new Date(ele.scd_date);
			eledate.setHours(12,0,0,0);
			console.log("push for -"+ele.scd_rota_code+"-  -"+eledate.toDateString()+"- ele: "+ele);
			v = $rootScope.allrotas[ele.scd_rota_code];
			if (v===undefined){
				$rootScope.allrotas[ele.scd_rota_code]=[];
			}
			w = $rootScope.allrotas[ele.scd_rota_code][eledate.toDateString()];
			if (w===undefined){
				$rootScope.allrotas[ele.scd_rota_code][eledate.toDateString()]=[];
			}
			$rootScope.allrotas[ele.scd_rota_code][eledate.toDateString()].push(ele);
			//console.log("root code: "+$rootScope.allrotas[ele.scd_rota_code][eledate.toDateString()][0].scd_user_username);
		});
		
		
		});
	
	}
	
	$scope.daySessions = function(idate){
		var day_arr=[];	
		$rootScope.rotas.forEach(function(rot){
		//we should orer by the rot_order
		//for (var rot in $rootScope.rotas){
			//console.log("rota: "+rot.rot_code+" idate:"+idate);
			
			if ($rootScope.allrotas[rot.rot_code][idate]){
			
			$rootScope.allrotas[rot.rot_code][idate].forEach(function(session){
				day_arr.push(session);
			})
			}
			//else{
			//	console.log("no array for: "+rot.rot_code+" idate:"+idate);
			//}
		}
		);
		return day_arr;
	};
	 // to allow socke library to be used across pages
	 mysched={}
	 
	if (!io.socket.alreadyListeningToOrders){
		io.socket.alreadyListeningToOrders = true;
		io.socket.on('schedule', function onServerSentEvent(msg){
			console.log("we received an event");
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
				
					console.log("updating session: "+msg.ele.scd_date)
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
					console.log("end of update for "+ele.id);
					break;
				case 'sessionswapped':
					//not sure whether we need this as is 
					//what we need to do is update the sesison if we have it! ie test the dates!
					
					
					
					//when the session is swapped we also want to remove the pending messages for both users
				
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
							console.log("replaced ele1");
							$rootScope.allrotas[ele1.scd_rota_code][ele1date.toDateString()][index]=ele1;			
						}
						index++;
					})
					index=0;
					$rootScope.allrotas[ele2.scd_rota_code][ele2date.toDateString()].forEach(function(myele){
						if ( myele.id == ele2.id ){	
							console.log("replaced ele2");
							$rootScope.allrotas[ele2.scd_rota_code][ele2date.toDateString()][index]=ele2;			
						}
						index++;
					})
					
					
					$rootScope.$apply(); // this forecs our page to refresh after these changes
					console.log("end of accepted swap update for "+ele1.id);
					
					//if I am the person assigned to the session add to my list
					
					break;
					
				default: return;
			}
		});
	}
  }]).directive('cardlogin',function(){
                //display the selection screen for a particular student
                //So we can embed in a Modal or Accordian
    return {
        //restrict: 'E',
        // scope: {
            // session: '=instudent'
        // },
		//template: "Hello everyone!!"
		//we need to set cardhost == true if we are a card host!!!
		scope: false,
		
		
        templateUrl: '/templates/card-login.html'
    };
  });
  
})();