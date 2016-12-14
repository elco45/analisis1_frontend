angular.module('AngularScaffold.Services').factory('RoomService', ['$http',
	function($http){
		$http.defaults.withCredentials = true;
            $http.defaults.headers = {};
		var baseUrl = 'https://macarthur-backend.herokuapp.com/';
		//var baseUrl = 'http://localhost:8000/';
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
			UpdateRoom: function(payload){
	      		return $http.post(baseUrl + "v1/updateRoom",payload);
      		},
      		SaveDistributedRooms: function(payload){
      			return $http.post(baseUrl + "v1/saveDistributedRooms",payload);
      		},
      		SwapDistributedRooms: function(payload){
      			return $http.post(baseUrl + "v1/swapDistributedRooms",payload);
      		},
      		GetEmpRooms: function(payload){
	      		return $http.post(baseUrl + "v1/getRoomEmpleado",payload);
      		},
      		CheckForChanges: function(payload){
	      		return $http.post(baseUrl + "v1/checkForChanges",payload);
      		},
      		UpdateControl: function(payload){
	      		return $http.post(baseUrl + "v1/updateControl",payload);
      		},
                  UpdatePriorityAfterSplice: function(payload){
                        return $http.post(baseUrl + "v1/updatePriorityAfterSplice",payload);
                  },
                  SaveSettings: function(payload){
                        return $http.post(baseUrl + "v1/saveSettings",payload);
                  },
                  GetSettings: function(){
                        return $http.get(baseUrl + "v1/getSettings");
                  },
                  RequestTime: function(){
                        return $http.get(baseUrl + "v1/requestTime");
                  },
                  GetPlantillas: function(){
                        return $http.get(baseUrl + "v1/getPlantillas");
                  },
                  CreatePlantillas: function(payload){
                        return $http.post(baseUrl + "v1/createPlantillas",payload);
                  },
                  CargarPlantillas: function(payload){
                        return $http.post(baseUrl + "v1/cargarPlantillas",payload);
                  },
                  UpdateRoomProblems: function(payload){
                        return $http.post(baseUrl + "v1/updateRoomProblems",payload);
                  }
      	}
	}
]);
