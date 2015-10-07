

(function(){  


  var app = angular.module('MembershipModule',['ui.bootstrap']);
  
	

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
		console.log("submitted the membership form");
		$scope.membershipForm.loading=true;
		
	}*/
	
	
  }]);

  
 

  
  
  
  //from https://gist.github.com/rnkoaa/8333940
  
  app.controller("ModalAccountFormController", ['$scope', '$modal', '$log', '$http', function ($scope, $modal, $log, $http) {
 
			$scope.http = $http;	
        $scope.showForm = function (invars) {
            $scope.message = "Show Form Button Clicked";
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
 
  var ModalInstanceCtrl = function ($scope, $modalInstance, userForm) {
	$scope.form = {}
	//alert("Scope message, , , :"+$scope.message);
	//alert("Scope http: "+$scope.http);
	$scope.submitForm = function (membershiplist) {
			//alert("Scope before valid http: "+$scope.http);
		if ($scope.form.userForm.$valid) {
			console.log('user form is in scope');

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
			console.log('offeringForm.title is not in scope');
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
		console.log("submitted the membership form");
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
			console.log('user form is in scope');

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
			console.log('offeringForm.title is not in scope');
		}
	};
 
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
  };
  
})();