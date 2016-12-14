angular.module('AngularScaffold.Services').factory('RoomTypeService', ['$http','$httpProvider',
	function($http,$httpProvider){
		$httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
		$http.defaults.withCredentials = true;
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
