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
    $scope.display_distribution = [];

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

  	$scope.selectRoom = function(room) {
      var index = $scope.selectedRooms.indexOf(room.room_id);
      if(index !== -1) {
        $scope.selectedRooms.splice(index, 1);
        room.status = 0;
      } else {
        $scope.selectedRooms.push(room);
        room.status = 1;
      }
      //$scope.selectedRooms.sort()
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

    $scope.getParameters = function(){
      $scope.working_employee_distribution = $stateParams.content.workingEmployee
      $scope.rooms_selected_distribution = $stateParams.content.roomsSelected
      var cantidad = $scope.rooms_selected_distribution.length / $scope.working_employee_distribution.length
      var temporal = 0
      var cont_cuarto= 0
      var cont_worker = 0
      var cont_rooms = $scope.rooms_selected_distribution.length

      for (var i = $scope.working_employee_distribution.length; i >= 1; i--) {

        if (cont_rooms%i != 0) {
          temporal = Math.ceil(cantidad)
        }else{
          temporal = cantidad
        }

        

        var arreglo_room = []

        for (var j = 0; j < temporal ; j++) {
          arreglo_room.push($scope.rooms_selected_distribution[cont_cuarto])
          cont_cuarto++;
        };

        cont_rooms -= temporal
        cantidad = cont_rooms / (i-1)

        var distribution = {
          worker:$scope.working_employee_distribution[cont_worker],
          rooms: arreglo_room
        }

        cont_worker++

        $scope.display_distribution.push(distribution);
      };
      console.log($scope.display_distribution)
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

app.filter('slice', function() {
      return function(arr, start, end) {
        return arr.slice(start, end);
      };
    });