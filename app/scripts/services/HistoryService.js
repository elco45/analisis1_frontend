angular.module('AngularScaffold.Services').factory('HistoryService', ['$http',
	function($http){
		$http.defaults.withCredentials = true;
		var baseUrl = 'https://hotelmacarthur-backend.herokuapp.com/';
		//var baseUrl = 'http://localhost:8000/';
		return {
			GetReports: function(){
    		return $http.get(baseUrl + "v1/getReports");
  		},
			//CreateRoom: function(payload){
    		//return $http.post(baseUrl + "v1/registerRoom",payload);
  		//}
  	}	
	}
]);