angular.module('AngularScaffold.Controllers')
  .controller('HistoryController', ['HistoryService' , '$scope', '$state', '$rootScope', '$sessionStorage',
  	function (HistoryService, $scope, $state, $rootScope, $sessionStorage) {
  		$scope.reportsList = [];
  		$scope.userList = [];
  		$scope.startDate =  new Date(2015, 11, 31)
      $scope.endDate = new Date(2019, 12, 1)

  		$scope.getReports = function(){
  			HistoryService.GetReports().then(function(response){
      		$scope.reportsList = response.data
  			});
	  	};

      $scope.getResolved = function(){
  			HistoryService.getResolved().then(function(response){
      		$scope.lista_problemas  = response.data
  			});
			  console.log($scope.lista_problemas);
	  	}
		$scope.cambiar_estado_problema = function(algo){
	       var params={
			    employee_username:algo.employee_username,
				room_number:  algo.room_number,
				problem_id: algo.problem_id,
				room_state: algo.room_state,
				date_reported: algo.date_reported,
				resolved: true
		   }
		    HistoryService.modResolved(params).then(function(response2){
               console.log(response2.data)
           });
  			console.log("numero de habitacion es: "+params.employee_username);
	  	}

	  	$scope.mockData = [
            {"room_number":"201", "employee_username":"dany", "room_state":"0", "problem_id":"0", "date_reported":"2016-11-20T05:00:00.000Z"},
            {"room_number":"201", "employee_username":"dany", "room_state":"1", "problem_id":"3", "date_reported":"2016-11-08T05:00:00.000Z"},
            {"room_number":"103", "employee_username":"dario", "room_state":"2", "problem_id":"5", "date_reported":"2016-10-26T05:00:00.000Z"},
            {"room_number":"116", "employee_username":"katherine", "room_state":"2", "problem_id":"3", "date_reported":"2016-10-29T05:00:00.000Z"},
            {"room_number":"114", "employee_username":"dario", "room_state":"1", "problem_id":"1", "date_reported":"2016-10-30T05:00:00.000Z"},
            {"room_number":"114", "employee_username":"katherine", "room_state":"1", "problem_id":"2", "date_reported":"2016-11-04T05:00:00.000Z"}
            ];

      $.each($scope.reportsList, function(i, el){
			  if($.inArray(el.employee_username, $scope.userList) === -1) {
			  	$scope.userList.push(el.employee_username);
			  }
			});

			$scope.filterUsernames = function(){};

			$scope.filterByUsername = function(username){
				return $scope.filterUsernames[username.employee_username] || $scope.noFilter($scope.filterUsernames);
			};

			$scope.noFilter = function(filterObj){
				return Object.
	      keys(filterObj).
	      every(function (key) { return !filterObj[key]; });
			};

			$scope.records = [];
			$scope.recordLimit = 8;
			for(var i=0; i<$scope.reportsList.length; i++) {
			   $scope.records.push($scope.reportsList);
			}

			$scope.printToCart = function(printSectionId) {
        var innerContents = document.getElementById(printSectionId).innerHTML;
        var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        popupWinindow.document.open();
        popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
        popupWinindow.document.close();
      }

      $scope.filterByDate = function(property, lowbound, highbound){
      	return function (){
      		if (true) {
      			return true;
      		}
      		return false;
      	}
      };

	  }]);
