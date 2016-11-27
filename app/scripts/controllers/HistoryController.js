angular.module('AngularScaffold.Controllers')
  .controller('HistoryController', ['HistoryService' , '$scope', '$state', '$rootScope', '$sessionStorage', 
  	function (HistoryService, $scope, $state, $rootScope, $sessionStorage) {
  		$scope.reportsList = [];
  		$scope.userList = [];
			$scope.records = [];
  		$scope.startDate =  new Date(2015, 11, 31);
      $scope.endDate = new Date(2019, 12, 1);
      $scope.recordLimit = 8;

  		$scope.getReports = function(){
  			HistoryService.GetReports().then(function(response){
      		$scope.reportsList = response.data;
      		for(var i=0; i<$scope.reportsList.length; i++) {
					  $scope.records.push($scope.reportsList); 
					  if ($scope.userList.indexOf($scope.reportsList[i].employee_username) === -1) {
					   	$scope.userList.push($scope.reportsList[i].employee_username);
					  }
					}
  			});
	  	};

			$scope.filter = function(){};

			$scope.filterByUsername = function(username){
				return $scope.filter[username.employee_username] || $scope.noFilter($scope.filter);
			};

			$scope.noFilter = function(filterObj){
				return Object.
	      keys(filterObj).
	      every(function (key) { return !filterObj[key]; });
			};

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
