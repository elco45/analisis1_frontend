angular.module('AngularScaffold.Controllers')
  .controller('UsersController', ['AuthService','UserService' , '$scope', '$state', '$rootScope', '$sessionStorage',
  	function (authService,UserService, $scope, $state, $rootScope, $sessionStorage) {
  	$scope.$sessionStorage = $sessionStorage;
  	$scope.title = "Login";
<<<<<<< HEAD
    $scope.selectedRooms = [];
    $scope.username = "";
    $scope.password = "";

=======
>>>>>>> a55b98e2aa6eb2771ffae1d24a803bcfe269c0f7
  	
    $scope.logout = function(){
        console.log($sessionStorage.currentUser);
        authService.Logout().then(function(response){
          	$sessionStorage.$reset();
          	$state.go("login");
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
        if ($scope.username != null && $scope.password != null) {
            UserData = {
              username: $scope.username,
              password: $scope.password
            }
            authService.Login(UserData).then(function(response){
                if(response.data != "error"){
                    console.log(response.data)
                    console.log($sessionStorage)
                    $sessionStorage.currentUser = response.data
                    if(!$sessionStorage.currentUser.employee_type){
                      $state.go("home")
                    }else{
                        console.log("aqui van a ir los empleados")
                    }
                }

            })
          	/*authService.Login($scope.signIn).then(function(response){
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
          	})*/
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

    
   	
  }]);
