angular.module('AngularScaffold.Controllers')
  .controller('ProblemasCrud', ['ProblemService' , '$scope', '$state', '$rootScope', '$sessionStorage',
    function (ProblemService, $scope, $state, $rootScope, $sessionStorage) {
    //dario maricon
    $scope.problema_nuevo={};
    $scope.seleccionado;
    $scope.seleccionado2;
    $scope.problemas = [];
    $scope.no_limpio = [];
    $scope.problema_modificado;


    $scope.crear_problema= function(){
        if($scope.problema_nuevo.tipo === undefined){
            console.log("METELE SWEET ALERT AQUI")
            return;
        }else{
            var temp = {
                tipo: $scope.problema_nuevo.tipo,
                descripcion: $scope.problema_nuevo.descripcion
            }
            ProblemService.CrearProblemas(temp).then(function(response){
                $scope.get_problema();
                swal({
                  title: "Guardado con Exito!",
                  //text: "You will not be able to recover this imaginary file!",
                  type: "success",
                  //showCancelButton: true,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "OK!",
                  //cancelButtonText: "No, Continuar!",
                  closeOnConfirm: false,
                  //closeOnCancel: false
                },
                function(isConfirm){
                  if (isConfirm) {
                    window.location.reload(false);
                  }
                });
            }) 
        }
    }

    $scope.get_problema= function(){
      ProblemService.GetProblema().then(function(response){
        $scope.problemas = response.data;
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
        if ($scope.seleccionado === undefined) {
            console.log("poner sweet alert aqui!!!")
            return;
        }else{
        	var param ={
        		id: $scope.seleccionado2._id,
        		problem_description: $scope.problema_modificado,
        		problem_type: $scope.seleccionado2.problem_type
        	}
        	ProblemService.Modificar(param).then(function(response2){
                swal({
                  title: "Desea guardar los cambios realizados",
                  //text: "You will not be able to recover this imaginary file!",
                  type: "success",
                  showCancelButton: true,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "Si, Guardar!",
                  cancelButtonText: "No, Continuar!",
                  closeOnConfirm: false,
                  //closeOnCancel: false
                },
                function(isConfirm){
                  if (isConfirm) {
                    window.location.reload(false);
                  }
                }); 
            });            
        }
    }

    $scope.Eliminar = function(){
    	var param ={
    		id: $scope.seleccionado2._id,
    	}
    	ProblemService.Eliminar(param).then(function(response2){
            window.location.reload(false);
        });
    }

    // Salva el tab activo en el localStorage
    $scope.setActiveTab = function (activeTab) {
        sessionStorage.setItem("activeTab2", activeTab);
    };

    // Get el tab activo en el localStorage
    $scope.getActiveTab = function () {
    	if(sessionStorage.getItem("activeTab2")){
    		return sessionStorage.getItem("activeTab2");
    	}else{
    		return 1;
    	}

    };
}]);
