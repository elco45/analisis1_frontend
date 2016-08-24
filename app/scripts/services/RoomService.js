angular.module('AngularScaffold.Services').factory('RoomService', ['$http',
	function($http){
		$http.defaults.withCredentials = true;
		//var baseUrl = 'https://bodega-emelina-backend.herokuapp.com/';
		var baseUrl = 'http://localhost:8000/';
		return {
			GetEmpleado: function(){
	      		return $http.get(baseUrl + "v1/getEmployees");
      		}
      	}
      	
	}
]);