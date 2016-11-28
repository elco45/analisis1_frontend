angular.module('AngularScaffold.Services').factory('HistoryService', ['$http',
	function($http){
		$http.defaults.withCredentials = true;
		//var baseUrl = 'https://hotelmacarthur-backend.herokuapp.com/';
		var baseUrl = 'http://localhost:8000/';
		return {
			GetReports: function(){
    			return $http.get(baseUrl + "v1/getReports");
  			},
			CreateRegister: function(payload){
    			return $http.post(baseUrl + "v1/createRegister",payload);
  			},
			getResolved: function(){
    			return $http.get(baseUrl + "v1/getResolved");
  			},
			modResolved: function(payload){
				console.log("servise fron: "+payload)
    			return $http.post(baseUrl + "v1/updateResolved",payload);
  			},
				GetSeenReports: function(){
	    			return $http.get(baseUrl + "v1/getSeenReports");
  		},
			ReportModifySeen: function(payload){
				console.log(payload);
					return $http.post(baseUrl + "v1/reportModifySeen",payload);
		}
		}
	}
]);
