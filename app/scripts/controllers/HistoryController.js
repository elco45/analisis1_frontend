angular.module('AngularScaffold.Controllers')
  .controller('HistoryController', ['HistoryService' , '$scope', '$state', '$rootScope', '$sessionStorage', 
  	function (HistoryService, $scope, $state, $rootScope, $sessionStorage) {
  		$scope.reportsList = [];
  		$scope.selected = [];
  		$scope.userList = [];

  		$scope.getReports = function(){
  			HistoryService.GetReports().then(function(response){
      		$scope.reportsList = response.data
  			});
	  	};

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

			$scope.filter = function(){};

			$scope.filterByUsername = function(username){
				return $scope.filter[username.employee_username] || $scope.noFilter($scope.filter);
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

	  }]);
