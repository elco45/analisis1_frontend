angular.module('AngularScaffold.Controllers')
  .controller('UsersController', ['AuthService','UserService' , '$scope', '$state', '$rootScope', '$sessionStorage',
  	function (authService,UserService, $scope, $state, $rootScope, $sessionStorage) {
  	$scope.$sessionStorage = $sessionStorage;
  	$scope.title = "Login";
    $scope.selectedRooms = [];
    $scope.username = "";
    $scope.password = "";

  	
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

    $scope.selectRoom = (roomNumber) => {
      var index = $scope.selectedRooms.indexOf(roomNumber.id);
      if(index !== -1) {
        $scope.selectedRooms.splice(index, 1);
        roomNumber.selected = false;
      } else {
        $scope.selectedRooms.push(roomNumber.id);
        roomNumber.selected = true;
      }
      $scope.selectedRooms.sort()
      console.log($scope.selectedRooms)
    };

    $scope.firstfloorMock = [
      {id: 101, name:"101", selected: false},
      {id: 102, name:"102", selected: false},
      {id: 103, name:"103", selected: false},
      {id: 104, name:"104", selected: false},
      {id: 105, name:"105", selected: false},
      {id: 106, name:"106", selected: false},
      {id: 107, name:"107", selected: false},
      {id: 108, name:"108", selected: false},
      {id: 109, name:"109", selected: false},
      {id: 110, name:"110", selected: false},
      {id: 111, name:"111", selected: false},
      {id: 112, name:"112", selected: false},
      {id: 113, name:"113", selected: false},
      {id: 114, name:"114", selected: false},
      {id: 115, name:"115", selected: false},
      {id: 116, name:"116", selected: false},
      {id: 117, name:"117", selected: false},
      {id: 118, name:"118", selected: false},
      {id: 119, name:"119", selected: false},
      {id: 120, name:"120", selected: false},
      {id: 121, name:"121", selected: false},
      {id: 122, name:"122", selected: false},
      {id: 123, name:"123", selected: false},
      {id: 124, name:"124", selected: false},
      {id: 125, name:"125", selected: false},
    ];
    $scope.secondfloorMock = [
      {id: 201, name:"201", selected: false},
      {id: 202, name:"202", selected: false},
      {id: 203, name:"203", selected: false},
      {id: 204, name:"204", selected: false},
      {id: 205, name:"205", selected: false},
      {id: 206, name:"206", selected: false},
      {id: 207, name:"207", selected: false},
      {id: 208, name:"208", selected: false},
      {id: 209, name:"209", selected: false},
      {id: 210, name:"210", selected: false},
      {id: 211, name:"211", selected: false},
      {id: 212, name:"212", selected: false},
      {id: 213, name:"213", selected: false},
      {id: 214, name:"214", selected: false},
      {id: 215, name:"215", selected: false},
      {id: 216, name:"216", selected: false},
      {id: 217, name:"217", selected: false},
      {id: 218, name:"218", selected: false},
      {id: 219, name:"219", selected: false},
      {id: 220, name:"220", selected: false}
    ];
    $scope.firstfloor = ["101","102","103","104","105","106","107","108","109","110","111","112",
        "113","114","115","116","117","118","119","120","121","122","123","124","125"];
    $scope.secondfloor = ["201","202","203","204","205","206","207","208","209","210","211","212",
        "213","214","215","216","217","218","219","220"];
   	
  }]);
