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
    $scope.isDragged = false;
    $scope.Room_hovered = 0;
    $scope.models = {
      selected:null,
      lists: {"empleados": [], "firstfloor": [], "secondfloor":[]} }
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
    //--lo que hizo elena ---

    $scope.init = function() {
      $scope.getRooms();
      $scope.llenarEmpleado();
      console.log($scope.empleados)
      $scope.models.lists.firstfloor = $scope.firstfloor;
      $scope.models.lists.secondfloor = $scope.secondfloor
      

    }



//---------------------------------------
  
          
     







    //------------------------- 

    if($state.params.content){
      $scope.roomSelected = $state.params.content.selectedRoomsv1;
    }
    $scope.room_hover = function(event, ui, room){
        $scope.Room_hovered = room.room_id;
        console.log(room.room_id)
    }

    $scope.startCallback = function(event, ui, employee) {
      //console.log('You started draggin: ' + employee.name);
      $scope.dragged_Employee = employee;
      console.log($scope.dragged_Employee)
      $scope.isDragged = true;
    };
    $scope.stopCallback = function(event, ui, employee) {
      /*if($scope.Room_hovered < 200){
        $scope.firstfloor[$scope.Room_hovered - 101].idUser.push(employee.username)
      }else{

        $scope.firstfloor[$scope.Room_hovered - 201].idUser.push(employee.username)
      }*/
      console.log($scope.firstfloor)
      console.log($scope.dragged_Employee)
    };
    $scope.dropCallback = function(event, ui,room) {

       $scope.sortRooms();
      console.log(room)
      console.log($scope.dragged_Employee)
     
      $scope.working_employee.push($scope.dragged_Employee);

      
    };

    $scope.sortRooms= function(){
      var j;
     var flag = true;   // set flag to true to begin first pass
     var temp;   //holding variable

     while ( flag )
     {
            flag= false;    //set flag to false awaiting a possible swap
            for( j=0;  j < $scope.firstfloor.length -1;  j++ )
            {
                   if ( $scope.firstfloor[ j ].room_id > $scope.firstfloor[j+1].room_id )   // change to > for ascending sort
                   {
                           temp = $scope.firstfloor[ j ];                //swap elements
                           $scope.firstfloor[ j ] = $scope.firstfloor[ j+1 ];
                           $scope.firstfloor[ j+1 ] = temp;
                          flag = true;              //shows a swap occurred  
                  } 
            } 
      } 
      flag = true;
       while ( flag )
     {
            flag= false;    //set flag to false awaiting a possible swap
            for( j=0;  j < $scope.secondfloor.length -1;  j++ )
            {
                   if ( $scope.secondfloor[ j ].room_id > $scope.secondfloor[j+1].room_id )   // change to > for ascending sort
                   {
                           temp = $scope.secondfloor[ j ];                //swap elements
                           $scope.secondfloor[ j ] = $scope.secondfloor[ j+1 ];
                           $scope.secondfloor[ j+1 ] = temp;
                          flag = true;              //shows a swap occurred  
                  } 
            } 
      } 
    }


    $scope.chooseEmployee = function(index){
      //console.log("asd"); 
      //var temp = $scope.empleados.splice(index,1);
      //console.log(temp)
      $scope.working_employee.push(index);
      
    }//pasa empleadas que van a trabajar hoy
    
    $scope.no_longer_working_employee = function(params,index){
      $scope.working_employee.splice(index,1);
      $scope.empleados.push(params);
    }

    $scope.llenarEmpleado = function(){
        RoomService.GetEmpleado().then(function(response1){
          $scope.empleados = response1.data;
          $scope.models.lists.empleados = response1.data 
          for (var i =0 ; i <  $scope.models.lists.empleados.length; i++) {
              $scope.models.lists.empleados.comun = $scope.models.lists.empleados.username
           }
          console.log(response1.data)
        });
    }

  	$scope.selectRoom = function(room) {
      var index = -1
      $scope.selectedRooms.indexOf(room.room_id);
      for (i =0; i < $scope.selectedRooms.lengths; i++) {
        if(room.room_id === $scope.selectedRooms[i].room_id){          
          index = i;
          break;          
        }
      }
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
        $scope.menuWasOpened = false;
        }
      }
      else{
        room.status = 1
        if($scope.menuWasOpened){
          room.time_reserved = room.time_reserved
          $scope.menuWasOpened = false;
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
          if(i < 25){
            $scope.firstfloor.push(response.data[i])
            $scope.models.lists.firstfloor.comun = response.data[i].room_id
          }
          else{
            $scope.models.lists.secondfloor.comun = response.data[i].room_id
            $scope.secondfloor.push(response.data[i])
          }
          if(response.data[i].status == 1){
            $scope.selectedRooms.push(response.data[i])
          }
        }

        $scope.sortRooms();
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