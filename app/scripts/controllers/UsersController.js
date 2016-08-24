angular.module('AngularScaffold.Controllers')
  .controller('UsersController', ['AuthService','UserService' , '$scope', '$state', '$rootScope', '$sessionStorage',
  	function (authService,UserService, $scope, $state, $rootScope, $sessionStorage) {
  	$scope.$sessionStorage = $sessionStorage;
  	$scope.title = "Login";
    $scope.username = "";
    $scope.password = "";
  	$scope.usuario ={};
    $scope.lisUsuario = []; 
    $scope.usuarioSeleccionado;
    

    $scope.getUser = function(){
     
      UserService.GetUser().then(function(response){
      $scope.lisUsuario = response.data
       
        console.log($scope.lisUsuario)
      });


    }
    $scope.mostraUsuario = function(){
          console.log($scope.usuarioSeleccionado);
    }
    $scope.crear_usuario = function(){
      console.log("david");
      console.log("Entre");
      console.log($scope.usuario);
      console.log($scope.usuario.rol);
      console.log($scope.usuario.tipo);
      UserService.Register($scope.usuario).then(function(algo){
        console.log("Guardado con exito");
        $scope.usuario="";
      }).catch(function(err){
       
      });
    };

    $scope.modificar_usuario = function(){
      console.log("david");
      console.log("Entre");
      console.log($scope.usuarioSeleccionado);
      console.log($scope.usuarioSeleccionado.name)
      var temp = {
        password : $scope.usuarioSeleccionado.password,
        username : $scope.usuarioSeleccionado.username,
        nombre : $scope.usuarioSeleccionado.name,
        employee_type : $scope.usuarioSeleccionado.employee_type,
        status:$scope.usuarioSeleccionado.status,
        role: $scope.usuarioSeleccionado.role
      }


      UserService.UpdateUser(temp).then(function(algo){
        console.log("Guardado con exito");
        $scope.usuarioSeleccionado = " ";
      }).catch(function(err){
       
      });
    }


      	
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

