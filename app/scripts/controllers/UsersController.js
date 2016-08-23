angular.module('AngularScaffold.Controllers')
  .controller('UsersController', ['AuthService','UserService' , '$scope', '$state', '$rootScope', '$sessionStorage',
  	function (authService,UserService, $scope, $state, $rootScope, $sessionStorage) {
  	$scope.$sessionStorage = $sessionStorage;
  	$scope.title = "Login";
  	
    $scope.logout = function(){
        authService.Logout().then(function(response){
          	$sessionStorage.$reset();
          	$state.go("home");
        }).catch(function(err){
          	BootstrapDialog.alert({
              	title: 'ERROR',
              	message: 'Sesión expirado, vuelva a conectarse',
              	type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
              	closable: true, // <-- Default value is false
              	buttonLabel: 'Cerrar', // <-- Default value is 'OK',
          	});
        })
    }

   	$scope.login = function(){
        if ($scope.signIn.email != null && $scope.signIn.password != null) {
          	authService.Login($scope.signIn).then(function(response){
            	if (response.data=='error') {
              		BootstrapDialog.alert({
                		title: 'ERROR',
		                message: 'El usuario o contraseña que usted ingreso es incorrecto!',
		                type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
		                closable: true, // <-- Default value is false
		                buttonLabel: 'Cerrar', // <-- Default value is 'OK',
		            });
            	}else{
              		$sessionStorage.currentUser = response.data;
              		if($sessionStorage.currentUser.IdUser <= 99999 && $sessionStorage.currentUser.IdUser >= 10000){
                		$state.go('docente_main');
              		}else if($sessionStorage.currentUser.IdUser >= 10000000){
                		$state.go('estudiante_main');
              		}
            	}
          	})
        }else{
          	BootstrapDialog.alert({
          	  	title: 'ERROR',
	            message: 'Porfavor ingrese un usuario y contraseña valido.',
	            type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
	            closable: true, // <-- Default value is false
	            buttonLabel: 'Cerrar', // <-- Default value is 'OK',
	       	});
        }
   	}

   	$scope.signUp =function(){
        $state.go("signUp")
   	}

    $scope.selected = function(){
      
    }

   	
  }]);
