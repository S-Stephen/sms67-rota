

(function(){  

  //change otherstuff from an array to a hash - >rename myschedule

  var app = angular.module('ScheduleManagementModule',['ui.bootstrap']);
  
  app.filter('easydate', function () {
   return function (indate) {
	 var tmpdate = new Date(indate);
     return tmpdate.toDateString();
   };
  });
  
  
  app.controller('DatepickerDemoCtrl', ['$scope','$modal','$rootScope','$log', function ($scope,$modal,$rootScope,$log) {
  
    $scope.addRepeatForm = function (rota) {
		//console.log("some log message");
		$scope.repeat_start=new Date();
		$rootScope.repeat_start=new Date();
		$scope.repeat_end=new Date();
		$scope.rota=(rota)? rota : {} ;
		
		$scope.repeat_start=new Date();
		
        var modalInstance = $modal.open({
            templateUrl: 'modal-add-repeat.html',
            controller: AddRepeatModalInstanceCtrl,
            scope: $scope,
			rootScope: $rootScope,
            resolve: {
                repeatForm: function () {
                    return $scope.repeatForm;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
               $scope.selected = selectedItem;
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
		
    };	
    
    $scope.delRepeatForm = function (rota) {
		//console.log("some log message");
		$scope.del_start=new Date();
		$rootScope.del_start=new Date();
		$scope.del_end=new Date();
		$scope.rota=(rota)? rota : {} ;
		
		$scope.error="hello";
		$scope.repeat_start=new Date();
		
        var modalInstance = $modal.open({
            templateUrl: 'modal-del-repeat.html',
            controller: DelRepeatModalInstanceCtrl,
            scope: $scope,
			rootScope: $rootScope,
            resolve: {
                delForm: function () {
                    return $scope.delForm;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
               $scope.selected = selectedItem;
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
		
    };	  
	
    $scope.addShiftForm = function (rota) {
		//console.log("some log message");
		$scope.start=new Date();
		$rootScope.start=new Date();
		$scope.finish=new Date();
		$scope.rota=(rota)? rota : {} ;
		$scope.lorder=[]
		$scope.error="hello";
		$scope.repeat_start=new Date();
		$scope.dayselect = [{name:"Sunday",id:0},{name:"Monday",id:1},{name:"Tuesday",id:2},{name:"Wednesday",id:3},{name:"Thursday",id:4},{name:"Friday",id:5},{name:"Saturday",id:6}];
		$scope.rotadays=[];
		
		
        var modalInstance = $modal.open({
            templateUrl: 'modal-add-shift.html',
            controller: AddShiftModalInstanceCtrl,
            scope: $scope,
			rootScope: $rootScope,
            resolve: {
                shiftForm: function () {
                    return $scope.shiftForm;
                }
            }
        });

		$scope.addToLorder=function(imember){
			imember=angular.copy(imember);
			imember.id=new Date().getTime();
			$scope.lorder.push(imember);
			//alert("Adding: "+imember+" to the order");
		}
		
		$scope.delFromLorder=function(my_index){
			$scope.lorder.splice(my_index,1);
			//alert("Adding: "+imember+" to the order");
		}
		
		$scope.addToRotadays=function(iday){
			iday=angular.copy(iday);
			$scope.rotadays.push(iday);
			//alert("Adding: "+imember+" to the order");
		}
		
		$scope.delFromRotadays=function(my_index){
			$scope.rotadays.splice(my_index,1);
			//alert("Adding: "+imember+" to the order");
		}
		
		
		
        modalInstance.result.then(function (selectedItem) {
               $scope.selected = selectedItem;
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
		
    };	
  $scope.today = function() {
    $scope.dt_start = new Date();
    $scope.dt_end = new Date();
    $scope.dt_begin = new Date();
    $scope.dt_finish = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open_start = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened_start = true;
  };

  $scope.open_end = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened_end = true;
  };
  
  $scope.open_begin = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened_begin = true;
  };
  
  $scope.open_finish = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened_finish = true;
  };
  
  $scope.dateOptions = {
    
    startingDay: 0
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 2);
  $scope.events =
    [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

  $scope.getDayClass = function(date, mode) {

    return '';
  };
  }]);

  app.controller('MyScheduleController',['$http','$modal','$log','$scope','$rootScope',function($http,$modal,$log,$scope,$rootScope){
  
    scheduleManager=this;
    $scope.http = $http;
    $scope.addSessionForm = function (mydate,rota,members) {
	
		$scope.mydate=(mydate)? mydate : {} ;
		$scope.rota=(rota)? rota : {} ;
		$scope.members=(members)? members : $rootScope.members;
        var modalInstance = $modal.open({
            templateUrl: 'modal-add-session.html',
            controller: AddSessionModalInstanceCtrl,
            scope: $scope,
			rootScope: $rootScope,
            resolve: {
                sessionForm: function () {
                    return $scope.sessionForm;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
               $scope.selected = selectedItem;
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
    };	
     $scope.sessionManage = function (scd_session) {
	
		$scope.scd_session=(scd_session)? scd_session : {} ;

		$scope.users = function(){
			var users_arr=[];
			$rootScope.members.forEach(function(member){
				if (member.username != scd_session.scd_user_username){
					users_arr.push(member);
				}
			})
			return users_arr;
		};
		
		$scope.otherSessions = function(){
			var others_arr=[];
			
			//for (var rot in $rootScope.allrotas){
				for( var idate in $rootScope.allrotas[$scope.scd_session.scd_rota_code]){
					$rootScope.allrotas[$scope.scd_session.scd_rota_code][idate].forEach(function(session){
						if (session.scd_user_username != $scope.scd_session.scd_user_username){
							session.scd_date=new Date(session.scd_date);
							others_arr.push(session);
						}
					})
				}
			//}
			return others_arr;
		};
        var modalInstance = $modal.open({
            templateUrl: 'modal-session-manage.html',
            controller: sessionManageModalInstanceCtrl,
            scope: $scope,
			rootScope: $rootScope,
            resolve: {
                sessionManageForm: function () {
                    return $scope.sessionManageForm;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
               $scope.selected = selectedItem;
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
    };	
 
	//alert("hello - in MembershipController but why not in Member Controller?");
	scheduleManager.members = [];

	$http.get('/manager/memberships').success(function(data){	
		//console.log("we have some members - of course : "+data);
		 scheduleManager.members = data;
		$rootScope.members = scheduleManager.members;
	});
  
	scheduleManager.dates=[];
	var mydate=new Date();
	mydate.setHours(12,0,0,0);
	var lastdate=new Date(mydate.getTime()+1000*60*60*24*300); //two months?
	while (mydate.getTime() < lastdate.getTime()){
		scheduleManager.dates.push(new Date(mydate.getTime()));
		mydate=new Date(mydate.getTime()+1000*60*60*24);
	}
  
  
	$scope.datesAfter = function(indate){
		var retdates=[];
		indate=(indate)? new Date(indate) : new Date();
		////console.log("indate: "+indate);
		indate.setHours(12,0,0,0,0);
		scheduleManager.dates.forEach(function(ldate){
			if (ldate.getTime() > indate.getTime()){
				retdates.push(ldate);
			}
		});
		return retdates;
	};
 
  
	//sets up the list of schedules for this user
	mysched = this;
	//alert("hello - in MembershipController but why not in Member Controller?");
	mysched.scheds = [];
    mysched.otherstuff = [];
	mysched.myschedule = {}; // {mykey:Date, arr:[]}the date will be the key
    scheduleManager.allrotas = {};
	scheduleManager.rotalist =[];
	mysched.myrequests={};//array of requests I have made (rot-date)
	mysched.requeststo={};//array of all the requests other people have made (rot-date)
	mysched.me=''; // TODO Fix setting this currently relies on the user haveing a session assigned
	
	//attempt to setup a socket listener that will keep the objects up to date
	if (!io.socket.alreadyListeningToOrders){
		io.socket.alreadyListeningToOrders = true;
		io.socket.on('schedule', function onServerSentEvent(msg){
			//console.log("we received an event");
			switch(msg.verb){
				case 'removed':
					var ele = msg.ele;
					//console.log("return ele date: "+ele.scd_date);
					//console.log("ele code: "+ele.scd_rota_code);
					var tmpdate=new Date(ele.scd_date);
					ele.scd_date = tmpdate;
					//console.log("return ele date: "+tmpdate.toDateString());
					//console.log("return ele date: "+ele.scd_date.toDateString());
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
						//console.log("splice from array");
						$rootScope.allrotas[ele.scd_rota_code][ele.scd_date.toDateString()].splice(index,1);
					}
					$rootScope.$apply(); // this forecs our page to refresh after these changes
					break;
				case 'created':
					//add the schedule to our allrotas array
					var ele = msg.ele;
					eledate=new Date(ele.scd_date);
					ele.scd_date=eledate.setHours(12);
					v = mysched.allrotas[ele.scd_rota_code];
					if (v === undefined){
						mysched.allrotas[ele.scd_rota_code]={};
					}
					w = mysched.allrotas[ele.scd_rota_code][eledate.toDateString()];
					if (w === undefined){
						mysched.allrotas[ele.scd_rota_code][eledate.toDateString()]=[];
					}
					mysched.allrotas[ele.scd_rota_code][eledate.toDateString()].push(ele)
					//if I am the person assigned to the session add to my list
					
					$rootScope.$apply(); // this forecs our page to refresh after these changes
					break;
				case 'update':
					//RULE 1: WE never change the date of a session only user and status!
				
				
					//find the schedule in our allrotas array
					//re-displaying the allrotas array only semes to work for the actioning browser?!
					var ele = msg.ele;
					//console.log(msg);
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
					
					//Update our rota if it is our session (NB it might have changed to our session in which case we muct add it! (and removed the old one)
					if (ele.scd_user_username == mysched.me){
						
						//end to remove
						//if update status is to requested then we need to ad dthis to our myrequests hash
						if (ele.scd_status=='requested'){
							$rootScope.requeststo[ele.id]=ele;
						}
						if (ele.scd_status=='requestto'){
							$rootScope.myrequests[ele.id]=ele;
						}
					}
					
					
					$rootScope.$apply(); // this forecs our page to refresh after these changes
					//console.log("end of update for "+ele.id);
					break;
				case 'grabbed':
					//find the schedule in our allrotas array
					//re-displaying the allrotas array only semes to work for the actioning browser?!
					var ele = msg.ele;
					var olduser = (msg.givenupby == mysched.me)? 1 : 0 ;
					//console.log(msg);
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

						
						$rootScope.otherstuff.forEach(function(scd){
							//console.log("ele2: "+scd.id+"   :"+scd.scd_user_username+" "+scd.scd_date+"  "+scd.scd_rota_code+" "+scd.scd_status);
						});
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
	
	//Then get all the schedules for all rotas:
	$http.get('/rota/schedule/all').success(function(data){	
		//mysched.allrotas['EVE']={};
		//mysched.allrotas['EVE']['Tue Mar 31 2015']=[];
		//mysched.allrotas['EVE']['Tue Mar 31 2015'].push(data);
		//TODO handle when data is empty!!
		data.forEach(function(ele){
			var eledate=new Date(ele.scd_date); eledate.setHours(12);
			ele.scd_date = eledate; // inflate to date 
			//console.log("finding the rota entries id: "+ele.id+" date: "+eledate.toISOString()+"   rota: "+ele.scd_rota_code+" user: "+ele.scd_user_username+" "+ele.scd_status);
			v = scheduleManager.allrotas[ele.scd_rota_code];
			if (v === undefined){
				scheduleManager.allrotas[ele.scd_rota_code]={};
			}
			w = scheduleManager.allrotas[ele.scd_rota_code][eledate.toDateString()];
			if (w === undefined){
				scheduleManager.allrotas[ele.scd_rota_code][eledate.toDateString()]=[];
			}
			scheduleManager.allrotas[ele.scd_rota_code][eledate.toDateString()].push(ele);	
		})
	});
	
	
	$http.get('/rotas').success(function(data){
		data.forEach(function(ele){
			scheduleManager.rotalist.push(ele);
		})
	});
	
	$scope.mysched = mysched;
	$rootScope.dates = scheduleManager.dates;
	$rootScope.rotalist = scheduleManager.rotalist;
	$rootScope.allrotas= scheduleManager.allrotas; // attempt to set in the rootSCope to pass down to sibling repeats
	$rootScope.otherstuff= mysched.otherstuff; // attempt to set in the rootSCope to pass down to sibling repeats
	$rootScope.myschedule= mysched.myschedule; // attempt to set in the rootSCope to pass down to sibling repeats
	$rootScope.myrequests=mysched.myrequests;	
	$rootScope.requeststo=mysched.requeststo;	
	

}]);
  
var  AddSessionModalInstanceCtrl = function ($scope, $modalInstance, sessionForm, $rootScope) {
	$scope.form = {}
	//alert("Scope message, , , :"+$scope.message);
	//alert("Scope http: "+$scope.http);
	$scope.submitForm = function () {
		//create a session for this user / rota / date - or attempt to!
		var session_mem = $scope.session_member;
		//console.log("create a session: "+$scope.mydate+"  rota: "+$scope.rota.rot_code+" user: "+session_mem.username);
		var postme={scd_user_username:session_mem.username, scd_date:$scope.mydate, scd_rota_code:$scope.rota.rot_code}
		$scope.http.post('/manager/schedule/add',postme).success(function(data){					
			$modalInstance.close('closed');
		});		
	}
	
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
 
}
 
var  sessionManageModalInstanceCtrl = function ($scope, $modalInstance, sessionManageForm, $rootScope) {
	$scope.form = {}
	//alert("Scope message, , , :"+$scope.message);
	//alert("Scope http: "+$scope.http);
	$scope.submitForm = function () {
		//console.log("swap with?");
		
		//console.log("assign to?");
		
		//console.log("remove?");
	
		//create a session for this user / rota / date - or attempt to!
		//var session_mem = $scope.session_member;
		////console.log("create a session: "+$scope.mydate+"  rota: "+$scope.rota.rot_code+" user: "+session_mem.username);
		//var postme={scd_user_username:session_mem.username, scd_date:$scope.mydate, scd_rota_code:$scope.rota.rot_code}
		//$scope.http.post('/manager/schedule/add',postme).success(function(data){					
		//	$modalInstance.close('closed');
		//});		
	}
	
	$scope.remove = function(scd_session){
		//console.log("remove this session "+scd_session.id);
		$scope.http['delete']('/manager/schedule/del/'+scd_session.id).success(function(data){	
			//console.log("session removed");
			$modalInstance.close('closed');
		});
	}
	
		
	//depending on the object received suggest a list of replacements:
	//cannot swap with self! must swap with the same rota
	$scope.managerActionSwap = function () {
	
		var body = {theirs:$scope.scd_session,mine:$scope.scd_session.scd_request_by}
		if ($scope.scd_session.scd_request_to){
			body={mine:$scope.scd_session,theirs:$scope.scd_session.scd_request_to};
		}
			
		$scope.http.post('/manager/schedule/accept',body).success(function(data){
				//console.log("DEBUG how to update display (swap the session's username + change status ");
		});
		
		$modalInstance.dismiss('accepted the swap');
	};
	
	$scope.removeSwap = function(){
		var body = {theirs:$scope.scd_session,mine:$scope.scd_session.scd_request_by}
		if ($scope.scd_session.scd_request_by){
			body={mine:$scope.scd_session,theirs:$scope.scd_session.scd_request_by};
		}
		$scope.http.post('/manager/schedule/decline',body).success(function(data){
				//console.log("DEBUG how to update display (swap the session's username + change status ");
		});
		$modalInstance.dismiss('removed the swap');
	};
	
	$scope.assignToMember = function(new_user){
		//update the schedule to belong to a different user
		//console.log("TODO test that this isn't part of a swap");
		$scope.scd_session.scd_user_username = new_user.username;
		var sendme = $scope.scd_session; // we do thi sto prevent our display from changing!
		sendme.scd_user_username = new_user.username;
		$scope.http.put('/manager/schedule/update',sendme).success(function(data){
			//console.log("DEBUG how to update display (swap the session's username + change status ");
			$modalInstance.dismiss('sessin asisgned to another');
		});
	}
	
	$scope.swapWithSession = function(new_sess){
		//console.log("TODO test that this isn't part of a swap");
		//do two updates:
		
		var new_sess_user=new_sess.scd_user_username;
		var cur_sess_user=$scope.scd_session.scd_user_username;
		//console.log("new_sess user: "+new_sess_user+"   session user: "+cur_sess_user);
		
		var send1=$scope.scd_session;
		send1.scd_user_username=new_sess_user;
		
		var send2=new_sess;
		send2.scd_date=new Date(send2.scd_date);
		send2.scd_user_username=cur_sess_user;
		
		//console.log("send1 user: "+send1.scd_user_username+"   send2 user: "+send2.scd_user_username);
		
		//console.log("how to place in some sort of transaction");
		$scope.http.put('/manager/schedule/update',send1).success(function(data){
			$scope.http.put('/manager/schedule/update',send2).success(function(data2){
				$modalInstance.dismiss('session asisgned to another');
			});
		});
		
	}
	
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
 
}
var  AddShiftModalInstanceCtrl = function ($scope, $modalInstance, shiftForm, $rootScope) {

	$scope.form = {}

	$scope.submitForm = function (rota,lorder,rotadays,start,end) {
		alert("thank you for trying");
		
		//lorder holds the order with which the users are to be added
		
		
		//rotadays holds the days that are to be used - convert to a hash
		var dayhash=[];
		rotadays.forEach(function(ele){
			dayhash[ele.id]=1;
		});
		lorder=angular.copy(lorder);
		//create an aentry for each day:
		start.setHours(12,0,0,0);
		while ( start.getTime() <= end.getTime()){
		
			if (dayhash[start.getDay()]){
		
				user=lorder.shift();
			
				//create the shift
				var ele={scd_date:start,scd_rota_code:rota.rot_code,scd_user_username:user.username,scd_status:'accepted'};
				
				//console.log("create a shift pattern for: "+user.display_name+"  "+start);
				$scope.http.post('/manager/schedule/add',ele).success(function(data){					
					//console.log("added a schedule");
				});		
			
				lorder.push(user);
			}
			start=new Date(start.getTime()+1000*60*60*24);
		}
		
							
		$modalInstance.close('closed');
	}
}

var  DelRepeatModalInstanceCtrl = function ($scope, $modalInstance, delForm, $rootScope) {
	$scope.form = {}

	
	$scope.submitForm = function (rota,start,end) {
		//we need to check that all these sesions are 'accepted'
		var delme=[];
		var pass=1;
		var not_ready=""
		//console.log("in the submit function");
		while(start.getTime() <= end.getTime()){ 
			//console.log("in the delete loop");
			if ($rootScope.allrotas[rota.rot_code][start.toDateString()]){
			$rootScope.allrotas[rota.rot_code][start.toDateString()].forEach(function(sched){
					if (sched.scd_status != 'accepted'){
						//console.log("There is a schedule part of a swap / offerup in the selection");
						pass=-1;
						not_ready=not_ready+" "+sched.scd_date.toDateString()+"-"+sched.scd_user_username+". ";
						//start=new Date(end.getTime()+1000*60*60*24)
					}else{
						delme.push(sched);
					}
					//console.log("in hello world adding sched: "+sched);
			});
			}
			start=new Date(start.getTime()+1000*60*60*24);
		}
		if (pass>0){
			$scope.error="";
			delme.forEach(function(scd_session){
				$scope.http['delete']('/manager/schedule/del/'+scd_session.id).success(function(data){	
					//console.log("session removed");
				});
			});
			$modalInstance.dismiss('inserted schedule');
		}else{
			//there has been an issue report to our scope messages
			$scope.errors=["Your selection contains sessions that are under request for change. "+not_ready+"These need to be resolved (manually) before we can delete them"];
		}
	}

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

var  AddRepeatModalInstanceCtrl = function ($scope, $modalInstance, repeatForm, $rootScope) {
	$scope.form = {}
	//alert("Scope message, , , :"+$scope.message);
	//alert("Scope http: "+$scope.http);
	$scope.datediff = function(date1,date2){
		//console.log("date1: "+date1);
		 var datediff = date1.getTime() - date2.getTime();
		 datediff=(datediff<0)? -1 * datediff : datediff;
		//store the getTime diff - or +
		return (datediff / (24 * 60 * 60 * 1000));
		//Convert values to -/+ days and return value
	}
 
	$scope.listRepeat = function(rota,date_start,date_end){
//	  unable to get working some issue with changing the objected we are watchi when access in an ng-repat:
//    
//    <dl>
//			<dt>sessions to be repeated</dt>
//			<dd ng-repeat="word in helloWorld(rota,$rootScope.repeat_start,$rootScope.repeat_end)">{{word['scd_date'].toDateString()}} {{ word['scd_user_username'] }}</dd>
//    </dl>
//
//
//
		//gather the schedules between  $rootScope.repeat_start and $rootScope.repeat_end
		var start=new Date(date_start);
		var end=new Date(date_end);
		var scheds=[];
		//console.log("in hello world");
		//console.log("start :"+$rootScope.repeat_start+"     end: "+$rootScope.repeat_end);
		//console.log("start :"+start+"     end: "+end);
		while (start.getTime()<=end.getTime()){
				//console.log("loop in hello world");
			if ( $rootScope.allrotas[rota.rot_code][start.toDateString()] ){
				$rootScope.allrotas[rota.rot_code][start.toDateString()].forEach(function(sched){
					scheds.push(sched);
					//console.log("in hello world adding sched: "+sched);
				});
			}else{
				tmp1={'scd_user_username' : 'none', 'scd_date' : start};
				//console.log("in hello world creating a spacer: "+tmp1['scd_date'].toDateString());
				scheds.push(tmp1);
			}
			start=new Date(start.getTime()+1000*60*60*24);
		}		
		return scheds;
		//return ['hello','world',rota.rot_code,$rootScope.repeat_start];
	}	
	$scope.submitForm = function (rota,start,end,begin,finish) {
	
		//what is the best way to do this?
		//loop the entire block until repeat finished?
		
		//var arr = $scope.listRepeat(rota,start,end);
		////console.log("just before foreach call");
		//arr.forEach(function(data){
		//	//console.log("data: "+data.scd_date);
		//	//console.log("data: "+data.scd_date.toDateString());
		//});
		//$scope.listRepeat(rota,start,end).forEach(function(data){
		//	//console.log("data: "+data.scd_date);
		//	//console.log("data: "+data.scd_date.toDateString());
		//});
		////console.log("start: "+start);
		////console.log("end: "+end);
		////console.log("begin: "+begin);
		////console.log("finish: "+finish);
		
		//this is listRepeat but inline: 
		var scheds=[];
		//console.log("in hello world");
		//console.log("start :"+$rootScope.repeat_start+"     end: "+$rootScope.repeat_end);
		//console.log("start :"+start+"     end: "+end);
		while (start.getTime()<=end.getTime()){
				//console.log("loop in hello world");
			if ( $rootScope.allrotas[rota.rot_code][start.toDateString()] ){
				$rootScope.allrotas[rota.rot_code][start.toDateString()].forEach(function(sched){
					scheds.push(sched);
					//console.log("for username: "+sched.scd_user_username);
					//console.log("in hello world adding sched: "+sched.scd_date.toDateString()+"  by: "+sched.scd_user_username);
				});
			}else{
				tmp1={'scd_user_username' : 'none', 'scd_date' : start};
				//console.log("in hello world creating a spacer: "+tmp1['scd_date'].toDateString());
				scheds.push(tmp1);
			}
			start=new Date(start.getTime()+1000*60*60*24);
		}		
		//end list repeat
		//to generate the timetable we need to find the offset from the first day of the loop to the start day
	    var offset = $scope.datediff(begin,scheds[0].scd_date);
		var loop_offset= $scope.datediff(scheds[scheds.length-1].scd_date, scheds[0].scd_date);
		var last=-1;
		while(last < 0){
			for(i=0;i<scheds.length;i++){
			//arr.forEach(function(ele){
				var ele={scd_date:scheds[i].scd_date,scd_rota_code:scheds[i].scd_rota_code,scd_user_username:scheds[i].scd_user_username,scd_status:'accepted'};
				ele.scd_date=new Date(ele.scd_date.getTime()+offset*24*60*60*1000);
				if (ele.scd_date.getTime() > finish.getTime()){
					last=1;
					break;
				}
				//console.log("mapping :"+ele.scd_user_username+" "+scheds[i].scd_date+" to "+ele.scd_date+" offset: "+offset+" finish date: "+finish);
				$scope.http.post('/manager/schedule/add',ele).success(function(data){					
					//$modalInstance.close('closed');
				});		
			//});
			}
			offset=loop_offset+offset+1;
		}
		
		
        $modalInstance.dismiss('inserted schedule');
		//apply this offset to all elements of the array while it is below or equal the end date and remove the ids and send for create
		//then repeat this time adding the length of the selection as the offset
		
		
	
		//create repeats based on the dates given.
		//var session_mem = $scope.session_member;
		////console.log("create a session: "+$scope.mydate+"  rota: "+$scope.rota.rot_code+" user: "+session_mem.username);
		//var postme={scd_user_username:session_mem.username, scd_date:$scope.mydate, scd_rota_code:$scope.rota.rot_code}
		//$scope.http.post('/manager/schedule/add',postme).success(function(data){					
		//	$modalInstance.close('closed');
		//});		
	}
	
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
 
 
 
} 
})();