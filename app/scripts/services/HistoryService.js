angular.module('AngularScaffold.Services').factory('HistoryService', ['$http',
	function($http){
		$http.defaults.withCredentials = true;
		$http.defaults.headers = {};
		var baseUrl = 'https://macarthur-backend.herokuapp.com/';
		//var baseUrl = 'http://localhost:8000/';
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
    			return $http.post(baseUrl + "v1/updateResolved",payload);
  			},
			GetSeenReports: function(){
    			return $http.get(baseUrl + "v1/getSeenReports");
  			},
			ReportModifySeen: function(payload){
				return $http.post(baseUrl + "v1/reportModifySeen",payload);
			},
			get_problemas_para_unahabitacion: function(payload){
    			return $http.post(baseUrl + "v1/getproble_para_habitacion",payload);
  			},
  			GetReport: function(payload){
  				return $http.post(baseUrl + "v1/getReport",payload);
  			}
		}
	}
]);
