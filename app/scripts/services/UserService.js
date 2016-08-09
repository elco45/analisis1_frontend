angular.module('AngularScaffold.Services').factory('UserService', ['$http',
	function($http){
		$http.defaults.withCredentials = true;
		//var baseUrl = 'https://bodega-emelina-backend.herokuapp.com/';
		var baseUrl = 'http://localhost:8000/';
		return {
			Register: function(payload){
	          return $http.post(baseUrl + "v1/register", payload);
      		},
      		RegisterWithU:function(payload){
	          return $http.post(baseUrl + "v1/registerWithU", payload);
      		},
			GetControl: function(){
      	          return $http.get(baseUrl + "v1/getControl");
           		},
      		GetDocentes: function(){
      			return $http.get(baseUrl + "v1/docente");
      		},
      		CreateUniversity: function(payload){
      			return $http.post(baseUrl+"v1/createUniversity",payload);
      		},
      		GetUniversidades: function(){
      			return $http.get(baseUrl+"v1/getUniversidades");
      		},
      		GetUniversidadByName: function(payload){
      			return $http.post(baseUrl+"v1/getUniversityByName",payload);
      		},
          GetUniversidadById: function(payload){
                return $http.post(baseUrl+"v1/getUniversityById",payload);
          },
					AddFirstParentComment:function(payload){
						return $http.post(baseUrl + "v1/addParentComment", payload);
					},
					AddComment:function(payload){
						return $http.post(baseUrl + "v1/addComment", payload);
					},
					getCourseComments:function(payload){
						return $http.post(baseUrl + "v1/getCourseComments", payload);
					},
					getPoster:function(payload){
						return $http.post(baseUrl + "v1/getPoster", payload);
					}
	    };
}]);
