angular.module('AngularScaffold.Controllers')
  .controller('LoginController', ['AuthService','UserService' , '$scope', '$state', '$rootScope', '$sessionStorage',
    function (AuthService,UserService, $scope, $state, $rootScope, $sessionStorage) {
    $scope.$sessionStorage = $sessionStorage;
    $scope.username = "";
    $scope.password = "";
    $scope.usuario = { employee_type:"0", role:"0"};
    $scope.lisUsuario = [];
    $scope.usuarioSeleccionado ={};
    $sessionStorage.logged = false;
    $scope.employees = [];
    $scope.SelectedEmployee = {};
    $scope.validpwd = false;
    $scope.password2;
    $scope.show_logout = false;

    /*$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      console.log(toState.authenticate)
      console.log($scope.isLogged())
      if (toState.authenticate && !$scope.isLogged()){
        // User isn’t authenticated
        $state.transitionTo("start");
        event.preventDefault(); 
      }
    })*/

    $scope.isLogged = function(){
      if(typeof($sessionStorage.currentUser) === "undefined" || $state.current.name === 'login' || $state.current.name === 'start' || $state.current.name === 'pin_login'){
        return false
      }
      return true;
    }

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
           &&  !!$scope.usuario.id &&  !!$scope.usuario.civil_status && !!$scope.usuario.pin) {
        var file = document.querySelector('input[type=file]').files[0];
        var reader  = new FileReader();
        reader.readAsDataURL(file)
        reader.addEventListener("load" , function(){
          $scope.usuario.photo = reader.result
          UserService.Register($scope.usuario).then(function(algo){
            $scope.notsaved = false;
            swal("¡Exito!","success");
            $scope.usuario="";
            $scope.password2="";
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
     /* console.log(!!$scope.usuarioSeleccionado.name )
      console.log( !!$scope.usuarioSeleccionado.username )
      console.log( !!$scope.usuarioSeleccionado.cel)
      console.log( !!$scope.usuarioSeleccionado.tel )
      console.log(  !!$scope.usuarioSeleccionado.direction)
      console.log(   !!$scope.usuarioSeleccionado.id)
      console.log(   !!$scope.usuarioSeleccionado.civil_status)
      console.log(    !!$scope.usuarioSeleccionado.children )
      console.log(    !!$scope.usuarioSeleccionado.role );*/
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
     if (!!$scope.usuarioSeleccionado.name && !!$scope.usuarioSeleccionado.username && !!$scope.usuarioSeleccionado.cel 
          && !!$scope.usuarioSeleccionado.tel && !!$scope.usuarioSeleccionado.direction &&  !!$scope.usuarioSeleccionado.id
          &&  !!$scope.usuarioSeleccionado.civil_status && !!$scope.usuarioSeleccionado.password) {
          UserService.UpdateUser($scope.usuarioSeleccionado).then(function(algo){
        swal("¡Exito!","success");
        $scope.usuarioSeleccionado = " ";
      }).catch(function(err){
      });
    }else{
       swal("Error", "El no se puedo modificar el usuario proque no siguio el formato adecuado", "error");
     }
    }

}]);
