angular.module('AngularScaffold.Services').factory('UserService', ['$http',
	function($http){
		$http.defaults.withCredentials = true;
		//var baseUrl = 'https://bodega-emelina-backend.herokuapp.com/';
		var baseUrl = 'http://localhost:8000/';
		return {
			Register: function(payload){
	            return $http.post(baseUrl + "v1/register", payload);
        	},
	        GetUser: function(){
      			return $http.get(baseUrl + "v1/getUser");
	        },
	        UpdateUser: function(payload){
	            return $http.post(baseUrl + "v1/updateUser", payload);
        	}
      	
	  };
}]);
