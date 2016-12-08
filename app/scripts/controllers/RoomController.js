angular.module('AngularScaffold.Controllers')
.controller('RoomController', ['RoomService','HistoryService','ProblemService','RoomTypeService','$interval' ,'$q',  '$scope', '$state', '$stateParams','$rootScope', '$timeout','$sessionStorage', '$window',
  function (RoomService,HistoryService,ProblemService,RoomTypeService, $interval,$q,$scope,$state, $stateParams,$rootScope, $timeout, $sessionStorage, $window) {
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
    $scope.employeeWithRooms =  [];
    $scope.plantillas =  [];
    $scope.start = false;
    $scope.showList = false;
    $scope.showListProblems = false;
    $scope.currentEmpRooms = []
    $scope.room;
    $scope.dragged_Room ={}
    $scope.room_dragged_from = {}
    $scope.RoomSelected = false;
    $scope.infoRC;
    $scope.doneChecking = true;
    $scope.change_true = true;
    $scope.reports_not_seen = [];
    $scope.problema_resuelto=[];
    $scope.problem_list = [];
    $scope.no_limpio = [];
    $scope.limpio_problema = [];
    $scope.seleccionado = {};
    $scope.buttonDisabled = false;
    $scope.observation1=[];
    $scope.typeRoom="Ninguno";

    $scope.Timer = function () {
      //console.log($scope.currentEmpRooms)
      if($scope.doneChecking && typeof($sessionStorage.currentUser) !== "undefined" ){
        $scope.doneChecking = false;
        var employee_username ={
          username: $sessionStorage.currentUser.username
        }
        RoomService.CheckForChanges(employee_username).then(function(response){
          if(!response.data.last_change_seen){
            if($sessionStorage.currentUser.role === 1){// es empleados
              $scope.getEmpRooms();
            }else{//es admin
              $scope.init();
              if ($scope.change_true) {
                $scope.change_true=false;
                HistoryService.GetSeenReports().then(function(response){
                  if (response.data ) {
                    for (var i = 0; i < response.data.length; i++) {
                      var temp = {
                        reporte:response.data[i]
                      }
                      HistoryService.ReportModifySeen(temp).then(function(response2){
                        var str="HAY PROBLEMA EN LA HABITACION: "+response2.data.room_number;
                        Notify(str, null, null, 'danger');
                      });
                    }
                  }
                  $scope.change_true=true;
                });
              }
            }
            var user = {
              username: $sessionStorage.currentUser.username
            }
            if(typeof(user.username) !== "undefined"){
              RoomService.UpdateControl(user).then(function(response){
                $scope.doneChecking = true;
              })
            }
          }else{
            $scope.doneChecking = true;
          }
        })
      }
      setTimeout($scope.Timer, 500);
    }
    setTimeout($scope.Timer, 500);

    $scope.init = function() {
      $scope.problema_resuelto=[];
      HistoryService.getResolved().then(function(response){
        $scope.problema_resuelto=response.data;
        $scope.getRooms();
        $scope.llenarEmpleado();
      });
    };

    $scope.room_hover = function(event, ui, room){
      angular.element(event.target).addClass("room-hover");
    };

    $scope.room_hover_out = function(event, ui, room){
      angular.element(event.target).removeClass("room-hover");
    };

    $scope.startCallback = function(event, ui, employee) {
      $scope.dragged_Employee = employee.empleado;
      $scope.isDragged = true;
    };

    $scope.stopCallback = function(event, ui, employee) {
    };

    //para la segunda view
    $scope.startCallback_distribution = function(event, ui, room, dragged_from) {
      $scope.dragged_Room = room;
      $scope.room_dragged_from = dragged_from;
    };

    $scope.stopCallback_distribution = function(event, ui, employee) {
      angular.element(event.target).removeClass("room-hover");
      var cont_succeeded_operations = 0;
      for(var i =0; i < $scope.employeeWithRooms.length; i++){//lo eliminaremos del que lo tenia antes
        if($scope.employeeWithRooms[i].empleado.username == $scope.room_dragged_from.empleado.username){
          var index = -1;
          for (var j = 0; j < $scope.employeeWithRooms[i].habitacion.length; j++) {
            if($scope.employeeWithRooms[i].habitacion[j].room_id == $scope.dragged_Room.room_id){//encontramos el room
              index = j;
              cont_succeeded_operations++;
              break;
            }
          }
          $scope.employeeWithRooms[i].habitacion.splice(index,1)
          for (var k = index; k < $scope.employeeWithRooms[i].habitacion.length; k++) {
            if ($scope.employeeWithRooms[i].habitacion.length <= 8) {
              $scope.employeeWithRooms[i].habitacion[k].priority--;
              var RoomsWithNewPriority = {
                room: $scope.employeeWithRooms[i].habitacion[k]
              }
            
              RoomService.UpdatePriorityAfterSplice(RoomsWithNewPriority).then(function(response){

              });
            }
          };
          break;
        }
      }

      for(var i =0; i < $scope.employeeWithRooms.length; i++){//lo agregamos al nuevo en donde se dropeo
        if($scope.employeeWithRooms[i].empleado.username == employee.empleado.username){
          if($scope.employeeWithRooms[i].habitacion.length >= 8){
            swal({
              title: "Límite de Habitaciones",
              text: "Ha llegado al máximo de habitaciones por empleado.",
              type: "warning",
              confirmButtonClass: "btn-danger",
              confirmButtonText: "Continuar!",
              closeOnConfirm: true
            },
            function(){
                
            });
          }else{
            $scope.dragged_Room.priority = $scope.employeeWithRooms[i].habitacion.length;
            $scope.employeeWithRooms[i].habitacion.push($scope.dragged_Room);
            cont_succeeded_operations++;
            break;
          }
        }
      }

      if(cont_succeeded_operations>= 2){
        var swap_iduser_element = {//estructura para guardado
          previous_user: $scope.room_dragged_from.empleado.username,
          next_user: employee.empleado,
          room: $scope.dragged_Room
        }
        for (var i = 0; i < $scope.floors.length; i++) {
          if(swap_iduser_element.room_id == $scope.floors[i].room_id){
            for (var j = 0; j < $scope.floors[i].idUser.length; j++) {
              if($scope.floors[i].idUser[j].username == swap_iduser_element.previous_user ){
                $scope.floors[i].idUser.splice(j,1)
                $scope.floors[i].idUser.push( swap_iduser_element.next_user)
              }
            }
          }
        }
        for (var i = 0; i < $scope.employeeWithRooms.length; i++) {
          if ($scope.employeeWithRooms[i].habitacion.length <=8) {
            RoomService.SwapDistributedRooms(swap_iduser_element).then(function(response){

            })
          }
        }
        
      }
    };

    $scope.dropCallback = function(event, ui,room) {
      $scope.floors.pop();
      var index = -1;
      angular.element(event.target).removeClass("room-hover");
      var already_on_the_list = false;
      var index_on_the_list;
      for (var i = 0; i < $scope.employeeWithRooms.length ; i++) {
        if($scope.employeeWithRooms[i].empleado.username === $scope.dragged_Employee.username) {
          already_on_the_list = true;
          index_on_the_list = i;
          break;
        }
      }
      if(!already_on_the_list){
        if(empleado_con_su_habitacion.habitacion.length >= 8){
          swal({
            title: "Límite de Habitaciones",
            text: "Ha llegado al máximo de habitaciones por empleado.",
            type: "warning",
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Continuar!",
            closeOnConfirm: true
          },
          function(){
              
          });
        }else{
          var empleado_con_su_habitacion = {
            empleado : {},
            habitacion : [],
            contador: 0
          }
          empleado_con_su_habitacion.empleado = $scope.dragged_Employee;
          empleado_con_su_habitacion.habitacion.push(room);
          $scope.employeeWithRooms.push(empleado_con_su_habitacion);
        }
      }else{
        if($scope.employeeWithRooms[index_on_the_list].habitacion.length >= 8){
          swal({
            title: "Límite de Habitaciones",
            text: "Ha llegado al máximo de habitaciones por empleado.",
            type: "warning",
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Continuar!",
            closeOnConfirm: true
          },
          function(){
              
          });
        }else{
          $scope.employeeWithRooms[index_on_the_list].habitacion.push(room);
        }
      }

      for (var i = 0; i < $scope.selectedRooms.length; i++) {
        if($scope.selectedRooms[i].room_id ==room.room_id){
          $scope.selectedRooms.splice(i,1);
          break;
        }
      }
      already_on_the_list = false;
      for (var i = 0; i < room.idUser.length; i++) {
        if(room.idUser[i].username === $scope.dragged_Employee.username){
          already_on_the_list = true;
          index_on_the_list = i;
          break;
        }
      }
      for (var i = 0; i < $scope.floors.length; i++) {
        if(room.room_id == $scope.floors[i].room_id){
          index = i;
        }
      }

      if(!already_on_the_list && index != -1){
        $scope.floors[index].idUser.push($scope.dragged_Employee);
      }
      $scope.selectRoom(true, $scope.floors[index]);
    };


  	$scope.sortRooms= function(){
    	var j;
     	var flag = true;   // set flag to true to begin first pass
      var temp;   //holding variable

    	while ( flag ){
      	flag= false;    //set flag to false awaiting a possible swap
      	for( j=0;  j < $scope.floors.length -1;  j++ ){
        		if ( $scope.floors[ j ].room_id > $scope.floors[j+1].room_id ){   // change to > for ascending sort
           		temp = $scope.floors[ j ];                //swap elements
           		$scope.floors[ j ] = $scope.floors[ j+1 ];
           		$scope.floors[ j+1 ] = temp;
          		flag = true;    //shows a swap occurred
        		}
      	}
    	}
    }

    $scope.sortRoomsPriority= function(){
    	var j;
    	var flag = true;   // set flag to true to begin first pass
    	var temp;   //holding variable

    	while ( flag ){
      	flag= false;    //set flag to false awaiting a possible swap
      	for( j=0;  j < $scope.employeeWithRooms.length;  j++ ){
      		for (var i = 0; i < $scope.employeeWithRooms[j].habitacion.length-1; i++) {
        		if ( $scope.employeeWithRooms[j].habitacion[i].priority > $scope.employeeWithRooms[j].habitacion[i+1].priority ){   // change to > for ascending sort
        			temp = $scope.employeeWithRooms[j].habitacion[i];                //swap elements
        			$scope.employeeWithRooms[j].habitacion[i] = $scope.employeeWithRooms[j].habitacion[i+1];
        			$scope.employeeWithRooms[j].habitacion[i+1] = temp;
        			flag = true;              //shows a swap occurred
        		}
      		};
      	}
    	}
    }

    $scope.close = function(index) {
      if ($scope.employeeWithRooms[index].habitacion.length === 0) {
        $scope.employeeWithRooms.splice(index,1);
      }else{
        swal({
          title: "Esta seguro?",
          text: "Este empleado tiene habitaciones asignadas, si se elimina las habitaciones tambien sera eliminad@ de las habitaciones en las que se encuentre asignado",
          type: "warning",
          showCancelButton: true,
          confirmButtonClass: "btn-danger",
          confirmButtonText: "Continuar!",
          closeOnConfirm: true
        },function(){
          for (var i = 0; i < $scope.employeeWithRooms[index].habitacion.length; i++) {
            for (var j = 0; j < $scope.floors.length; j++) {
              if($scope.employeeWithRooms[index].habitacion[i].room_id === $scope.floors[j].room_id){
                for (var k = 0; k < $scope.floors[j].idUser.length; k++) {
                  if($scope.floors[j].idUser[k].username === $scope.employeeWithRooms[index].empleado.username){
                    if ($scope.employeeWithRooms[index].habitacion.length <= 8) {
                      $scope.floors[j].idUser.splice(k,1);
                      var param_modif = {
                        employee: $sessionStorage.currentUser.username,
                        room: $scope.floors[j]
                      }
                    
                      RoomService.UpdateRoom(param_modif).then(function(response){

                      });
                    }
                  }
                }
              }
            }
          }
          $scope.employeeWithRooms.splice(index,1);
        });
      }
    }

    $scope.submitEmployee = function() {
      if(typeof $scope.n !== "undefined"){
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
          $scope.employeeWithRooms.push(empleado_con_su_habitacion);
        }
      }
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
      var empleado_con_su_habitacion = {
        empleado : employee,
        habitacion : [],
        contador: 0
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

    $scope.selectRoom = function(dragged,room,prioridad) {
    	$scope.buttonDisabled = true;
    	var index = -1;
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
    	}else if(prioridad){ //apreta prioridad en modal!

      	if(room.status == 1){ //cuando esta por limpiar y le pone prioridad
        	room.status = 5
        	$scope.selectedRooms.splice(index, 1);
      	}else if(room.status == 5){ //remover su prioridad
      		room.status = 1
      		$scope.selectedRooms.splice(index, 1);
      		for (var i = 0; i < $scope.employeeWithRooms.length; i++) { // por todos los empleados
        		for (var j = 0; j < $scope.employeeWithRooms[i].habitacion.length -1; j++) {//por cada habitacion de cada empleado
        			for (var k = 0; k < $scope.employeeWithRooms[i].habitacion.length; k++) {
          			if ( $scope.employeeWithRooms[i].habitacion[ j ].status != 5 && $scope.employeeWithRooms[i].habitacion[j+1].status == 5 ){
           				temp = $scope.employeeWithRooms[i].habitacion[ j ];
           				$scope.employeeWithRooms[i].habitacion[ j ] = $scope.employeeWithRooms[i].habitacion[ j+1 ];
           				$scope.employeeWithRooms[i].habitacion[ j+1 ] = temp;

           				$scope.employeeWithRooms[i].habitacion[ j ].priority = j
           				$scope.employeeWithRooms[i].habitacion[ j+1 ].priority = j+1
         				}
       			  }
       			}
       		}
      	}else{ // poner prioridad
        	room.status = 5
      	}
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
    	if (room.status == 5) {
        $scope.selectedRooms.push(room);
        
    	}
    	var room_data = {
      	employee: $sessionStorage.currentUser.username,
      	room : room
    	}
      for (var i = 0; i < $scope.employeeWithRooms.length; i++) {
        if ($scope.employeeWithRooms[i].habitacion.length <= 8) {
          RoomService.UpdateRoom(room_data).then(function(response){
        
          }).then(function(){
            if ($scope.employeeWithRooms.length>0) {
              $scope.distribute();
            }
          })
        }
      }
    	
    };

    $scope.createAllRooms = function (){
      RoomTypeService.GetAllRoomType().then(function(response){
        var tempRoomType = response.data
        for (var i = 1; i < 26; i++) {
          var random = Math.floor(Math.random() * 6) 
          var room_id = {
            status: 0,
            room_id:i +100,
            idUser: [],
            priority: -1,
            observation: "",
            idRoomType: tempRoomType[random]._id,
            time_reserved: "0hr"
          }
          RoomService.CreateRoom(room_id).then(function(response1){

          })
        }
        for (var i = 1; i < 21; i++) {
          random = Math.floor(Math.random() * 6) 
          var room_id = {
            status: 0,
            room_id:i +200,
            idUser: [],
            priority: -1,
            observation: "",
            idRoomType: tempRoomType[random]._id,
            time_reserved: "0hr"
          }
          RoomService.CreateRoom(room_id).then(function(response2){

          })
        }
      })
    }

    $scope.getParameters = function(){
      $scope.distribute();
      $scope.sortRoomsPriority();
    }

    $scope.distribute = function(){
    	var selectedRooms = $scope.selectedRooms
    	if(selectedRooms.length !== 0){
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
    		while (true) {
      		for (var j = 0; j < $scope.employeeWithRooms.length; j++) {
      			if ($scope.employeeWithRooms[j].contador == rooms_repartidos) {
        			$scope.employeeWithRooms[j].contador= $scope.employeeWithRooms[j].contador+1;
        			cont++;
	            if (cont >=selectedRooms.length) {
	              break;
	            }
      			}
      		}
          rooms_repartidos++;
      		if (cont >=selectedRooms.length) {
        		break;
      		}
      	} 

      	for (var i = 0; i < $scope.employeeWithRooms.length; i++) {
        	$scope.employeeWithRooms[i].contador = $scope.employeeWithRooms[i].contador - $scope.employeeWithRooms[i].contador2
      	}

        var temp;
        var index = 0
        var id;
        for (var i = 0; i < $scope.employeeWithRooms.length; i++) {
      		for (var j = 0; j < $scope.employeeWithRooms[i].contador; j++) {
        		if($scope.employeeWithRooms[i].habitacion.length >0 ){//aqui es cuando ya tienen habitaciones
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
          			if(temp.status == 5){
            			temp.priority = 0;
            			$scope.employeeWithRooms[i].habitacion.splice(0,0,temp);
            			$scope.organizePriority(i);
          			}else{
                  if($scope.employeeWithRooms[i].habitacion.length >= 8){
                    swal({
                      title: "Límite de Habitaciones",
                      text: "Ha llegado al máximo de habitaciones por empleado.",
                      type: "warning",
                      confirmButtonClass: "btn-danger",
                      confirmButtonText: "Continuar!",
                      closeOnConfirm: true
                    },
                    function(){
                        
                    });
                  }else{
                    temp.priority = $scope.employeeWithRooms[i].habitacion.length;
                    $scope.employeeWithRooms[i].habitacion.push(temp);
                  }
          			}
          			id = selectedRooms[index].room_id;
          			selectedRooms.splice(index,1)
        			}else{
          			temp = selectedRooms[0]
          			if(temp.status == 5){
          				for (var n = 0; n < $scope.employeeWithRooms.length; n++) {
            				var cont = 0, asd;
            				for (var m = 0; m < $scope.employeeWithRooms[n].habitacion.length; m++) {
              					if (temp.room_id === $scope.employeeWithRooms[n].habitacion[m].room_id) {
	                        cont++;
	                        asd=m;
              					}
            				}
            				if (cont==1) {
            					$scope.employeeWithRooms[n].habitacion.splice(asd,1);
            					$scope.employeeWithRooms[n].habitacion.splice(0,0,temp);
            					$scope.organizePriority(n);
            				}
          				}
          			}else{
                  if($scope.employeeWithRooms[i].habitacion.length >= 8){
                    swal({
                      title: "Límite de Habitaciones",
                      text: "Ha llegado al máximo de habitaciones por empleado.",
                      type: "warning",
                      confirmButtonClass: "btn-danger",
                      confirmButtonText: "Continuar!",
                      closeOnConfirm: true
                    },
                    function(){
                        
                    });
                  }else{
                    temp.priority = $scope.employeeWithRooms[i].habitacion.length;
                    $scope.employeeWithRooms[i].habitacion.push(temp);
                  }
          			}
                id = selectedRooms[0].room_id;
                selectedRooms.splice(0,1)
        			}

        		}else{//aqui es cuando no hayan habitacion
              if($scope.employeeWithRooms[i].habitacion.length >= 8){
                swal({
                  title: "Límite de Habitaciones",
                  text: "Ha llegado al máximo de habitaciones por empleado.",
                  type: "warning",
                  confirmButtonClass: "btn-danger",
                  confirmButtonText: "Continuar!",
                  closeOnConfirm: true
                },
                function(){
                    
                });
              }else{
                temp = selectedRooms[0];
                temp.priority = $scope.employeeWithRooms[i].habitacion.length;
                $scope.employeeWithRooms[i].habitacion.push(temp);
                id = selectedRooms[0].room_id;
                selectedRooms.splice(0,1)
              }
        		}

        		for (var k = 0; k < $scope.floors.length; k++) {
        			if ($scope.floors[k].room_id === id) {
          			var encontrado = false;
          			for (var l = 0; l < $scope.floors[k].idUser.length; l++) {
            				if ($scope.floors[k].idUser[l].username === $scope.employeeWithRooms[i].empleado.username) {
              				encontrado = true;
              				break;
            				};
          			};
          			if (!encontrado && $scope.floors[k].status != 5) {
            				$scope.floors[k].idUser.push($scope.employeeWithRooms[i].empleado)
            				temp = $scope.floors[k];
          			};
          			break;
        			};
        		}
        		//guardarlo
        		if(temp.status != 5){
              if ($scope.employeeWithRooms[i].habitacion.length <= 8) {
            		var parameters = {
              			employee: $sessionStorage.currentUser.username,
              			room: temp
            		}
                RoomService.SaveDistributedRooms(parameters).then(function(response){
                })
              }
          		
        		}
        	};
      	}//TERMINADO
    	}
      $scope.buttonDisabled = false;
    	
    }

    $scope.setBtnDisable = function(){
      $scope.buttonDisabled = false;
    } 

    $scope.getRooms = function(){
      RoomService.GetRooms().then(function(response){
        $scope.floors = []
        $scope.employeeWithRooms = []
        $scope.selectedRooms = []
        for (var i = 0; i <response.data.length; i++) {
        	$scope.floors.push(response.data[i])
        	if(response.data[i].status == 1 || response.data[i].status == 5){
          	var flag = false;
          	for (var j = 0; j < response.data[i].idUser.length; j++) {
            		var existia_empleado = false
            		for (var k = 0; k< $scope.employeeWithRooms.length; k++) {
              		if($scope.employeeWithRooms[k].empleado.username === response.data[i].idUser[j].username ){
                    if($scope.employeeWithRooms[k].habitacion.length >= 8){
                      swal({
                        title: "Límite de Habitaciones",
                        text: "Ha llegado al máximo de habitaciones por empleado.",
                        type: "warning",
                        confirmButtonClass: "btn-danger",
                        confirmButtonText: "Continuar!",
                        closeOnConfirm: true
                      },
                      function(){
                          
                      });
                    }else{
                      existia_empleado = true;
                      $scope.employeeWithRooms[k].habitacion.push(response.data[i]);
                      $scope.employeeWithRooms[k].contador  =0
                      break;
                    }
              		}//if
            		}//for
            		if(!existia_empleado){
                  var empleado_con_su_habitacion = {
                    empleado : {},
                    habitacion : [],
                    contador: 0
                  }
                  if(empleado_con_su_habitacion.habitacion.length >= 8){
                    swal({
                      title: "Límite de Habitaciones",
                      text: "Ha llegado al máximo de habitaciones por empleado.",
                      type: "warning",
                      confirmButtonClass: "btn-danger",
                      confirmButtonText: "Continuar!",
                      closeOnConfirm: true
                    },
                    function(){
                        
                    });
                  }else{
                    
                    empleado_con_su_habitacion.empleado = response.data[i].idUser[j];
                    empleado_con_su_habitacion.habitacion.push(response.data[i]);
                    $scope.employeeWithRooms.push(empleado_con_su_habitacion)
                  }
            		}
          	}//for
          	if(response.data[i].idUser.length == 0){
            	$scope.selectedRooms.push(response.data[i])
          	}
        	}//fin if
        }
        $scope.sortRooms();
        $scope.sortRoomsPriority();

      })
    }

    $scope.changeChooseEmps =function(params){
      var object_param = {
        rooms: params,
        room_distributed: $scope.employeeWithRooms
      }
      if($scope.selectedRooms.length === 0){
        swal({
          title: "Esta seguro?",
          text: "No ha seleccionado habitaciones para repartir",
          type: "warning",
          showCancelButton: true,
          confirmButtonClass: "btn-danger",
          confirmButtonText: "Continuar!",
          closeOnConfirm: true
        },function(){
          $state.go("dist", {  content: object_param})
        });
      }else{
        $state.go("dist", {content:object_param})
      }

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
      $scope.RoomSelected = false;
      $scope.start = false;
      $scope.showList = false;
      $scope.showListProblems = false;
      $state.go("emp")
    }

    $scope.changeRoomEmp = function(id){
      for(var i=0;i<$scope.currentEmpRooms.length;i++){
        if (id === $scope.currentEmpRooms[i].room_id) {
          $scope.room = $scope.currentEmpRooms[i];
          console.log($scope.room)
          $scope.RoomSelected = true;
          $scope.start = false;
          $scope.showList = false;
          $scope.showListProblems = false;
        };
      }

    }

    $scope.cambioEstados = function(estado){
      if($scope.seleccionado === "El cliente no queria." || $scope.seleccionado === "La puerta esta dañada."){
        swal({
              title: "Debe de seleccionar una opción!!",
              type: "warning",
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Cerrar",
              closeOnConfirm: false,            
        });
      }else{
      	$scope.room.status = estado;
      	if($scope.seleccionado && estado != 2){
        	$scope.room.observation = $scope.seleccionado;
      	}
      	var temporal = {
        	employee: $sessionStorage.currentUser.username,
        	room: $scope.room
      	}
      for (var i = 0; i < $scope.employeeWithRooms.length; i++) {
        if ($scope.employeeWithRooms[i].habitacion.length <= 8) {
        	RoomService.UpdateRoom(temporal).then(function(response){
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            if(dd<10) {
              dd='0'+dd
            }

            if(mm<10) {
              mm='0'+mm
            }

            today = mm+'/'+dd+'/'+yyyy;
            var resuelto = true;
            if( response.data.status ==3 || response.data.status ==4  ){
           		resuelto = false;
         		}

           	var reporte ={
              employee_id: response.data.idUser[0].username,
              room_number: response.data.room_id,
              problem_id: response.data.observation,
              room_state: response.data.status,
              date_reported: today,
              resolved:resuelto
          	};

            HistoryService.CreateRegister(reporte).then(function(response2){

            });

        	}).then(function(){
            $scope.RoomSelected = true;
            $scope.start = false;
            $scope.showList = false;
            $scope.showListProblems = false;
            $state.reload();
        	});
        }
      }
    }
    }

    $scope.getEmpRooms = function() {
    	RoomService.GetRooms().then(function(response){
        $scope.currentEmpRooms = [];
        for(var i =0; i<response.data.length;i++){
        	for(var j=0;j<response.data[i].idUser.length; j++){
         		if($sessionStorage.currentUser.username == response.data[i].idUser[j].username){
          		$scope.currentEmpRooms.push(response.data[i]);
        		}
        	}
      	}

      }).then(function(){
        var flag = true;   // set flag to true to begin first pass
        var temp;   //holding variable

        while ( flag ){
          flag= false;    //set flag to false awaiting a possible swap
          for( var j=0;  j < $scope.currentEmpRooms.length-1;  j++ ){
            if ( $scope.currentEmpRooms[j].priority > $scope.currentEmpRooms[j+1].priority ){   // change to > for ascending sort
              temp = $scope.currentEmpRooms[j];                //swap elements
              $scope.currentEmpRooms[j] = $scope.currentEmpRooms[j+1];
              $scope.currentEmpRooms[j+1] = temp;
              flag = true;              //shows a swap occurred
            }
          }
        }
      	ProblemService.GetProblema().then(function(response){
          $scope.problem_list = response.data;
        });
      });
    	$scope.RoomSelected = false;
    }

    $scope.setText = function(notCleaned){
      document.getElementById("commentbox").value = notCleaned;
    }

    $('#myModal').on("hidden.bs.modal",function(){// obtener el cierre del modal para hacer redistribucion
      if ($scope.employeeWithRooms.length>0) {
        $scope.distribute();
      }
    })

    $scope.handleClick = function(evt,f) {
    	if (evt.which == 3) {
        $scope.infoRC=f;
        evt.preventDefault()
        var temp = {
          idRoomType: $scope.infoRC.idRoomType
        }
        RoomTypeService.GetRoomType(temp).then(function(response){
          $scope.typeRoom = response.data.description;
        })
        $('#infoMsg').modal('show');
      }
    };

    $scope.organizePriority = function(i){
      for (var j = 0; j < $scope.employeeWithRooms[i].habitacion.length; j++) {
        if ($scope.employeeWithRooms[i].habitacion.length <= 8) {
          $scope.employeeWithRooms[i].habitacion[j].priority = j;
          var parameters = {
            employee: $sessionStorage.currentUser.username,
            room: $scope.employeeWithRooms[i].habitacion[j]
          }
        
          RoomService.SaveDistributedRooms(parameters).then(function(response){

          })
        }
      };
    }

    $scope.isNeutral = function(infoRoom){
      if(infoRoom.status === 0){
        return true;
      }
      return false;
    }

    $scope.current_TimeStamp = 0;
    $scope.clock= function(){
      $scope.current_TimeStamp+=1000;
      var today = new Date($scope.current_TimeStamp)
      var days = [ 'Domingo','Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      var date = days[today.getDay()] +" " + today.getDate()+ " de " + months[today.getMonth()] + " "+ today.toLocaleTimeString() ;
      
      if($('#time'))
        $('#time').html(date);

      setTimeout($scope.clock, 1000);
     }

     $scope.startTime= function(){      
       RoomService.RequestTime().then(function(response){
          var date = new Date(response.data)
          $scope.current_TimeStamp = date.getTime()
          var t = setTimeout($scope.clock, 1000);
        })

     }
     $scope.startTime();
    //fin mostrar fecha actual

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

    $scope.blinking = function() {
      var timer = setInterval(blink, 10);
      function blink() {
        $('.blink').fadeOut(800, function() {
         $('.blink').fadeIn(800);
       });
      }
    }

    $scope.report_modifySeen = function(  ) {
      var temp = {
        empty:null
      }
      HistoryService.ReportModifySeen(temp).then(function(response){
        if (response.data ) {
          Notify("Stop! Hammer time", null, null, 'danger');
        }
        $scope.change_true=true;
      });
    }

    $scope.manita = function( room ){
      var temp = false;
      for (var i = 0; i < $scope.problema_resuelto.length; i++) {
        if ($scope.problema_resuelto[i].room_number === room) {
          temp = true;
        }
      }
      if (temp) {
        return false;
      }
      return true;
    }

    $scope.showNotCleanList = function(){
      $scope.no_limpio = [];
      for (var i = 0; i < $scope.problem_list.length; i++) {
        if($scope.problem_list[i].problem_type === 1){
          $scope.no_limpio.push($scope.problem_list[i])
        }
      }
      $scope.seleccionado = $scope.no_limpio[0].problem_description;
      $scope.showList = true;
    }

    $scope.showProblemList = function(){
    	$scope.no_limpio = [];
    	for (var i = 0; i < $scope.problem_list.length; i++) {
      	if($scope.problem_list[i].problem_type === 0){
        	$scope.limpio_problema.push($scope.problem_list[i])
      	}
    	}
      $scope.seleccionado = $scope.limpio_problema[0].problem_description;
    	$scope.showListProblems = true;
    }

    $scope.saberSelecc = function(){
      console.log($scope.seleccionado)
    }


  $scope.get_observation  = function(algo){
    var param ={
        id: algo,
      }
      ProblemService.GetProblema_por_habitacion(param).then(function(response2){
           $scope.observation1 =  response2.data;
      });
  }

  //plantilla inicio
 /* $scope.get_plantillas = function(){
    RoomService.GetPlantillas().then(function(function){

    })
  }*/
  $scope.cargar_plantilla = function(plantilla){ 
      RoomService.CargarPlantillas(plantilla).then(function(response){
        swal({
          title: "Desea cargar esta planilla?",
          type: "success",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Continuar",
          cancelButtonText: "Cancelar",
          closeOnConfirm: false,
        },
        function(isConfirm){
          if (isConfirm) {
            window.location.reload(false);
          }
        }); 
      });
  }
  $scope.get_plantillas  = function(){
      RoomService.GetPlantillas().then(function(response){
           $scope.plantillas = response.data;

      });
  }
  $scope.create_plantillas  = function(algo){
      
      var plantilla ={
         plantilla_nombre: document.getElementById("plantilla_name_input").value,
         plantilla_descripcion: document.getElementById("plantilla_descripcion_input").value
      };
      RoomService.CreatePlantillas(plantilla).then(function(response){
            swal({
              title: "Guardado con Exito!",
              type: "success",
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "OK!",
              closeOnConfirm: false,
            },
            function(isConfirm){
              if (isConfirm) {
                window.location.reload(false);
              }
            });
      });
  }
  

  //plantilla final

}]);

app.filter('slice', function() {
  return function(arr, start, end) {
    return arr.slice(start, end);
  };
});

window.oncontextmenu = function () {
  return false;
}
