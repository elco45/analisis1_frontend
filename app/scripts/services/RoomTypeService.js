angular.module('AngularScaffold.Services').factory('RoomTypeService', ['$http',
	function($http){
		//$http.defaults.withCredentials = true;
		var baseUrl = 'https://macarthur-backend.herokuapp.com/';
		//var baseUrl = 'http://localhost:8000/';
		return {
			GetAllRoomType: function(){
    			return $http.get(baseUrl + "v1/getAllRoomType");
  			},
			CreateRoomType: function(payload){
    			return $http.post(baseUrl + "v1/createRoomType",payload);
  			},
			GetRoomType: function(payload){
    			return $http.post(baseUrl + "v1/getRoomType",payload);
  			}
		}
	}
]);
