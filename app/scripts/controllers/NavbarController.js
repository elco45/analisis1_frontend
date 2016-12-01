angular.module('AngularScaffold.Controllers')
  .controller('NavbarController', ['AuthService','RoomService','UserService' , '$scope', '$state', '$rootScope', '$sessionStorage',
  	function (authService,RoomService,UserService, $scope, $state, $rootScope, $sessionStorage) {

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
        console.log(response.data)
      })
    }
    //fin settings

  }]);
