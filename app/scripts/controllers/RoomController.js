angular.module('AngularScaffold.Controllers')
  .controller('RoomController', ['RoomService' , '$scope', '$state', '$stateParams','$rootScope', '$sessionStorage',
  	function (RoomService, $scope, $state, $stateParams,$rootScope, $sessionStorage) {
  	$scope.$sessionStorage = $sessionStorage;
  	$scope.selectedRooms = [];
    $scope.empleados = [];
    $scope.working_employee = [];
    $scope.firstfloor = [];
    $scope.secondfloor = [];
    $scope.working_employee_distribution = [];
    $scope.rooms_selected_distribution = [];

    if($state.params.content){
      $scope.roomSelected = $state.params.content.selectedRoomsv1;
    }

    $scope.chooseEmployee = function(params,index){
      $scope.empleados.splice(index,1);
      $scope.working_employee.push(params);
      
    }//pasa empleadas que van a trabajar hoy
    
    $scope.no_longer_working_employee = function(params,index){
      $scope.working_employee.splice(index,1);
      $scope.empleados.push(params);
    }

    $scope.llenarEmpleado = function(){
        RoomService.GetEmpleado().then(function(response1){
          $scope.empleados = response1.data;
        });
    }

  	$scope.selectRoom = (room) => {
      var index = $scope.selectedRooms.indexOf(room.room_id);
      if(index !== -1) {
        $scope.selectedRooms.splice(index, 1);
        room.status = 0;
      } else {
        $scope.selectedRooms.push(room);
        room.status = 1;
      }
      //$scope.selectedRooms.sort()
      console.log($scope.selectedRooms)
    };

    /*$scope.createAllRooms = function (){
     
      for (var i = 1; i < 26; i++) {
        var room_id = {
          status: 0,
          room_id:i +100,
          idUser: "",
          priority: 0,
          observation: ""
        }
        RoomService.CreateRoom(room_id).then(function(response){
          console.log(response.data)
        })
      }
      for (var i = 1; i < 21; i++) {
        var room_id = {
          status: 0,
          room_id:i +200,
          idUser: "",
          priority: 0,
          observation: ""
        }
        RoomService.CreateRoom(room_id).then(function(response){
          console.log(response.data)
        })
      }
    }*/

    $scope.tryout = function(){
      $scope.working_employee_distribution = $stateParams.content.workingEmployee
      $scope.rooms_selected_distribution = $stateParams.content.roomsSelected
    }

    $scope.getRooms = function(){
      RoomService.GetRooms().then(function(response){
        for (var i = 0; i <response.data.length; i++) {
          if(i < 25)
            $scope.firstfloor.push(response.data[i])
          else
            $scope.secondfloor.push(response.data[i])
        }
      })
    }

    $scope.changeChooseEmps =function(params){
      $state.go("choose", {content:{
        selectedRoomsv1: $scope.selectedRooms
      }})
    }

    $scope.changeDist = function(habitaciones,empleados){

      $state.go("dist", {content: {
        roomsSelected: $scope.roomSelected,
        workingEmployee: $scope.working_employee
      }})
    }

    $scope.changeAddRooms = function(){
      $state.go("home")
    }

}]);