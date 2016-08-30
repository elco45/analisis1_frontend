angular.module('AngularScaffold.Controllers')
  .controller('RoomController', ['RoomService' ,'$q',  '$scope', '$state', '$stateParams','$rootScope', '$sessionStorage',
    function (RoomService, $q,$scope, $state, $stateParams,$rootScope, $sessionStorage) {
    $scope.$sessionStorage = $sessionStorage;
    $scope.selectedRooms = [];
    $scope.empleados = [];
    $scope.working_employee = [];
    $scope.floors = [];
    $scope.firstfloor = [];
    $scope.secondfloor = [];
    $scope.firstfloorBackup = [];
    $scope.secondfloorBackup = [];
    $scope.working_employee_distribution = [];
    $scope.rooms_selected_distribution = [];
    $scope.display_distribution = [];
    $scope.dragged_Employee ={};
    $scope.menuWasOpened = false;
    $scope.isDragged = false;
    $scope.Room_hovered = -1;
    $scope.hasHovered = false;
    $scope.employeeWithRooms =  []
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
      

    }



    //---------------------------------------
  
          $scope.prueba = function(event,ui){
            console.log(event)
            console.log(ui)
            console.log($scope.floors)
            var deferred = $q.defer();
            console.log(deferred)
            deferred.reject()
            return deferred.promimse
          }
     







    //------------------------- 

    if($state.params.content){
      $scope.roomSelected = $state.params.content.selectedRoomsv1;
    }
    $scope.room_hover = function(event, ui, room){

        angular.element(event.target).addClass("room-hover");
    }

    $scope.room_hover_out = function(event, ui, room){

        angular.element(event.target).removeClass("room-hover");
    }

    $scope.startCallback = function(event, ui, employee) {
      $scope.dragged_Employee = employee;
      $scope.isDragged = true;
    };
    $scope.stopCallback = function(event, ui, employee) {
      console.log($scope.dragged_Employee)
    };
    $scope.dropCallback = function(event, ui,room) {
      $scope.floors.pop();
      /*if(room.room_id  < 200)
        $scope.sortRoomsFF();
      else
        $scope.sortRoomsSF();*/
      var index = -1;
      angular.element(event.target).removeClass("room-hover"); 
      var already_on_the_list = false;
      var index_on_the_list 
     for (var i = 0; i < $scope.employeeWithRooms.length ; i++) {
          if($scope.employeeWithRooms[i].empleado.username === $scope.dragged_Employee.username) {
            already_on_the_list = true
            index_on_the_list = i;
            break            
          }
      }
      if(!already_on_the_list){
        var empleado_con_su_habitacion = {
          empleado : {},
          habitacion : []          
        }
        empleado_con_su_habitacion.empleado = $scope.dragged_Employee
        empleado_con_su_habitacion.habitacion.push(room)
        $scope.employeeWithRooms.push(empleado_con_su_habitacion)
   
      }else{
        $scope.employeeWithRooms[index_on_the_list].habitacion.push(room)
      }
      for (var i = 0; i < $scope.selectedRooms.length; i++) {
        if($scope.selectedRooms[i].room_id ==room.room_id){
          $scope.selectedRooms.splice(i,1)
          break
        }
      }
     // $scope.working_employee.push($scope.dragged_Employee);
     already_on_the_list = false;
      for (var i = 0; i < room.idUser.length; i++) {
        if(room.idUser[i].username === $scope.dragged_Employee.username){
          already_on_the_list = true
          index_on_the_list = i
          break
        }
      }
      for (var i = 0; i < $scope.floors.length; i++) {
        if(room.room_id == $scope.floors[i].room_id){
          index = i
        }
      }
      
      if(!already_on_the_list && index != -1){
        $scope.floors[index].idUser.push($scope.dragged_Employee)
      }
      console.log($scope.floors)
      $scope.selectRoom(true, $scope.floors[index]);


      
    };


     $scope.sortRooms= function(){
      var j;
     var flag = true;   // set flag to true to begin first pass
     var temp;   //holding variable

     while ( flag )
     {
            flag= false;    //set flag to false awaiting a possible swap
            for( j=0;  j < $scope.floors.length -1;  j++ )
            {
                   if ( $scope.floors[ j ].room_id > $scope.floors[j+1].room_id )   // change to > for ascending sort
                   {
                           temp = $scope.floors[ j ];                //swap elements
                           $scope.floors[ j ] = $scope.floors[ j+1 ];
                           $scope.floors[ j+1 ] = temp;
                          flag = true;              //shows a swap occurred  
                  } 
            } 
      } 

    }
    $scope.sortRoomsFF= function(){
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

    }
    $scope.sortRoomsSF= function(){

     var j;
     var flag = true;   // set flag to true to begin first pass
     var temp;   //holding variable

     
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


     $scope.check = function(){

     }
    $scope.chooseEmployee = function(employee){
      //console.log("asd"); 
      //var temp = $scope.empleados.splice(index,1);
      //console.log(temp)
      var empleado_con_su_habitacion = {
        empleado : employee,
        habitacion : []          
      }
      $scope.employeeWithRooms.push(empleado_con_su_habitacion);
      
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

  	$scope.selectRoom = function(dragged,room) {
      var index = -1;
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
      if(dragged){
        room.status = 1
      }else{
        room.status = !room.status
      }
      /*if(room.status){
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
      }*/
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
    /*
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
    }*/

    $scope.distribute = function(){
      for (var i = 0; i < $scope.employeeWithRooms.length; i++) { // por todos los empleados
        for (var j = 0; j < $scope.employeeWithRooms[i].habitacion.length -1; j++) {//por cada habitacion de cada empleado
          for (var k = 0; k < $scope.employeeWithRooms[i].habitacion.length; k++) {
            if ( $scope.employeeWithRooms[i].habitacion[ j ].room_id > $scope.employeeWithRooms[i].habitacion[j+1].room_id ){
             temp = $scope.employeeWithRooms[i].habitacion[ j ];
             $scope.employeeWithRooms[i].habitacion[ j ] = $scope.employeeWithRooms[i].habitacion[ j+1 ];
             $scope.employeeWithRooms[i].habitacion[ j+1 ] = temp;
            }
          }
        }
      }//fin fors para ordernar las habitaciones
      console.log($scope.employeeWithRooms)

      





    }

    $scope.getRooms = function(){
      RoomService.GetRooms().then(function(response){
        for (var i = 0; i <response.data.length; i++) {
            $scope.floors.push(response.data[i])
          if(i < 25){
            $scope.firstfloor.push(response.data[i])
          }
          else{
            $scope.secondfloor.push(response.data[i])
          }
          if(response.data[i].status == 1){
            for (var j = 0; j < response.data[i].idUser.length; j++) {
              var existia_empleado = false
              for (var k = 0; k< $scope.employeeWithRooms.length; k++) {

                if($scope.employeeWithRooms[k].empleado.username === response.data[i].idUser[j].username ){
                  existia_empleado = true;
                  $scope.employeeWithRooms[k].habitacion.push(response.data[i])
                  break;
                }//if
              }//for
              if(!existia_empleado){                
                var empleado_con_su_habitacion = {
                  empleado : {},
                  habitacion : []          
                }
                empleado_con_su_habitacion.empleado = response.data[i].idUser[j];
                empleado_con_su_habitacion.habitacion.push(response.data[i])
                $scope.employeeWithRooms.push(empleado_con_su_habitacion)
              }         
            }//for
            $scope.selectedRooms.push(response.data[i])
          }//fin if

        }

        console.log($scope.employeeWithRooms)


        $scope.sortRooms();
        $scope.sortRoomsFF();
        $scope.sortRoomsSF();
      })
    }

    $scope.changeChooseEmps =function(params){
      $state.go("choose", {content:{
        //selectedRoomsv1: $scope.selectedRooms
        roomsSelected: $scope.roomSelected,
        workingEmployee: $scope.working_employee
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