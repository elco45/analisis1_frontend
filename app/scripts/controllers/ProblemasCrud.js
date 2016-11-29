angular.module('AngularScaffold.Controllers')
  .controller('ProblemasCrud', ['ProblemService' , '$scope', '$state', '$rootScope', '$sessionStorage',
    function (ProblemService, $scope, $state, $rootScope, $sessionStorage) {
    
    $scope.problema_nuevo={};
    $scope.seleccionado;
    $scope.seleccionado2;
   $scope.problemas = [];
   $scope.no_limpio = [];
   $scope.problema_modificado;


    $scope.crear_problema= function(){
      	var temp = {
      		tipo: $scope.problema_nuevo.tipo,
      		descripcion: $scope.problema_nuevo.descripcion
      	}
          
        ProblemService.CrearProblemas(temp).then(function(response){


        })
    }
    $scope.get_problema= function(){
      	
        ProblemService.GetProblema().then(function(response){
            $scope.problemas = response.data;
            console.log($scope.problemas);
        });
    }
      	
    
    $scope.update = function(){
    	$scope.no_limpio = [];
    	for (var i = 0; i < $scope.problemas.length; i++) {
    		if(Number($scope.seleccionado) === $scope.problemas[i].problem_type){
    			$scope.no_limpio.push($scope.problemas[i])
    		}
    	}
    }
    $scope.guardar_modificado = function(){
    	
    	var param ={
    		id: $scope.seleccionado2._id,
    		problem_description: $scope.problema_modificado,
    		problem_type: $scope.seleccionado2.problem_type
    	}
    	console.log(param)
    	ProblemService.Modificar(param).then(function(response2){
               console.log("fue guardar_modificado")
        });
    }
    $scope.Eliminar = function(){
    	
    	var param ={
    		id: $scope.seleccionado2._id,
    		
    	}
    	console.log(param)
    	ProblemService.Eliminar(param).then(function(response2){
               console.log("fue eliminado")
        });
    }


    }]);
