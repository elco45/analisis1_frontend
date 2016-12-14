angular.module('AngularScaffold.Services').factory('ProblemService', ['$http', 
	function($http){
		//$http.defaults.withCredentials = true;
		var baseUrl = 'https://macarthur-backend.herokuapp.com/';
		//var baseUrl = 'http://localhost:8000/';
		return {	
			CrearProblemas: function(payload){
				console.log(payload)
				return $http.post(baseUrl + "v1/crearProblema", payload);
			},
			GetProblema: function(){
    			return $http.get(baseUrl + "v1/getProblemas");
  			},
  			Modificar: function(payload){
				console.log("lo que estoy enviando"+payload);
					return $http.post(baseUrl + "v1/modificarProblema",payload);
		    },
		    Eliminar: function(payload){
				console.log("lo que estoy enviando"+payload);
					return $http.post(baseUrl + "v1/eliminarProblema",payload);
		    },
		    GetProblema_por_habitacion: function(payload){
    			return $http.post(baseUrl + "v1/getProblemas_por_habitacion",payload);
  			}
	    };
}]);
