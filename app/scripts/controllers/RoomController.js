angular.module('AngularScaffold.Controllers')
  .controller('RoomController', ['RoomService' ,  '$scope', '$state', '$stateParams','$rootScope', '$sessionStorage',
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
    $scope.dragged_Employee ={};
    $scope.menuWasOpened = false;
    //--------
    $scope.menuOptions = [
        ['Reservar por 1 dia', function (object) {
              $scope.menuWasOpened = true;
            console.log("1day")
            console.log(object.s)
            if(typeof object.s === "undefined"){
              object.f.time_reserved = "1day"
              $scope.selectRoom(object.f) 
              console.log(object.f)
            }
            else if(typeof object.f === "undefined"){    
              object.s.time_reserved = "1day"  
              $scope.selectRoom(object.s)         
              console.log(object.s)
            }
        }],
        null,
        ['Reservar por 2 dias', function (object) {
              $scope.menuWasOpened = true;
            console.log("2days")
            if(typeof object.s === "undefined"){
              object.f.time_reserved = "2day"                
              $scope.selectRoom(object.f) 
              console.log(object.f)
            }
            else if(typeof object.f === "undefined"){              
              object.s.time_reserved = "2day"  
              $scope.selectRoom(object.s) 
              console.log(object.s)
            }
        }],
        null,
        ['Cancel', function () {
            
        }]
    ];
    //--

    if($state.params.content){
      $scope.roomSelected = $state.params.content.selectedRoomsv1;
    }


    $scope.startCallback = function(event, ui, employee) {
      //console.log('You started draggin: ' + employee.name);
      $scope.dragged_Employee = employee;
    };
    $scope.stopCallback = function(event, ui) {
      console.log('--------------------------');
    };
    $scope.dropCallback = function(event, ui, type) {
      console.log(type)
      var index;

      console.log($scope.dragged_Employee)
      if(type == 0){
        for (var i = 0; i < $scope.empleados.length; i++) {
          if($scope.empleados[i].username == $scope.dragged_Employee.username){
            index = i
            break;
          }
        }
        $scope.empleados.splice(index,1);
        $scope.working_employee.push($scope.dragged_Employee);

      }/*else {
        for (var i = 0; i < $scope.working_employee.length; i++) {
          if($scope.working_employee[i].username == $scope.dragged_Employee.username){
            index = i
            break;
          }
        }
        $scope.working_employee.splice(index,1)
        $scope.empleados.push($scope.dragged_Employee)
      }
    */
      console.log($scope.empleados)
      console.log($scope.working_employee)

      
    };





    $scope.dragingEmployee = function(employee){
      $scope.draging_Employee = employee
      conslose.log($scope.draging_Employee)
    }

    $scope.chooseEmployee = function(){
      console.log("asd"); 
      var temp = $scope.empleados.splice(index,1);
      $scope.working_employee.push(temp[0]);
      
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
      } else {
        $scope.selectedRooms.push(room);
      }
      if(room.status){
        if(!$scope.menuWasOpened){
          room.status = 0
          room.time_reserved = "0hr"          
        }else{
          room.status = 1
          room.time_reserved = room.time_reserved
        }
        $scope.menuWasOpened = false;
      }
      else{
        room.status = 1
        if($scope.menuWasOpened){
          room.time_reserved = room.time_reserved
        }else
          room.time_reserved = "1day"
      }
      console.log(room)
      RoomService.UpdateRoom(room).then(function(response){
        console.log(response.data)
      })
      //$scope.selectedRooms.sort()
    };

    /*$scope.createAllRooms = function (){
     
      for (var i = 1; i < 26; i++) {
        var room_id = {
          status: 0,
          room_id:i +100,
          idUser: [],
          priority: 0,
          observation: "",
          time_reserved: "0hr"
        }
        RoomService.CreateRoom(room_id).then(function(response){
          console.log(response.data)
        })
      }
      for (var i = 1; i < 21; i++) {
        var room_id = {
          status: 0,
          room_id:i +200,
          idUser: [],
          priority: 0,
          observation: "",
          time_reserved: "0hr"
        }
        RoomService.CreateRoom(room_id).then(function(response){
          console.log(response.data)
        })
      }
    }*/

    $scope.getParameters = function(){
      $scope.working_employee_distribution = $stateParams.content.workingEmployee
      $scope.rooms_selected_distribution = $stateParams.content.roomsSelected
      console.log($sessionStorage.currentUser)
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
          if(response.data[i].status == 1)
            $scope.selectedRooms.push(response.data[i])
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



    //---------------
   


}]);

app.filter('slice', function() {
      return function(arr, start, end) {
        return arr.slice(start, end);
      };
    });