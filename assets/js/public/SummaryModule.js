
(function(){  

  //change otherstuff from an array to a hash - >rename myschedule
  //change otherstuff from an array to a hash - >rename myschedule

  var app = angular.module('SummaryModule',['ui.bootstrap','myReuseableMod']);

  app.filter('easydate', function () {
   return function (indate) {
	 var tmpdate = new Date(indate);
     return tmpdate.toDateString();
   };
  });

  // get the summary list and wait for data re changes
  app.controller('SummaryController', ['$scope','$rootScope','$http','$log', 'handleMySocketsSrvc', function ($scope,$rootScope,$http,$log,handleMySocketsSrvc) {
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
	 // to allow socket library to be used across pages
	mysched={}
	mysched.me=""
	
	//see custom.js placed the socket handling in a factory
	handleMySocketsSrvc(io);
	
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