

(function(){  

  //change otherstuff from an array to a hash - >rename myschedule


  var app = angular.module('SchedulesModule',['ui.bootstrap']);
  
  app.filter('date', function () {
   return function (indate) {
	 var tmpdate = new Date(indate);
     return tmpdate.toDateString();
   };
  });

  app.controller('MyScheduleController',['$http','$scope','$rootScope',function($http,$scope,$rootScope){
	//sets up the list of schedules for this user
	mysched = this;
	//alert("hello - in MembershipController but why not in Member Controller?");
	mysched.scheds = [];
    mysched.otherstuff = [];
	mysched.myschedule = {}; // {mykey:Date, arr:[]}the date will be the key
    mysched.allrotas = {};
	mysched.rotalist =[];
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
					//console.log("DEBUG date: "+ele.scd_date);
					ele.scd_date=new Date(ele.scd_date);
					ele.scd_date.setHours(12);
					
					
					
					//if (ele.scd_user_username == mysched.me){
					//	mysched.myschedule[ele.scd_date.toISOString()]=(mysched.myschedule[ele.scd_date.toISOString()] )? mysched.myschedule[ele.scd_date.toISOString()] : {mykey:ele.scd_date,arr:[]};
					//	$rootScope.myschedule[ele.scd_date.toISOString()]['arr'].push(ele);
					//	$rootScope.$applyAsync(); // this forecs our page to refresh a
					//}
					
					
					
					//console.log("DEBUG date: "+ele.scd_date);
					v = $rootScope.allrotas[ele.scd_rota_code];
					if (v === undefined){
						$rootScope.allrotas[ele.scd_rota_code]={};
					}
					w = $rootScope.allrotas[ele.scd_rota_code][ele.scd_date.toDateString()];
					if (w === undefined){
						$rootScope.allrotas[ele.scd_rota_code][ele.scd_date.toDateString()]=[];
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
					//console.log(msg);
					eledate=new Date(ele.scd_date);
					ele.scd_date=eledate;
					ele.scd_date.setHours(12);
					//console.log("ele id: "+ele.id+"  ele date: "+ele.scd_date);
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
						
						//removed the requestto and myrequests entries
					}
					
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
						
					
					
					
					//if(ele.scd_request_to && ele.scd_request_to.scd_user_username == mysched.me && ele.scd_request_to.scd_status == 'requestto'){
					//	$rootScope.requeststo[ele.id]=ele;
					//}
					
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
	
	$http.get('/member/schedule').success(function(data){	
		//this will return a scheule with gaps - what we need to do is fill in the gaps:
		mysched.me=data[0].scd_user_username;
		$scope.me=data[0].scd_user_username;
		//console.log("DEBUG I am: "+mysched.me);
		var first=new Date(data[0].scd_date); first.setHours(12);
		var last=new Date(); last.setHours(12);
		last = (first.getTime() < last.getTime())? first : last;
		var end=new Date(last.getTime()+1000*60*60*24*90); //90 days of dates
	//last.setHours(12);
			//alert("returned from schedule");
		data.forEach(function(ele){
			var eledate=new Date(ele.scd_date); eledate.setHours(12); //dates from waterline are not inflated
			ele.scd_date=eledate;
			////console.log("current date: "+eledate+"   last variable  "+last);
			//console.log(ele.id+"  requestby:"+ele.scd_request_by); 
			if (ele.scd_request_to){
				var tmpdate=new Date(ele.scd_request_to.scd_date);
				ele.scd_request_to.scd_date=tmpdate;
				mysched.requeststo[ele.scd_request_to.id]=ele;
			}
			if (ele.scd_request_by){
				var tmpdate=new Date(ele.scd_request_by.scd_date);
				ele.scd_request_by.scd_date=tmpdate;
				mysched.myrequests[ele.scd_request_by.id]=ele;
			}
			//attempt to fill the gaps in our days:
			while (last.getTime() < eledate.getTime()){
				//alert("looping before end ");
				////console.log("looping the schedules pushing: "+last.getTime()+"  "+eledate.getTime());
			    ////console.log("pushing in whil : "+last);
				
				mysched.myschedule[last.toISOString()]={mykey:last,arr:[]};
				//to remove start
				mysched.otherstuff.push({scd_date:last});
				//to remove end
				
				last=new Date(last.getTime()+1000*60*60*24)
			}
			////console.log("pushing : "+ele.scd_date);
			//if (typeof mysched.myschedule[ele.scd_date.toDateString()] == undefined){
				mysched.myschedule[ele.scd_date.toISOString()]=(mysched.myschedule[ele.scd_date.toISOString()] )? mysched.myschedule[ele.scd_date.toISOString()] : {mykey:ele.scd_date,arr:[]};
			//}
			mysched.myschedule[ele.scd_date.toISOString()]['arr'].push(ele);
			//to delete start
			mysched.otherstuff.push(ele);
			//to delete end
			
			if (eledate.getTime() < last.getTime()){
				;
			}else{			
			//mysched.scheds.push(ele);
			//last=eledate;
				last=new Date(last.getTime()+1000*60*60*24)
			}
		});
		////console.log("last eledate: "+last);
		while (last.getTime() < end.getTime()){
				//alert("looping ");
				mysched.myschedule[last.toISOString()]={mykey:last,arr:[]};
				//to delete start
				mysched.otherstuff.push({scd_date:last});
				//to delete end
				last=new Date(last.getTime()+1000*60*60*24)
		}
		mysched.scheds=data;
		//but we also need to do the end!
	
	});
	
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
			v = mysched.allrotas[ele.scd_rota_code];
			if (v === undefined){
				mysched.allrotas[ele.scd_rota_code]={};
			}
			w = mysched.allrotas[ele.scd_rota_code][eledate.toDateString()];
			if (w === undefined){
				mysched.allrotas[ele.scd_rota_code][eledate.toDateString()]=[];
			}
			mysched.allrotas[ele.scd_rota_code][eledate.toDateString()].push(ele);	
		})
	});
	
	//Get a list of swap request sessions I've made
//	$http.get('/member/schedule/myrequests').success(function(data){
//		data.forEach(function(ele){
//			var eledate=new Date(ele.scd_date);
//			ele.scd_date = eledate;
////			mysched.requestto[ele.scd_rota_code+" "+eledate.toDateString()]=
//			mysched.myrequests[ele.scd_rota_code+" "+eledate.toDateString()]=ele;
//		});
//	});
//	//get a list of requests for my sessions
//	$http.get('/member/schedule/requestto').success(function(data){
//		data.forEach(function(ele){
//			var eledate=new Date(ele.scd_date);
//			ele.scd_date = eledate;
//			mysched.requestto[ele.scd_rota_code+" "+eledate.toDateString()]=ele
//		});
//	});
	
	
	$http.get('/rotas').success(function(data){
		data.forEach(function(ele){
			mysched.rotalist.push(ele.rot_code);
		})
	});
	
/* from project overlord20 ep4 ?
	$scope.membershipForm = {
		loading= false;
	};
	
	$scope.submitMembershipForm=function(){
		//console.log("submitted the membership form");
		$scope.membershipForm.loading=true;
		
	}*/
	//we expose this controller object onto the scope - does thi shelp us? we can use mysched.allrotas rather than myschedCtrl.allrotas??
	
	//setup an array of dates that we wil be using to display our table
	//rather than fillin gin th egaps on myschedule
	var todaydate = new Date();
	var enddate = new Date(todaydate.getTime()+1000*60*60*24*90);
	var dates=[];
	while (todaydate.getTime() < enddate.getTime()){
		//console.log(todaydate.getTime()+"     <          "+enddate.getTime());
		dates.push(todaydate);
		todaydate=new Date(todaydate.getTime()+1000*60*60*24);
		//console.log(todaydate.getTime()+"     <          "+enddate.getTime());
	}
	
	
	$scope.mysched = mysched;
	$rootScope.dates=dates;
	$rootScope.allrotas= mysched.allrotas; // attempt to set in the rootSCope to pass down to sibling repeats
	$rootScope.otherstuff= mysched.otherstuff; // attempt to set in the rootSCope to pass down to sibling repeats
	$rootScope.myschedule= mysched.myschedule; // attempt to set in the rootSCope to pass down to sibling repeats
	$rootScope.myrequests=mysched.myrequests;	
	$rootScope.requeststo=mysched.requeststo;	
	
	//debug the values of our rota arrays:
	for(var i=0; i< mysched.allrotas.length; i++){
		//console.log("index: "+i);
		var myarr = $scope.mysched.allrotas[i];
		for(var j=0; i< myarr.length; j++){
	//$scope.mysched.allrotas.forEach(function(rotacode){
		////console.log("rota: "+rotacode);
		
		//myarr[j].forEach(function(myarr[j]){
			////console.log("dateind: "+dateind);
			myarr[j].foreach(function(myobjh){
				//console.log("all rotas: "+myobjh.scd_user_username+"  "+myobjh.scd_status+" "+myobjh.id);
			})
		//})
		}
	//	})
	//})
	}

}]);
  
  //from https://gist.github.com/rnkoaa/8333940
  
  app.controller("ModalSwapFormController", ['$scope', '$modal', '$log', '$http','$rootScope',
    //sets the controller to be used to request a schedule swap 
    function ($scope, $modal, $log, $http, $rootScope) {
		$scope.http = $http;	
		
		$scope.declineSession = function(invars){
			//accept or decline a request to swap a session
			$scope.vars=(invars)? invars : {} ;
			
			var modalInstance = $modal.open({
				templateUrl: 'modal-decline.html',
				controller: ModalDeclineCtrl,
				scope: $scope,
				rootScope: $rootScope,
				resolve: {
					declineForm: function () {
						return $scope.declineForm;
					}
				}
			});
		}
				
		$scope.acceptSession = function(invars){
			//accept or decline a request to swap a session
			$scope.vars=(invars)? invars : {} ;
			//console.log("in vars: "+invars);
			var modalInstance = $modal.open({
				templateUrl: 'modal-accept.html',
				controller: ModalAcceptCtrl,
				scope: $scope,
				rootScope: $rootScope,
				resolve: {
					acceptForm: function () {
						return $scope.acceptForm;
					}
				}
			});
		}
		//depending on the state of the invars a particular form will be shown:
		$scope.showSwapForm = function (invars,inselect) {
			//$scope.message = "Show Form Button Clicked";
			//alert($scope.message);
			
			$scope.vars=(invars)? invars : {} ;
			$scope.inselect=(invars)? $rootScope.allrotas[invars.scd_rota_code] : {}; // we can essentially ignore the inselect (using the rootSCope arrays
//			$scope.inselect=(inselect)? inselect : {};
			//console.log(inselect);
			//alert("invars: "+$scope.vars.username);
			
				var modalInstance = $modal.open({
					templateUrl: 'modal-swap-form.html',
					controller: ModalSwapInstanceCtrl,
					scope: $scope,
					rootScope: $rootScope,
					resolve: {
						swapForm: function () {
							return $scope.swapForm;
						}
					}
				});
				
				
			
			modalInstance.result.then(function (selectedItem) {
					$scope.selected = selectedItem;
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
				}
			);
		};
		
		//Test wheter swapping the other way works (so we click on the session we would like!)
		$scope.showSwapWithForm = function (invars,inselect) {
			//$scope.message = "Show Form Button Clicked";
			//alert($scope.message);
			
			$scope.swapwith=(invars)? invars : {} ;
			$scope.mysessions=(inselect)? inselect : {};
			//console.log(inselect);
			//alert("invars: "+$scope.vars.username);
			
			var minetheirs = (invars.scd_user_username == $scope.me )? 'mine' : 'theirs' ;
			
			//console.log("root who: "+$scope.me+"  requesting: "+invars.scd_user_username);
			var modalInstance;
			
			if (minetheirs == 'mine'){
				if ($scope.swapwith.scd_status == 'offerup' || $scope.swapwith.scd_status == 'requested'){
					//if we are not the user then we can not request to swap as someone else has
					
					modalInstance = $modal.open({
						templateUrl: 'modal-swap-notavail.html',
						controller: ModalInvalidCtrl,
						scope: $scope,
						rootScope: $rootScope,
					
					});	
				}
				if ($scope.swapwith.scd_status == 'accepted' ){
					$scope.vars=invars;
					$scope.inselect=$rootScope.allrotas[invars.scd_rota_code];
					var modalInstance = $modal.open({
						templateUrl: 'modal-swap-form.html',
						controller: ModalSwapInstanceCtrl,
						scope: $scope,
						rootScope: $rootScope,
						resolve: {
							swapForm: function () {
								return $scope.swapForm;
							}
						}
				    });
				}if ($scope.swapwith.scd_status == 'requestto'){
					//set the for to accept/decline the swap request
					
					$scope.vars=invars;
					var modalInstance = $modal.open({
						templateUrl: 'modal-action-swap-form.html',
						controller: ModalActionSwapInstanceCtrl,
						scope: $scope,
						rootScope: $rootScope,
						resolve: {
							actionForm: function () {
								return $scope.actionForm;
							}
						}
				    });
				}					
				
			}else{
				//must be theirs!
			
				if ($scope.swapwith.scd_status == 'accepted'){
			
				//we can request a normal swap with this user
			
					//we first need to flatten the select array (notice that the selection options will not be updated following model interations
					//if lets say someone requests on one of our sessions
					////console.log("setup the session select");
					$scope.inselect=$rootScope.allrotas[invars.scd_rota_code];
					$scope.select=function(){
						flatten=[];
						var nowd = new Date();
						var yestd = new Date(nowd.getTime()-1000*60*60*24);
						////console.log("let's flatten");
						//for (var rot in $rootScope.allrotas){
						var rot = invars.scd_rota_code
							for( var idate in $rootScope.allrotas[rot]){
								var mydate = new Date(idate)
								if (mydate.getTime() > yestd.getTime()){ 
								$rootScope.allrotas[rot][idate].forEach(function(session){
									if (session.scd_user_username == $scope.me && session.scd_status != 'requested'){
										flatten.push(session);
									}
								})
								}
							}
						//}
						//for (var key in $scope.myschedule) {
						//	////console.log("key for myschedule: "+key);
						//	$scope.myschedule[key]['arr'].forEach(function(session){
						//	////console.log("Adding array");
						//	//myarr['arr'].forEach(function(session){
						//		////console.log("Adding session: "+session.scd_rota_code);
						//		if (session.scd_rota_code == $scope.swapwith.scd_rota_code){
						//			////console.log("adding to the sesisons array:"+session.id);
						//			flatten.push(session);
						//		}
						//	})
						//})
						//}
						return flatten;
					}
			
			
					modalInstance = $modal.open({
						templateUrl: 'modal-swap-with-form.html',
						controller: ModalSwapWithInstanceCtrl,
						scope: $scope,
						resolve: {
							swapWithForm: function () {
								return $scope.swapWithForm;
							}
						}
					});
				}
			
				if ($scope.swapwith.scd_status == 'offerup'){
				//we can take thi ssession
					modalInstance = $modal.open({
						templateUrl: 'modal-grab-form.html',
						controller: ModalGrabInstanceCtrl,
						scope: $scope,
						rootScope: $rootScope,
						resolve: {
							grabForm: function () {
								return $scope.grabForm;
							}
						}
					});	
				}
			
				if ($scope.swapwith.scd_status == 'requested' || $scope.swapwith.scd_status == 'requestto'){
					//if we are not the user then we can not request to swap as someone else has
				
					modalInstance = $modal.open({
						templateUrl: 'modal-swap-notavail.html',
						controller: ModalInvalidCtrl,
						scope: $scope,
						rootScope: $rootScope,
					
					});	
				}
			}
			//modalInstance.result.then(function (selectedItem) {
			//		$scope.selected = selectedItem;
			//	}, function () {
			//		$log.info('Modal dismissed at: ' + new Date());
			//	}
			//);
		};
		
		
  }]);
 
  var ModalDeclineCtrl = function ($scope, $modalInstance, declineForm, $rootScope) {
	$scope.form = {}
	//alert("Scope message, , , :"+$scope.message);
	//alert("Scope http: "+$scope.http);
	
	
	//depending on the object received suggest a list of replacements:
	//cannot swap with self! must swap with the same rota
	$scope.submitForm = function (membershiplist) {
		$scope.http.post('/member/schedule/decline',{mine:$scope.vars,theirs:$scope.vars.scd_request_by}).success(function(data){
			//alert("any swaps? "+data);
		//data.forEach(function(row){
		//	//alert("swap: "+row.scd_user_username);
		//	$scope.myopts.push(row);
		//});
		
			//console.log("DEBUG how to update display  - chnage status");
			//REMOVE from waiting lists -> transmit change in button colours!
		
		});
		$modalInstance.dismiss('declined the swap');
	};
  };
  
  var ModalAcceptCtrl = function ($scope, $modalInstance, acceptForm, $rootScope) {
	$scope.form = {}
	//alert("Scope message, , , :"+$scope.message);
	//alert("Scope http: "+$scope.http);
	
	//depending on the object received suggest a list of replacements:
	//cannot swap with self! must swap with the same rota
	$scope.submitForm = function (membershiplist) {
		$scope.http.post('/member/schedule/accept',{mine:$scope.vars,theirs:$scope.vars.scd_request_by}).success(function(data){
			//alert("any swaps? "+data);
		//data.forEach(function(row){
		//	//alert("swap: "+row.scd_user_username);
		//	$scope.myopts.push(row);
		//});
			//console.log("DEBUG how to update display (swap the session's username + change status ");
			//REMOVE from waiting lists -> transmit change in button colours!
		
		});
		$modalInstance.dismiss('accepted the swap');
	};
  };
  var ModalSwapInstanceCtrl = function ($scope, $modalInstance, swapForm, $rootScope) {
	$scope.form = {}
	//alert("Scope message, , , :"+$scope.message);
	//alert("Scope http: "+$scope.http);
	
	$scope.testmodel="hello world";
	
	$scope.myopts=[];
	//depending on the object received suggest a list of replacements:
	//cannot swap with self! must swap with the same rota
	$scope.http.get('/rota/schedule/swap/'+$scope.vars.scd_rota_code+'/'+$scope.vars.scd_user_username).success(function(data){
			//alert("any swaps? "+data);
		data.forEach(function(row){
			//alert("swap: "+row.scd_user_username);
			$scope.myopts.push(row);
		});
	});
	
	
	
	$scope.submitForm = function (membershiplist) {
			//alert("Scope before valid http: "+$scope.http);
		if ($scope.form.swapForm.$valid) {

			//alert("Scope another  http: "+$scope.http);
			//if we have an id then we are actioning an update
			//if($scope.vars.id){
			
				//alert("updating record: "+$scope.vars.username);
				//vars stores the schedule we have 
				//console.log("request swap with: "+$scope.swap_session.id);
				//but which schedulea re we attempting to swap this with?
				//$scope.vars.scd_status = 'requested'; // will this update the page automatically?
					
				$scope.http.post('/member/schedule/swap',{mine:$scope.vars,theirs:$scope.swap_session}).success(function(data){	
				
					//membershiplist.push(data); - how do we replace the record for above in the membership list?
					$modalInstance.close('closed');
					//this updates our page but why doesn't the following
					//$scope.vars.scd_status = 'requested'; // will this update the page automatically?
//					$scope.vars = data[0];
//					//$scope.swap_session.scd_status = 'requested';
//					var swapwithdate=new Date($scope.swap_session.scd_date);
//					var donatedate=new Date($scope.vars.scd_date);
//					var swap_sessionID=$scope.swap_session.id;
//					//console.log("swap session for: "+swap_sessionID);
//					
//					//console.log("data returned from swap request: "+data);
//					//console.log("data returned from swap request: "+data[0].id);
					
					//update the chosen session (TODO update with object from post)
//					var myi=0;
//					$rootScope.allrotas[$scope.swap_session.scd_rota_code][swapwithdate.toDateString()].forEach(function(scd){
//						//console.log("looping swap array: ");
//						if (scd.id == swap_sessionID){
//							$rootScope.allrotas[$scope.swap_session.scd_rota_code][swapwithdate.toDateString()][myi]=data[1];
//							//$rootScope.allrotas[$scope.swap_session.scd_rota_code][swapwithdate.toDateString()][myi].scd_status='requested';
//							//console.log("hopefully swapped");
//						}
//						
//						myi++;
//					});
					
					//update the users schedule of sessions from the various rotas
//					myi=0;
//					$rootScope.otherstuff.forEach(function(scd){
//						if (scd.id == data[0].id){
//							//scd = data[0];
//						//TODO we can not seem to update with the object?!
//							$rootScope.otherstuff[myi].scd_status=data[0].scd_status;
//						}
//						myi++;
//					});
					
					//update the donated session (TODO update with object from post) 
//					myi=0;
//					$rootScope.allrotas[$scope.vars.scd_rota_code][donatedate.toDateString()].forEach(function(scd){
//						//console.log("looping swap array: ");
//						if (scd.id == $scope.vars.id){
//							$rootScope.allrotas[$scope.swap_session.scd_rota_code][donatedate.toDateString()][myi]=data[0]
//							//$rootScope.allrotas[$scope.swap_session.scd_rota_code][donatedate.toDateString()][myi].scd_status='requested';
//							//console.log("hopefully swapped");
//						}
//						myi++;
//					});

				});		
			//}
			
			//else new user record
			//else{
			//	//alert("adding a new record: "+$scope.vars.username);
			//	$scope.http.post('/manager/memberships/add',$scope.vars).success(function(data){	
			//		membershiplist.push(data);
			//		$modalInstance.close('closed');
			//	});		
			//}
			
			//then close the modal
		} else {
			//we have requested to offer up the session:
		
			//console.log('offerup session: '+$scope.vars);
			$scope.http.put('/member/schedule/offerup',{mine:$scope.vars}).success(function(data){	
				//$scope.vars.scd_status = 'offerup';
				var myi=0;
				var donatedate=new Date($scope.vars.scd_date);
				$rootScope.allrotas[$scope.vars.scd_rota_code][donatedate.toDateString()].forEach(function(scd){
					//console.log("looping swap array: ");
					if (scd.id == $scope.vars.id){
						$rootScope.allrotas[$scope.vars.scd_rota_code][donatedate.toDateString()][myi]=data[0];
						$scope.vars=data[0];
						//$rootScope.allrotas[$scope.swap_session.scd_rota_code][donatedate.toDateString()][myi].scd_status='requested';
						//console.log("hopefully given up");
					}
					myi++;
				});
				
//This should be handled by the Socket				
//				myi=0;
//				$rootScope.otherstuff.forEach(function(scd){
//					if (scd.id == data[0].id){
//						//scd = data[0];
//						
//						//TODO we can not seem to update with the object?!
//						//start of remove
//						$rootScope.otherstuff[myi].scd_status=data[0].scd_status;
//						//end of remove
//					}
//					myi++;
//				});
				$modalInstance.dismiss('offerup');
			});
		}
	};
 
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
  };
  
  //again attempt to swap the otehr way around:
  //NB this will update t heparent 'obj' and the current sesison but not the adjacent session which is a rerepresentation of the parent obj displayed in the rota lists
  
  var ModalSwapWithInstanceCtrl = function ($scope, $modalInstance, swapWithForm, $rootScope) {
	//This is called when we click on another users session - to request that we swap sesisons
  
	$scope.form = {}
	
	$scope.submitWithForm = function (membershiplist) {
			//alert("Scope before valid http: "+$scope.http);
		if ($scope.form.swapWithForm.$valid) {

					
				$scope.http.post('/member/schedule/swap',{mine:$scope.mysession,theirs:$scope.swapwith}).success(function(data){	
					//membershiplist.push(data); - how do we replace the record for above in the membership list?
					$modalInstance.close('closed');
					//this updates our page but why doesn't the following
					$scope.mysession.scd_status = 'requested'; // will this update the page automatically?
					$scope.swapwith.scd_status = 'requested';
					
				});		
			
			//then close the modal
		} else {
			//console.log('swapform is not in scope');
		}
	};
 
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
  };
  
  var  ModalActionSwapInstanceCtrl = function ($scope, $modalInstance, actionForm, $rootScope) {
	//This is called when we click on another users session - to request that we swap sesisons
  
	$scope.form = {}
	
	$scope.accept= function () {
			$scope.acceptSession($scope.swapwith);
					$modalInstance.close('closed');
				
			//console.log('request accepted');
		
	};
	$scope.decline= function () {
			$scope.declineSession($scope.swapwith);
					$modalInstance.close('closed');
				
			//console.log('request declined - sorry!');
		
	};
 
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
  };
  var ModalGrabInstanceCtrl = function ($scope, $modalInstance, grabForm, $rootScope) {
	$scope.form = {}
	
	$scope.submitForm = function () {
			//alert("Scope before valid http: "+$scope.http);
		if ($scope.form.grabForm.$valid) {

				var donatedate = new Date($scope.swapwith.scd_date);
				$scope.http.put('/member/schedule/grab',{theirs:$scope.swapwith}).success(function(data){	
					//membershiplist.push(data); - how do we replace the record for above in the membership list?
					//this updates our page but why doesn't the following
					myi=0;
					$rootScope.allrotas[$scope.swapwith.scd_rota_code][donatedate.toDateString()].forEach(function(scd){
						//console.log("looping swap array: ");
						if (scd.id == data[0].id){
							$rootScope.allrotas[$scope.swapwith.scd_rota_code][donatedate.toDateString()][myi]=data[0]
							//$rootScope.allrotas[$scope.swap_session.scd_rota_code][donatedate.toDateString()][myi].scd_status='requested';
							//console.log("hopefully grabbed"); //(we go green again)
							
							//console.log("TODO add this to our list of sessions - remember trouble setting the [i] = scd!!")
							
						}
						myi++;
					});
					$modalInstance.close('closed');
				});		
			
			//then close the modal
		} else {
			//console.log('swapform is not in scope');
		}
	};
 
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
  };
  
  var ModalInvalidCtrl = function ($scope, $modalInstance, $rootScope) {
	//CAlled upon an invalid session swap
 
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
  };
  
})();