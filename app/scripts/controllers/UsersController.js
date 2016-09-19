angular.module('AngularScaffold.Controllers')
  .controller('UsersController', ['AuthService','UserService' , '$scope', '$state', '$rootScope', '$sessionStorage',
  	function (authService,UserService, $scope, $state, $rootScope, $sessionStorage) {
  	$scope.$sessionStorage = $sessionStorage;
  	$scope.title = "Login";
    $scope.username = "";
    $scope.password = "";
  	$scope.usuario = { employee_type:"0", role:"0"};
    $scope.lisUsuario = []; 
    $scope.usuarioSeleccionado ={ employee_type:"0", role:"0", status:"0" };
    $sessionStorage.logged = false;

    $scope.getUser = function(){
     
      UserService.GetUser().then(function(response){
      $scope.lisUsuario = response.data
      });
    }

    $scope.mostraUsuario = function(){
          console.log($scope.usuarioSeleccionado);
    }
    $scope.crear_usuario = function(){
      console.log("entro")
      var file = document.querySelector('input[type=file]').files[0];
      var reader  = new FileReader();
      reader.readAsDataURL(file)
      reader.addEventListener("load" , function(){
        $scope.usuario.photo = reader.result
        UserService.Register($scope.usuario).then(function(algo){
          console.log("Guardado con exito");
          $scope.usuario="";
        }).catch(function(err){
        
      },false)
      
       
      });
    };


    $scope.decode = function(file,fileName){
      var byteString;
      console.log("----decode---")
      if (file.split(',')[0].indexOf('base64') >= 0){
          byteString = atob(file.split(',')[1]);
      }else{
          byteString = unescape(file.split(',')[1]);
      }
      console.log(file)
      var mimeString = file.split(',')[0].split(':')[1].split(';')[0];
      /*var element = document.createElement('a');
      element.setAttribute('href', 'data:' + mimeString + ';base64,' + btoa(byteString));
      element.setAttribute('download', fileName);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      console.log(byteString)
      console.log(mimeString)
      console.log(element)*/


    }//fin decode

    $scope.modificar_usuario = function(){
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


    $scope.isLogged = function(){

      console.log($state.current.name)
      if(typeof($sessionStorage.currentUser) === "undefined" || $state.current.name === 'login'){
        return false
      }      
      return true;
    }

      	
    $scope.logout = function(){ 
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
                    $sessionStorage.currentUser = response.data
                    console.log(response.data)
                    $sessionStorage.logged = true;
                    if(response.data.role === 0){
                      $scope.actualUser = false;
                      console.log($scope.actualUser);
                      $state.go("home")
                    }
                    if(response.data.role === 1){
                      $scope.actualUser = true;
                      $state.go("emp")
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
