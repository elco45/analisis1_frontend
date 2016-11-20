angular.module('AngularScaffold.Controllers')
  .controller('HistoryController', ['HistoryService' , '$scope', '$state', '$rootScope', '$sessionStorage',
  	function (HistoryService, $scope, $state, $rootScope, $sessionStorage) {
  		$scope.reportsList = [];

  		$scope.getReports = function(){
  			HistoryService.getReports().then(function(response){
      	$scope.reportsList = response.data
  		}
    
	  }