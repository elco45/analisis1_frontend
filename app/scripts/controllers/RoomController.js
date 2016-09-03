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
    $scope.start = false;
    $scope.showList = false;
    $scope.showListProblems = false;
    $scope.currentEmpRooms = []
    $scope.room;
    $scope.dragged_Room ={}
    $scope.room_dragged_from = {}
    
    //--lo que hizo elena ---

    $scope.init = function() {
      $scope.getRooms();
      $scope.llenarEmpleado();
      //$scope.createAllRooms();
      

    }



    //---------------------------------------

    //------------------------- 

    $scope.room_hover = function(event, ui, room){
        //console.log(room)
        angular.element(event.target).addClass("room-hover");
    }

    $scope.room_hover_out = function(event, ui, room){

        angular.element(event.target).removeClass("room-hover");
    }

    $scope.startCallback = function(event, ui, employee) {
      $scope.dragged_Employee = employee.empleado

      $scope.isDragged = true;
    };
    $scope.stopCallback = function(event, ui, employee) {
    }; 

    //para la segunda view
    $scope.startCallback_distribution = function(event, ui, room, dragged_from) {
      $scope.dragged_Room = room
      //console.log(room)
      $scope.room_dragged_from = dragged_from
    };
    $scope.stopCallback_distribution = function(event, ui, employee) {    
        var cont_succeeded_operations = 0;
        for(var i =0; i < $scope.employeeWithRooms.length; i++){//lo eliminaremos del que lo tenia antes
          if($scope.employeeWithRooms[i].empleado.username == $scope.room_dragged_from.empleado.username){
            var index = -1;
            for (var j = 0; j < $scope.employeeWithRooms[i].habitacion.length; j++) {
              if($scope.employeeWithRooms[i].habitacion[j].room_id == $scope.dragged_Room.room_id){//encontramos el room
                  index = j
                  cont_succeeded_operations++;
                  break
              } 
            }
            $scope.employeeWithRooms[i].habitacion.splice(index,1)
            break;
          }
        }
        for(var i =0; i < $scope.employeeWithRooms.length; i++){//lo agregamos al nuevo en donde se dropeo
          if($scope.employeeWithRooms[i].empleado.username == employee.empleado.username){
            $scope.employeeWithRooms[i].habitacion.push($scope.dragged_Room)
            cont_succeeded_operations++;
            console.log("entro")
            console.log($scope.employeeWithRooms[i])
            break;
          }
        }

        if(cont_succeeded_operations>= 2){
          var swap_iduser_element = {//estructura para guardado
            previous_user: $scope.room_dragged_from.empleado.username,
            next_user: employee.empleado,
            room_id: $scope.dragged_Room.room_id
          }

          RoomService.SwapDistributedRooms(swap_iduser_element).then(function(response){
            console.log(response.data);
          })

        }
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
          habitacion : [],
          contador: 0          
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



    $scope.submitEmployee = () => {
      var index = -1
      for (var i = 0; i < $scope.employeeWithRooms.length; i++) {
        if($scope.employeeWithRooms[i].empleado.username === $scope.n.username){
          index = i;
          break;
        }
      }
      if(index === -1){

          var empleado_con_su_habitacion = {
            empleado : $scope.n,
            habitacion : [],
            contador: 0          
          }
          $scope.employeeWithRooms.push(empleado_con_su_habitacion)
      }
      console.log($scope.employeeWithRooms)
      /*if (!containsObject($scope.n, $scope.employeeWithRooms)) {
        $scope.employeeWithRooms.push($scope.n);
      }*/
    }

    function containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }

        return false;
    }

    $scope.chooseEmployee = function(employee){
      //console.log("asd"); 
      //var temp = $scope.empleados.splice(index,1);
      //console.log(temp)
      var empleado_con_su_habitacion = {
        empleado : employee,
        habitacion : [],
        contador: 0          
      }
      $scope.employeeWithRooms.push(empleado_con_su_habitacion);
      console.log($scope.employeeWithRooms)
      
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
      console.log(room)
      for (i =0; i < $scope.selectedRooms.length; i++) {
        if(room.room_id == $scope.selectedRooms[i].room_id){          
          index = i;
          break;          
        }
      }
      if(index >-1 || dragged) {
        if(index === 0){
          $scope.selectedRooms.shift()
        }else{
          $scope.selectedRooms.splice(index, 1);        
        }
      } else {
        $scope.selectedRooms.push(room);
      }
      if(dragged){
        room.status = 1
      }else{
        room.status = !room.status
      }
      if(room.status == 0){
        room.idUser = [];
        for (var i = 0; i < $scope.employeeWithRooms.length; i++) {
          for (var j = 0; j < $scope.employeeWithRooms[i].habitacion.length; j++) {
            if($scope.employeeWithRooms[i].habitacion[j].room_id === room.room_id){
              $scope.employeeWithRooms[i].habitacion.splice(j,1)
            }
          }
        }
        index = -1;
        for (i =0; i < $scope.selectedRooms.length; i++) {
          if(room.room_id == $scope.selectedRooms[i].room_id){          
            index = i;
            break;          
          }
        }
        if(index != -1) {
          $scope.selectedRooms.splice(index, 1);        
        }


      }
      console.log(room)
      var room_data = {
        room : room
      }
      console.log(room_data)
      $sessionStorage.currentUser.paramsDistribution = $scope.selectedRooms
      console.log($scope.selectedRooms)
     
      RoomService.UpdateRoom(room_data).then(function(response){
        
      })
      //$scope.selectedRooms.sort()
    };

    $scope.createAllRooms = function (){
     
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
    }

    $scope.getParameters = function(){
      console.log("--------------------getParameters") 
      console.log($stateParams )
      /*$scope.employeeWithRooms = $stateParams.content.param.room_distributed
      $scope.selectedRooms = $stateParams.content.param.rooms
     
      $scope.distribute( $scope.selectedRooms,$scope.employeeWithRooms);*/
      $scope.distribute();
    }
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

    
    //$scope.distribute = function(selectedRooms,employee){
    $scope.distribute = function(){
      console.log("---------------------distribute-------------------")
      //console.log(selectedRooms)
      console.log($stateParams)
      $scope.employeeWithRooms = $stateParams.content.room_distributed
      console.log($scope.employeeWithRooms)
      var selectedRooms = $stateParams.content.rooms
      if(selectedRooms.length !== 0){
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
        
        
       
        var temp;
        for (var i = 0; i < $scope.employeeWithRooms.length ; i++) {
          for (var j = 0; j <$scope.employeeWithRooms.length - 1; j++) {
              if ( $scope.employeeWithRooms[j].habitacion.length < 
                $scope.employeeWithRooms[j+1].habitacion.length ){
               temp = $scope.employeeWithRooms[j];
               $scope.employeeWithRooms[j] = $scope.employeeWithRooms[j+1];
               $scope.employeeWithRooms[j+1] = temp;
              }
          }
        } //ordena los employees por length de su arreglo de habitaciones

        
        var temp;
        for (var i = 0; i < selectedRooms.length ; i++) {
          for (var j = 0; j <selectedRooms.length - 1; j++) {
              if ( selectedRooms[j].room_id >selectedRooms[j+1].room_id ){
               temp = selectedRooms[j];
               selectedRooms[j] = selectedRooms[j+1];
               selectedRooms[j+1] = temp;
              }
          }
        }

        
        
        for (var i = 0; i < $scope.employeeWithRooms.length; i++) {
          $scope.employeeWithRooms[i].contador = $scope.employeeWithRooms[i].habitacion.length
          $scope.employeeWithRooms[i].contador2 = $scope.employeeWithRooms[i].habitacion.length
        }
        var rooms_repartidos = 0;
        var cont = 0;
        var encontro = false
        while (true) {
          for (var j = 0; j < $scope.employeeWithRooms.length; j++) {
            if ($scope.employeeWithRooms[j].contador == rooms_repartidos) {
              encontro = true
              $scope.employeeWithRooms[j].contador= $scope.employeeWithRooms[j].contador+1;
              cont++; 
              if (cont >=selectedRooms.length) {
                break;
              }            
            }          
          }
          //if(!encontro)
          rooms_repartidos++;

          if (cont >=selectedRooms.length) {
            break;
          }
        } // fin for de selected rooms

        for (var i = 0; i < $scope.employeeWithRooms.length; i++) {
          $scope.employeeWithRooms[i].contador = $scope.employeeWithRooms[i].contador - $scope.employeeWithRooms[i].contador2 
        }


        //el error esta aqui
        var temp;
        var index = 0
        for (var i = 0; i < $scope.employeeWithRooms.length; i++) {
          for (var j = 0; j < $scope.employeeWithRooms[i].contador; j++) {
            if($scope.employeeWithRooms[i].habitacion.length >0 ){
              var num_menor = $scope.employeeWithRooms[i].habitacion[0]
              var habia = false
              for (var k = 0; k < selectedRooms.length; k++) {
                if(selectedRooms[k].room_id > (num_menor-25)){
                  index = k
                  habia = true;
                  break;
                }
              }
              if(habia){  
                temp = selectedRooms[index]  
                $scope.employeeWithRooms[i].habitacion.push(selectedRooms[index]);
                selectedRooms.splice(index,1)
              }else{
                temp = selectedRooms[0]
                $scope.employeeWithRooms[i].habitacion.push(selectedRooms[0])
                selectedRooms.splice(0,1)
              }

            }else{
              temp = selectedRooms[0]            
              $scope.employeeWithRooms[i].habitacion.push(selectedRooms[0]);
              selectedRooms.splice(0,1)
              //aqui es cuando hayan sin habitacion
            }
              //guardarlo
            var room_with_employee = {
              employee : $scope.employeeWithRooms[i].empleado,
              room_id : temp.room_id
            }
            RoomService.SaveDistributedRooms(room_with_employee).then(function(response){
              console.log(response.data)
            })
          };
        }//TERMINADO
      }else{
        console.log("no hay habitaciones para repartir")
      }
      //console.log($scope.employeeWithRooms)
        
    }

    $scope.getRooms = function(){
      RoomService.GetRooms().then(function(response){
        for (var i = 0; i <response.data.length; i++) {
            $scope.floors.push(response.data[i])
          /*if(i < 25){
            $scope.firstfloor.push(response.data[i])
          }
          else{
            $scope.secondfloor.push(response.data[i])
          }*/
          if(response.data[i].status == 1){
            var flag = false;
            for (var j = 0; j < response.data[i].idUser.length; j++) {
              var existia_empleado = false
              for (var k = 0; k< $scope.employeeWithRooms.length; k++) {
                if($scope.employeeWithRooms[k].empleado.username === response.data[i].idUser[j].username ){
                  existia_empleado = true;
                  $scope.employeeWithRooms[k].habitacion.push(response.data[i])
                  $scope.employeeWithRooms[k].contador  =0
                 /* for (var l = 0; l < $scope.employeeWithRooms[k].habitacion.length; l++) {
                    if($scope.employeeWithRooms[k].habitacion[l].room_id == response.data[i].room_id){
                      flag = true
                      break;
                    }

                  }*/
                  break;
                }//if
              }//for
              if(!existia_empleado){                
                var empleado_con_su_habitacion = {
                  empleado : {},
                  habitacion : [],
                  contador: 0        
                }
                empleado_con_su_habitacion.empleado = response.data[i].idUser[j];
                empleado_con_su_habitacion.habitacion.push(response.data[i])
                $scope.employeeWithRooms.push(empleado_con_su_habitacion)
              }         
            }//for
            if(response.data[i].idUser.length == 0)
              $scope.selectedRooms.push(response.data[i])
          }//fin if

        }

        $scope.sortRooms();
        
        
      })
    }

    $scope.changeChooseEmps =function(params){
      console.log("-------------selectedrooms size: " + $scope.selectedRooms.length)
      console.log(params)
      console.log($scope.selectedRooms)
      var object_param = {
        rooms: params,
        room_distributed: $scope.employeeWithRooms
      }
      console.log(  object_param)
      if($scope.selectedRooms.length === 0){
       
        swal({
          title: "Esta seguro?",
          text: "No ha seleccionado habitaciones para repartir",
          type: "warning",
          showCancelButton: true,
          confirmButtonClass: "btn-danger",
          confirmButtonText: "Continuar!",
          closeOnConfirm: true
        }, 
        
        function(){
            $state.go("dist", {  content: object_param})
        });
      }else{
        $state.go("dist", {content:object_param})
      }
      /*.then(function(err){
       
        $scope.distribute(params, $scope.employeeWithRooms)
      })
      console.log($scope.selectedRooms)
*/

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

    $scope.changeMainEmployee = function(){
      $state.go("emp")
      $scope.recargar();
    }

    $scope.changeRoomEmp = function(id){
      console.log($scope.currentEmpRooms)
      for(var i=0;i<$scope.currentEmpRooms.length;i++){
        if (id==$scope.currentEmpRooms[i].room_id) {
             $state.go("roomemp",{content: {
              habitaciones:   $scope.currentEmpRooms[i]
            }})
        };

      }
     
    }


    $scope.recargar = function(){
      $scope.room = $stateParams.content.habitaciones
    }

    $scope.cambioEstados = function(estado){
      if (estado == 3) {
        $scope.room.observation = document.getElementById("texta").value;
        console.log($scope.room.observation);
      } else if (estado == 4){
         $scope.room.observation = document.getElementById("commentbox").value;
         console.log($scope.room.observation);
      }
        for (var i = 0; i <$scope.room.idUser.length ; i++) {
          if ($sessionStorage.currentUser.username == $scope.room.idUser[i].username) {
            $scope.room.idUser.splice(i,1)
          };
        };
        if ($scope.room.idUser.length == 0) {
          $scope.room.status = estado;
        };
        var temporal = {
            room: $scope.room
        }
       RoomService.UpdateRoom(temporal).then(function(response){
        
       });
       $scope.changeMainEmployee();
    }

    $scope.setText = function(notCleaned){
      console.log(notCleaned);
      document.getElementById("commentbox").value = notCleaned;
    }

    $scope.getEmpRooms = function() {
      console.log("xcadc  "+$sessionStorage.currentUser.username)
        RoomService.GetEmpRooms($sessionStorage.currentUser).then(function(response){
          for(var i =0; i<response.data.length;i++){
              for(var j=0;j<response.data[i].idUser.length; j++){
                 if($sessionStorage.currentUser.username == response.data[i].idUser[j].username){
                    $scope.currentEmpRooms.push(response.data[i]);
                 }
              }
          }
          console.log($scope.currentEmpRooms)
        });  
    }


    //---------------
   


}]);

app.filter('slice', function() {
      return function(arr, start, end) {
        return arr.slice(start, end);
      };
    });