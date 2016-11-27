angular.module('AngularScaffold.Controllers',['bc.AngularKeypad'])
  .controller('UsersController', ['AuthService','RoomService','UserService' , '$scope', '$state', '$rootScope', '$sessionStorage',
  	function (authService,RoomService,UserService, $scope, $state, $rootScope, $sessionStorage) {
  	$scope.$sessionStorage = $sessionStorage;
  	$scope.title = "Login";
    $scope.username = "";
    $scope.password = "";
  	$scope.usuario = { employee_type:"0", role:"0"};
    $scope.lisUsuario = [];
    $scope.usuarioSeleccionado ={ employee_type:"0", role:"0", status:"0" };
    $sessionStorage.logged = false;
    $scope.employees = [];
    $scope.SelectedEmployee = {};
    
    $scope.is_admin_logged = false;
    
    $scope.show_logout = false;
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
          swal("¡Exito!","success");
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
        role: $scope.usuarioSeleccionado.role,
        pin: $scope.usuarioSeleccionado.pin
      }


      UserService.UpdateUser(temp).then(function(algo){
        console.log("Guardado con exito");
        swal("¡Exito!","success");
        $scope.usuarioSeleccionado = " ";
      }).catch(function(err){

      });
    }


    $scope.isLogged = function(){

      if(typeof($sessionStorage.currentUser) === "undefined" || $state.current.name === 'login' || $state.current.name === 'start' || $state.current.name === 'pin_login'){
        return false
      }
      return true;
    }


    $scope.logout = function(){
        authService.Logout().then(function(response){
          	$sessionStorage.$reset();
          	$state.go("start");
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
                }else{
                  swal("Error", "Ingrese los datos correctos", "error");
                }

            }).catch(function(err){
              swal("Error", "Ingrese los datos correctos", "error");
              console.log((err.data.error + " " + err.data.message));
            });
        }else{
          swal("Error", "Ingrese los datos correctos", "error");
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

    //checkups for ng-if in navbar
    $scope.check_login_allowed = function(){
     $scope.clear_user()
     RoomService.GetSettings().then(function(response){        
        if(!response.data.pin_login){
          $state.go("login");
        }
        
      })
   }
   
    $scope.clear_user = function(){
      $sessionStorage.currentUser = {};
    }
    $scope.show_for_admin= function(){
      if(typeof($sessionStorage.currentUser) === "undefined")
        return false;
      if($sessionStorage.currentUser.role == 0 && $state.current.name != 'login' && $state.current.name != 'start' 
        && $state.current.name != 'pin_login'){
        $scope.is_admin_logged = true;    
        return true;
      }
      return false;
   }
   $scope.show_logout= function(){

      //console.log($sessionStorage.currentUser.logged)
      try{
        if(typeof($sessionStorage.currentUser.username) === "undefined")
          return false;
         if($sessionStorage.currentUser.logged)
          return false;
        if($state.current.name == 'login' || $state.current.name == 'start' 
          || $state.current.name == 'pin_login'){   
          return false;
        }
      return true;


      }catch(err){
        
      }
     
   }
   //done with checkups
    $scope.go_admin_login = function(){
      $state.go("login")
    }

    $scope.go_emp_login = function(){
      $state.go("pin_login")
    }
   	
    $scope.getEmployees = function(){     
      RoomService.GetEmpleado().then(function(response){
        $scope.employees = response.data
      });
    }

    $scope.select_current_emp = function(employee){
      $scope.SelectedEmployee = employee;
    }

    $scope.verificarDatos = function(numbers,employee){
      if (employee.pin === null) {
        var temp = {
          username: employee.username,
          pin: numbers
        }
        UserService.ModifyPin(temp).then(function(response){
          console.log(response.data)
        });
      }else if(employee.pin != null && employee.username != null){
          UserData = {
            username: employee.username,
            pin: numbers
          }
          authService.LoginWithPin(UserData).then(function(response){
              if(response.data != "error"){
                  $sessionStorage.currentUser = response.data
                  console.log(response.data)
                  $sessionStorage.logged = true;
                  if(response.data.role === 1){
                    $scope.actualUser = true;
                    $state.go("emp")
                  }
              }

          })
          $('#numpad').modal('hide');
          $('.modal-backdrop').remove();
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

    $scope.clickIconButton = function(){
      if($scope.$sessionStorage.currentUser === undefined){
        $state.go("start");
      }else if($scope.$sessionStorage.currentUser.role === 0){
        $state.go("home");
      }else if($scope.$sessionStorage.currentUser.role === 1){
        $state.go("emp");
      }
    }

  }]);
