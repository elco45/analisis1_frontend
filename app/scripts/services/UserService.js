angular.module('AngularScaffold.Services').factory('UserService', ['$http',
	function($http){
		$http.defaults.withCredentials = true;
		//var baseUrl = 'https://bodega-emelina-backend.herokuapp.com/';
		var baseUrl = 'http://localhost:8000/';
		return {
			Register: function(payload){
				console.log("Services");
				console.log(payload);
	            return $http.post(baseUrl + "v1/register", payload);
        	},
	        GetUser: function(){
	        	console.log("services llego")
      			return $http.get(baseUrl + "v1/getUser");
	        },
	        UpdateUser: function(payload){
				console.log(payload);
	            return $http.post(baseUrl + "v1/updateUser", payload);
        	}
      	
	  };
}]);
