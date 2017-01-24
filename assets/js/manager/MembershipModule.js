

(function(){  


  var app = angular.module('MembershipModule',['ui.bootstrap','ui.bootstrap.datepicker']);
	 
  app.filter('easydate', function () {
   return function (indate) {
	 var tmpdate = new Date(indate);
     return tmpdate.toDateString();
   };
  });

   app.controller('MemberController',['$http',function($http){
    var member = this;
	member.member = {};
	//alert("hello - in MemberController");
	
	this.addMember = function(membershiplist){
		//alert("we have submitted! but we just want to ajax and close! "+member.member.username);
		//alert("membership list! "+membershiplist);
		//todo - do this on success of ajax update!
		//var request = $http({
		//			method; "post",
		//			url: "/manager/membership/add",
					
	    $http.post('/manager/memberships/add',member.member).success(function(data){	
			membershiplist.push(data);
			//then somehow close the modal
	    });		
		member.member={};
		//awful as it presumes a particular view
		
	};
	
  }]);
  
  
  app.controller('MembershipController',['$http','$scope',function($http,$scope){
	memberships = this;
	
	//alert("hello - in MembershipController but why not in Member Controller?");
	memberships.members = [];

	$http.get('/manager/memberships').success(function(data){	
		 memberships.members = data
	});
/* from project overlord20 ep4 ?
	$scope.membershipForm = {
		loading= false;
	};
	
	$scope.submitMembershipForm=function(){
		////console.log("submitted the membership form");
		$scope.membershipForm.loading=true;
		
	}*/
	
	
  }]);

  
 

  
  
  
  //from https://gist.github.com/rnkoaa/8333940
  
  app.controller("ModalAccountFormController", ['$scope', '$modal', '$log', '$http', function ($scope, $modal, $log, $http) {
 
		$scope.http = $http;	
        $scope.regCard = function (invars) {
            //$scope.message = "Show Form Button Clicked";
            //alert($scope.message);
 
			
			$scope.vars=(invars)? invars : {} ;
			//alert("invars: "+$scope.vars.username);
			console.log(" username: "+invars.username);
			console.log(" username: "+$scope.vars.username);
            var modalInstance = $modal.open({
                templateUrl: 'modal-regcard.html',
                controller: ModalInstanceRegCardCtrl,
                scope: $scope,
                resolve: {
                    userForm: function () {
                        return $scope.userForm;
                    }
                }
            });
 
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
				});
        };
		
		$scope.http = $http;	
        $scope.showForm = function (invars) {
            //$scope.message = "Show Form Button Clicked";
            //alert($scope.message);
 
			
			$scope.vars=(invars)? invars : {} ;
			//alert("invars: "+$scope.vars.username);
            var modalInstance = $modal.open({
                templateUrl: 'modal-form.html',
                controller: ModalInstanceCtrl,
                scope: $scope,
                resolve: {
                    userForm: function () {
                        return $scope.userForm;
                    }
                }
            });
 
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
				});
        };
  }]);
 
  var ModalInstanceRegCardCtrl = function ($scope, $modalInstance, userForm) {
	$scope.form = {}
	//alert("Scope message, , , :"+$scope.message);
	//alert("Scope http: "+$scope.http);
	$scope.submitForm = function () {
		console.log('register card');
		//$scope.vars.cardid = $scope.vars.cardid1;
        console.log('register card username: '+$scope.vars.username);
		$scope.vars.username = $scope.vars.username;
		$scope.vars.provider="local";
		$query = $scope.vars;
		//$query.cardid = $scope.vars.cardid1;
		
		$scope.http.post('/auth/local/registercard',{username:$scope.vars.username,cardid:$scope.vars.cardid1,provider:'local'}).success(function(data){	
			//membershiplist.push(data); - how do we replace the record for above in the membership list?
			if (data.status == "success"){
				$scope.vars.cardid = $scope.vars.cardid1;
				$modalInstance.close('closed');
			}else{
				$scope.message = data.message;
				$scope.vars.cardid1 = "";
			}
		}).error(function(data){
			//feed back that the card was not updated - reason?
			console.log('error registering card');
		});	
	
	}
  }
  var ModalInstanceCtrl = function ($scope, $modalInstance, userForm) {
	$scope.form = {}
	//alert("Scope message, , , :"+$scope.message);
	//alert("Scope http: "+$scope.http);
	$scope.submitForm = function (membershiplist) {
			//alert("Scope before valid http: "+$scope.http);
		if ($scope.form.userForm.$valid) {
			////console.log('user form is in scope');

			//alert("Scope another  http: "+$scope.http);
			//if we have an id then we are actioning an update
			if($scope.vars.id){
			
				//alert("updating record: "+$scope.vars.username);
				
				$scope.http.put('/manager/memberships/edit',$scope.vars).success(function(data){	
					//membershiplist.push(data); - how do we replace the record for above in the membership list?
					$modalInstance.close('closed');
				});		
			}
			
			//else new user record
			else{
				//alert("adding a new record: "+$scope.vars.username);
				$scope.http.post('/manager/memberships/add',$scope.vars).success(function(data){	
					membershiplist.push(data);
					$modalInstance.close('closed');
				});		
			}
			
			//then close the modal
		} else {
			////console.log('offeringForm.title is not in scope');
		}
	};
 
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
  };

  
   //Now rotas:
   
  app.controller('RotaController',['$http','$scope',function($http,$scope){
	rotalist = this;
	
	//alert("hello - in MembershipController but why not in Member Controller?");
	rotalist.rotas = [];

	$http.get('/manager/rotas').success(function(data){	
		 rotalist.rotas = data
	});
/* from project overlord20 ep4 ?
	$scope.membershipForm = {
		loading= false;
	};
	
	$scope.submitMembershipForm=function(){
		////console.log("submitted the membership form");
		$scope.membershipForm.loading=true;
		
	}*/
	
	
  }]);

  
 
  
  //from https://gist.github.com/rnkoaa/8333940
  
  app.controller("ModalRotaFormController", ['$scope', '$modal', '$log', '$http', 
 
    function ($scope, $modal, $log, $http) {
 
			$scope.http = $http;	
        $scope.showRotaForm = function (invars) {
            $scope.message = "Show Rota Form Button Clicked";
            //alert($scope.message);
 
			
			$scope.vars=(invars)? invars : {} ;
			//alert("invars: "+$scope.vars.username);
            var modalInstance = $modal.open({
                templateUrl: 'modal-rota-form.html',
                controller: ModalRotaInstanceCtrl,
                scope: $scope,
                resolve: {
                    rotaForm: function () {
                        return $scope.userRotaForm;
                    }
                }
            });
 
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
				});
        };
  }]);
 
  var ModalRotaInstanceCtrl = function ($scope, $modalInstance, rotaForm) {
	$scope.form = {}
	//alert("Scope message, , , :"+$scope.message);
	//alert("Scope http: "+$scope.http);
	$scope.submitRotaForm = function (rotalist) {
			//alert("Scope before valid http: "+$scope.http);
		if ($scope.form.rotaForm.$valid) {
			////console.log('user form is in scope');

			//alert("Scope another  http: "+$scope.http);
			//if we have an id then we are actioning an update
			if($scope.vars.id){
			
				//alert("updating record: "+$scope.vars.username);
				
				$scope.http.put('/manager/rota/edit',$scope.vars).success(function(data){	
					//membershiplist.push(data); - how do we replace the record for above in the membership list?
					$modalInstance.close('closed');
				});		
			}
			
			//else new user record
			else{
				//alert("adding a new record: "+$scope.vars.username);
				$scope.http.post('/manager/rota/add',$scope.vars).success(function(data){	
					rotalist.push(data);
					$modalInstance.close('closed');
				});		
			}
			
			//then close the modal
		} else {
			////console.log('offeringForm.title is not in scope');
		}
	};
 
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
  };
  
  
  app.controller('DatepickerDemoCtrl', ["$scope","$http","$window", function ($scope,$http,$window) {
  
	  $scope.message="";
  
	  $scope.today = function() {
		$scope.todaydt = new Date();
		$scope.startdt = new Date($scope.todaydt.getTime()-182*86400000);
		$scope.enddt = new Date();
		$scope.startdt.setDate(1);
		$scope.enddt.setDate(1);
	  }
	  $scope.today();

	  $scope.clear = function () {
		$scope.startdt = null;
		$scope.enddt = null;
	  };

	  // Disable weekend selection
	  // $scope.disabled = function(date, mode) {
		// return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	  // };

	  $scope.toggleMin = function() {
		$scope.minDate = $scope.minDate ? null : new Date($scope.todaydt.getTime()-365*2*86400000);;
	  };
	  $scope.toggleMin();
	  $scope.maxDate = new Date($scope.todaydt.getTime()+365*2*86400000);

	  $scope.togglestart = function($event) {
		console.log('status toggled: opened '+$scope.calstatus.startopened);
		$scope.calstatus.startopened =     !$scope.calstatus.startopened;
		$scope.calopen=!$scope.calopen;
		console.log('status toggled: calopen '+$scope.calopen);
		console.log('status toggled: opened '+$scope.calstatus.startopened);
	  };

	  $scope.toggleend = function($event) {
		console.log('status toggled: opened '+$scope.calstatus.endopened);
		$scope.calstatus.endopened =     !$scope.calstatus.endopened;
		$scope.calopen=!$scope.calopen;
		console.log('status toggled: calopen '+$scope.calopen);
		console.log('status toggled: opened '+$scope.calstatus.endopened);
	  };

	  $scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	  };

	  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	  $scope.format = $scope.formats[0];

	  $scope.calopen=false;
	  $scope.calstatus = {
		startopened: false,
		endopened: false
	  };

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
		if (mode === 'day') {
		  var dayToCheck = new Date(date).setHours(0,0,0,0);

		  for (var i=0;i<$scope.events.length;i++){
			var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

			if (dayToCheck === currentDay) {
			  return $scope.events[i].status;
			}
		  }
		}

		return '';
	  };
	  
	  $scope.summary=[]; // stores a summary of the totals per day per rota
	  var mydays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	  $scope.show_report = function(url){
			//query the URL and display to the screen
			
			var start = new Date($scope.startdt.getFullYear(),$scope.startdt.getMonth(),$scope.startdt.getDate(),0,0,0,0);
			var end = new Date($scope.enddt.getFullYear(),$scope.enddt.getMonth(),$scope.enddt.getDate(),0,0,0,0);
			$http.post(url,{start:start.getTime(),end:end.getTime(),output:'json'}).success(function(data){
				$scope.results = data['results'];	
				$scope.summary= data['summary'];
				// data.forEach(function totalup(sched){
					// if (sched.scd_date){
					// if($scope.result_hsh[sched.scd_user_username+" "+sched.scd_rota_code+' '+mydays[sched.scd_date.getDay()]]){
						// $scope.result_hsh[sched.scd_user_username+" "+sched.scd_rota_code+' '+mydays[sched.scd_date.getDay()]]++;
					// }else{
						// $scope.result_hsh[sched.scd_user_username+" "+sched.scd_rota_code+' '+mydays[sched.scd_date.getDay()]]=1;
					// }
					// }
				// });
				
			})
			
	  }
	  
	  
	  // $scope.run_report = function(){
		// //send our request and spit out as excel
		
			// var date = new Date($scope.startdt.getTime());
			// $scope.message="Your report for "+$scope.startdt+" until "+$scope.enddt+" "+$scope.enddt.getTime()+" will download shortly "+date;
			
			// var start = new Date($scope.startdt.getFullYear(),$scope.startdt.getMonth(),$scope.startdt.getDay(),0,0,0,0);
			// var end = new Date($scope.enddt.getFullYear(),$scope.enddt.getMonth(),$scope.enddt.getDay(),0,0,0,0);
			
			
			// $http.post('/manage/reports/full',{start:start.getTime(),end:end.getTime()}).success(function(data){	
				// //console.log("we have some members - of course : "+data);
				// //scheduleManager.members = data;
				// //$rootScope.members = scheduleManager.members; 
				// $scope.message="Your report should be downloading";
				// $window.location.href = '/download/excel'; // change this to a generic excel output so not to re-run query
				// $scope.message="Your report should be downloaded";
			// });
	  // }
	  
	}]);


  
})();