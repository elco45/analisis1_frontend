angular.module('AngularScaffold.Services').factory('RoomService', ['$http',
	function($http){
		$http.defaults.withCredentials = true;
		//var baseUrl = 'https://bodega-emelina-backend.herokuapp.com/';
		var baseUrl = 'http://localhost:8000/';
		return {
			GetEmpleado: function(){
	      		return $http.get(baseUrl + "v1/getEmployees");
      		},
			CreateRoom: function(payload){
	      		return $http.post(baseUrl + "v1/registerRoom",payload);
      		},
			GetRooms: function(){
	      		return $http.get(baseUrl + "v1/getAllRooms");
      		},
      		GetEmpRooms: function(payload){
      			console.log("bajckbsnijdc")
      			console.log(payload);
	      		return $http.post(baseUrl + "v1/getRoomEmpleado",payload);
      		}
      	}
      	
	}
]);