angular.module('AngularScaffold.Controllers')
  .controller('HistoryController', ['HistoryService' , '$scope', '$state', '$rootScope', '$sessionStorage',
  	function (HistoryService, $scope, $state, $rootScope, $sessionStorage) {
  		$scope.reportsList = [];

  		$scope.getReports = function(){
  			HistoryService.getReports().then(function(response){
      	$scope.reportsList = response.data
  			});
	  	}

	  	$scope.fakeReports = [
            {"employee_id":"1", "employee_name":"Srinivas Dasari", "room_number":"201", "date":"Monday", "observation":"", "room_state":"clean"},
            {"employee_id":"2", "employee_name":"Srinivas Tamada", "room_number":"201", "date":"Tuesday", "observation":"Bad","room_state":"dirty"},
            {"employee_id":"3", "employee_name":"Sri Harsha", "room_number":"103", "date":"Tuesday", "observation":"No remote","room_state":"clean w/prob"},
            {"employee_id":"4", "employee_name":"Lokesh Raghuram", "room_number":"108", "date":"Wednesday", "observation":"Bad","room_state":"dirty"},
            {"employee_id":"5", "employee_name":"Bala Ganesh", "room_number":"108", "date":"Thursday","observation":"TV broken", "room_state":"clean w/prob"},
            {"employee_id":"6", "employee_name":"Arun kumar", "room_number":"101", "date":"Friday", "observation":"","room_state":"clean"}
            ];
	  }]);
