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
    $scope.validpwd = false;
    $scope.password2;
    $scope.is_admin_logged = false;
    $scope.show_logout = false;
    $scope.notsaved = true;

    $scope.getUser = function(){
      UserService.GetUser().then(function(response){
      $scope.lisUsuario = response.data
      });
    }

    $scope.mostraUsuario = function(){
      console.log($scope.usuarioSeleccionado);
    }

    $scope.verifyPassword =  function(){
      var pwd = document.getElementById("password").value;
      var pwd2 = document.getElementById("password_2").value;
      var pwdm = document.getElementById("passwordm").value;
      var pwd2m = document.getElementById("password_2m").value;

      console.log("Pass: " + pwd)
      console.log("Pass2: " + pwd2)

      if (pwd === null || pwdm === null) {
        $scope.validpwd=false;
      } else if (pwd === pwd2) {
        for (var i = 0; i < pwd.length ; i++) {
          if (pwd.charAt(i) === pwd2.charAt(i)) {
            $scope.validpwd=true;
          } else {
            $scope.validpwd=false;
          }
        }
      } else if (pwdm === pwd2m) {
        for (var i = 0; i < pwdm.length ; i++) {
          if (pwdm.charAt(i) === pwd2m.charAt(i)) {
            $scope.validpwd=true;
          } else {
            $scope.validpwd=false;
          }
        }
      } else {
        $scope.validpwd=false;
      }
    }

    $scope.crear_usuario = function(){
      /*
     console.log(!!$scope.usuario.name )
      console.log( !!$scope.usuario.username )
       console.log( !!$scope.usuario.cel)
         console.log( !!$scope.usuario.tel )
         console.log(  !!$scope.usuario.direction)
        console.log(   !!$scope.usuario.id)
         console.log(   !!$scope.usuario.civil_status)
         console.log(    !!$scope.usuario.children )
         console.log(    !!$scope.usuario.role );
         */
      if (!!$scope.usuario.name && !!$scope.usuario.username && !!$scope.usuario.cel && !!$scope.usuario.tel && !!$scope.usuario.direction
           &&  !!$scope.usuario.id &&  !!$scope.usuario.civil_status) {
        var file = document.querySelector('input[type=file]').files[0];
        var reader  = new FileReader();
        reader.readAsDataURL(file)
        reader.addEventListener("load" , function(){
          $scope.usuario.photo = reader.result
          UserService.Register($scope.usuario).then(function(algo){
            $scope.notsaved = false;
            swal("¡Exito!","success");
            $scope.usuario="";
            document.getElementById("nac").value = "";
          }).catch(function(err){
            swal("Error", "Error al guardar el usuario", "error");
        },false)
        });
      }else{
      
        swal("","Debe llenar todos los campos correctamente para poder guardar el usuario");
      }
    };

    $scope.decode = function(file,fileName){
      var byteString;
      if (file.split(',')[0].indexOf('base64') >= 0){
          byteString = atob(file.split(',')[1]);
      }else{
          byteString = unescape(file.split(',')[1]);
      }
      var mimeString = file.split(',')[0].split(':')[1].split(';')[0];
    }//fin decode

    $scope.modificar_usuario = function(){
      var temp = {
        password : $scope.usuarioSeleccionado.password,
        username : $scope.usuarioSeleccionado.username,
        nombre : $scope.usuarioSeleccionado.name,
        employee_type : $scope.usuarioSeleccionado.employee_type,
        status:$scope.usuarioSeleccionado.status,
        role: $scope.usuarioSeleccionado.role,
        pin: $scope.usuarioSeleccionado.pin,
        photo: $scope.usuarioSeleccionado.photo
      }

      UserService.UpdateUser(temp).then(function(algo){
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
        RoomService.GetSettings().then(function(response){
          if($sessionStorage.currentUser.role === 0 && response.data.pin_login === true){
            $sessionStorage.$reset();
            $state.go("login");
          }else if($sessionStorage.currentUser.role === 1 && response.data.pin_login === true){
            $sessionStorage.$reset();
            $state.go("pin_login");
          }else if(response.data.pin_login === false){
            $state.go("login")
          }
        })
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
              $sessionStorage.logged = true;
              if(response.data.role === 0){
                $scope.actualUser = false;
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
        $scope.pin_login = response.data;
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
      try{
        if(typeof($sessionStorage.currentUser.username) === "undefined")
          return false;
        if($sessionStorage.currentUser.logged)
          return false;
        if($state.current.name == 'login' || $state.current.name == 'start'|| $state.current.name == 'pin_login'){
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

    $scope.go_start = function(){
      $state.go("start")
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
      if(employee.pin === null){
        BootstrapDialog.confirm({
          title: 'SUCCESS',
          message: 'Porfavor ingresar un PIN.',
          type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
          closable: true, // <-- Default value is false
          buttonLabel: 'Cerrar', // <-- Default value is 'OK',
        });
      }
    }

    $scope.verificarDatos = function(numbers,employee){
      if (employee.pin === null) {
        var temp = {
          username: employee.username,
          pin: numbers
        }
        UserService.ModifyPin(temp).then(function(response){
          BootstrapDialog.confirm({
            title: 'SUCCESS',
            message: 'Pin creado exitosamente.',
            type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
            closable: true, // <-- Default value is false
            buttonLabel: 'Cerrar', // <-- Default value is 'OK',
            callback: function(result) {
              // result will be true if button was click, while it will be false if users close the dialog directly.
              location.reload();
            }
          });
        });
      }else if(employee.pin != numbers){
        BootstrapDialog.alert({
          title: 'ERROR',
          message: 'Porfavor ingrese un pin valido.',
          type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
          closable: true, // <-- Default value is false
          buttonLabel: 'Cerrar', // <-- Default value is 'OK',
        });
      }else if(employee.pin != null && employee.username != null){
        UserData = {
          username: employee.username,
          pin: numbers
        }
        authService.LoginWithPin(UserData).then(function(response){
          if(response.data != "error"){
            $sessionStorage.currentUser = response.data
            $sessionStorage.logged = true;
            if(response.data.role === 1){
              $scope.actualUser = true;
              $state.go("emp")
            }
          }
        })
        $('#numpad').modal('hide');
        $('.modal-backdrop').remove();
      }
    }

    $scope.infoRC;
    //settings
    $scope.save_settings = function(){
      var settings = {
        pin_login: document.getElementById("pin_login_check").checked
      }
      console.log(settings)
      RoomService.SaveSettings(settings).then(function(response){
        console.log(response.data)
      })
    }

    $scope.get_settings = function(){
      RoomService.GetSettings().then(function(response){
        document.getElementById("pin_login_check").checked = response.data.pin_login;
      })
    }
    //fin settings

    $scope.infoRC;
    
    //settings
    $scope.save_settings = function(){
      var settings = {
        pin_login: document.getElementById("pin_login_check").checked
      }
      RoomService.SaveSettings(settings).then(function(response){

      })
    }

    $scope.get_settings = function(){
      RoomService.GetSettings().then(function(response){
        document.getElementById("pin_login_check").checked = response.data.pin_login;
      })
    }
    //fin settings

    $scope.clickIconButton = function(){
      Notify("Stop! Hammer time", null, null, 'danger');
      RoomService.GetSettings().then(function(response){
        if(response.data.pin_login === true){
          if($sessionStorage.currentUser.role === 0 ){
            $state.go("home");
          }else if($sessionStorage.currentUser.role === 1){
            $state.go("emp");
          }else if($scope.$sessionStorage.currentUser){
            $state.go("start")
          }
        }else{
          $state.go("login");
        }
      })
    }
}]);
