angular.module('AngularScaffold.Controllers')
  .controller('UsersController', ['AuthService','UserService' , '$scope', '$state', '$rootScope', '$sessionStorage',
  	function (authService,UserService, $scope, $state, $rootScope, $sessionStorage) {
  	$scope.user = {};
  	$scope.$sessionStorage = $sessionStorage;
  	$scope.title = "Login";
  	$scope.presionado = true;
  	$scope.docenteDivs =false;
  	$scope.estudianteDivs = false;
  	$scope.universidadDiv = false;
  	$scope.signIn= {};
  	$scope.docentes={};
  	$scope.docente;
  	$scope.registroCorrecto=false;
  	$scope.signUpCorrecto=false;
  	$scope.mySelect;
  	$scope.universidades=[];
  	$scope.universidad={};
  	$scope.activateReply = false;
	$scope.tree = [];
  	$scope.emailTomado=false;
  	$scope.universidadTomado=false;

    $scope.getUniversidades = function(){
        UserService.GetUniversidades().then(function(response){
          $scope.universidades=response.data;
        }).catch(function(err){
          alert(err.data.error + " " + err.data.message);
        })
   	}

    $scope.logout = function(){
        authService.Logout().then(function(response){
          	$sessionStorage.$reset();
          	$state.go("home");
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
        if ($scope.signIn.email != null && $scope.signIn.password != null) {
          	authService.Login($scope.signIn).then(function(response){
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
          	})
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

   	$scope.selectButton = function(){
        return $scope.presionado;
   	}

  	$scope.pressDocente = function(){
        return $scope.docenteDivs;
   	}

  	$scope.showUniversidad = function(){
        if($scope.universidadDiv === true)
          	$scope.user.universidad_txt = "";
        $scope.universidadDiv = !$scope.universidadDiv;
   	}

   	$scope.pressUniversidad = function(){
        return $scope.universidadDiv;
  	}

   	$scope.pressEstudiante = function(){
        return $scope.estudianteDivs;
   	}

   	$scope.seleccionar=function(tipo){
        if (tipo==1) {//docente
          	$scope.docenteDivs=true;
          	$scope.estudianteDivs=false;
         	$scope.getUniversidades();
        }else{//estudiante
          	$scope.estudianteDivs=true;
          	$scope.docenteDivs=false;
          	$scope.getUniversidades();
        }
        $scope.presionado=false;
   	}

   	$scope.retroceder = function(){
        $scope.user.id = "";
        $scope.user.nombre = "";
        $scope.user.apellido = "";
        $scope.user.email="";
        $scope.user.password="";
        $scope.user.especialidad = "";
        $scope.user.unversidad_txt = "";
        $scope.estudianteDivs=false;
        $scope.docenteDivs=false;
        $scope.registroCorrecto=false;
        $scope.presionado=!$scope.presionado;
   	}

   	$scope.register = function() {
        $scope.registroCorrecto=false;
        $scope.universidadTomado=false;
        $scope.emailTomado=false;
        if ($scope.user.nombre==undefined) {
          	$scope.registroCorrecto=true;
        }
        if($scope.user.apellido==undefined){
          	$scope.registroCorrecto=true;
        }
        if($scope.user.email==undefined){
          	$scope.registroCorrecto=true;
        }
        if($scope.user.password==undefined){
          	$scope.registroCorrecto=true;
        }
        if($scope.user.universidad_cb==undefined){
          	$scope.registroCorrecto=true;
        }
        if($scope.registroCorrecto==false){
          	UserService.GetControl().then(function(response){
	            var paramU={
	              	control_id:response.data,
	              	nombre:$scope.user.universidad_txt,
	              	user:$scope.user
	            }
            	if ($scope.user.universidad_txt!=undefined) {
              		UserService.CreateUniversity(paramU).then(function(response1){
                		UserService.Register(paramU).then(function(response2){
		                  	$scope.universidadTomado=false;
		                  	$scope.registroCorrecto=false;
		                  	$scope.user.id = "";
		                  	$scope.user.nombre = "";
		                  	$scope.user.apellido = "";
		                  	$scope.user.email="";
		                  	$scope.user.password="";
		                  	$scope.user.especialidad = "";
		                  	$scope.user.unversidad_txt = "";
		                  	$scope.estudianteDivs=false;
		                  	$scope.docenteDivs=false;
		                  	$scope.registroCorrecto=false;
		                  	$scope.signUpCorrecto=true;
		                  	BootstrapDialog.alert({
		                    	title: 'EXITO',
		                    	message: 'Se ha registrado exitosamente',
		                    	type: BootstrapDialog.TYPE_SUCCESS, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
		                    	closable: true, // <-- Default value is false
		                    	buttonLabel: 'Cerrar', // <-- Default value is 'OK',
		                  	});
		                  	$state.go("login");
		                }).catch(function(err){
		                  $scope.getUniversidades();
		                  $scope.user.universidad_cb=$scope.universidades[$scope.universidades.length-1];
		                  $scope.universidadDiv=false;
		                  $scope.emailTomado=true;
		                })
		           	}).catch(function(err){
		            	$scope.universidadTomado=true;
		          	});
            	}else{
              		var para={
                		Nombre:$scope.user.universidad_cb.trim()
              		}
              		UserService.GetUniversidadByName(para).then(function(response3){
                		$scope.universidad=response3.data;
		                $scope.registroCorrecto=false;
		                $scope.universidadTomado=false;
		                var paramU2={
		                  control_id:response.data,
		                  universidad:$scope.universidad,
		                  user:$scope.user
		                }
                		UserService.RegisterWithU(paramU2).then(function(response4){
                  			$scope.registroCorrecto=false;
                  			$scope.user.id = "";
                  			$scope.user.nombre = "";
                  			$scope.user.apellido = "";
                  			$scope.user.email="";
                 			$scope.user.password="";
                  			$scope.user.especialidad = "";
                  			$scope.user.unversidad_txt = "";
                  			$scope.estudianteDivs=false;
                  			$scope.docenteDivs=false;
                  			$scope.registroCorrecto=false;
                  			$scope.signUpCorrecto=true;
                  			BootstrapDialog.alert({
                    			title: 'EXITO',
                    			message: 'Se ha registrado exitosamente',
                    			type: BootstrapDialog.TYPE_SUCCESS, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                    			closable: true, // <-- Default value is false
                    			buttonLabel: 'Cerrar', // <-- Default value is 'OK',
                  			});
                 			$state.go("login");
                		}).catch(function(err){
                  			$scope.emailTomado=true;
                		});
              		}).catch(function(err){
                		console.log("error agarrando universidad");
              		});
            	}
          	}).catch(function(err){
            	$scope.registroCorrecto=true;
            	alert('Error agregando usuario')
          	});
        }
   	}

  	$scope.cancel_registration = function(){
        $state.go('home');
   	}

   	$scope.verifyOtros=function(mySelect){
        if (mySelect==="Otro") {
          $scope.user.universidad_txt=undefined;
          $scope.universidadDiv=true;
        }else{
          $scope.user.universidad_txt=undefined;
          $scope.universidadDiv=false;
          $scope.user.universidad_cb=mySelect;
        }
  	}

  	$scope.verifyRegistro=function(){
        return $scope.registroCorrecto;
  	}

   	$scope.verifySignUp=function(){
        return $scope.signUpCorrecto;
   	}

  	$scope.verifyEmail=function(){
        return $scope.emailTomado;
   	}

  	$scope.verifyUniversidad=function(){
        return $scope.universidadTomado;
 	}

      //Inicio comentarios
   /*	$scope.addFirstComment = function() {
        var post = 1;
        var txt =	document.getElementById("first_txtcomment").value;
        $scope.tree.push({id:-55,text: txt,nodes: []});
        UserService.GetControl().then(function(response1){
            var params = {
               Id_comentario: response1.data.Id_comentario,
               text: txt,
               nodes: [],
               scope: $scope.$sessionStorage
            }
            UserService.AddFirstParentComment(params).then(function(response2){
                for (var i = 0; i < $scope.tree[0].nodes.length; i++) {
                  	if($scope.tree[i].id === -55){
                      	$scope.tree[i].id = response2.data.id
                      	$scope.tree[i].user = $scope.$sessionStorage.currentUser.email
                      	break;
                  	}
                }
            });
        })
    };*/
    $scope.addFirstComment = function() {
       var post = 1;
       var txt =	document.getElementById("first_txtcomment").value;

       UserService.GetControl().then(function(response1){
           var params = {
              Id_comentario: response1.data.Id_comentario,
              text: txt,
              nodes: [],
              scope: $scope.$sessionStorage
           }
           UserService.AddFirstParentComment(params).then(function(response2){
             $scope.tree.push({id:response2.data.id,user: $scope.$sessionStorage.currentUser.email,text: txt,nodes: []});
              $('#first_txtcomment').val("");
           });
       })
   };

   	$scope.addComment = function(data) {
        var post = data.nodes.length + 1;
        var txt =	document.getElementById("txtcomment").value;
        data.showReply = false;
        UserService.GetControl().then(function(response1){

        	data.nodes.push({id: response1.data.Id_comentario,user: $scope.$sessionStorage.currentUser.email,text: txt,nodes: []});

	       	var params = {
	            Id_parentComment: data.id,
	            Id_comentario: response1.data.Id_comentario,
	            text: txt,
	            nodes: [],
	            scope: $scope.$sessionStorage
	       	}
          	UserService.AddComment(params).then(function(response2){
              //alert("Comentario agregado exitosamente")
          	});
        })
    };


    $scope.isFirst = function(data){
      	return $scope.tree.indexOf(data)
    }

    $scope.enableReply = function(data){
      	$scope.tree= $scope.deactivatePreviousReplies($scope.tree)// para desactivar un reply anterior no hay otra opcion que iterar atraves de todo el arbol.

      	data.showReply = true;
    }

    $scope.showReply = function(){
      	return $scope.reply
    }

    $scope.cerrarReply=function(){
      	$scope.tree=$scope.deactivatePreviousReplies($scope.tree)
    }

    $scope.arrayWithUser = []

    $scope.getCourseComments = function(){
      	UserService.getCourseComments({Id_curso: $scope.$sessionStorage.CurrentCurso}).then(function(response){
          	var commentArray = response.data;
          	var cont = 0;
          	var contuser=0;
          	for (var i = 0; i < commentArray.length; i++) {
            	var userId = 0
            	if(commentArray[i].Id_docente)
              		userId = commentArray[i].Id_docente
            	else
              		userId = commentArray[i].Id_estudiante

	           	UserService.getPoster({id:userId}).then(function(response2){
	                commentArray[contuser].user = response2.data.email
	                contuser = contuser +1;
	                if(contuser ===commentArray.length){
	                  	for (var i = 0; i < commentArray.length; i++) {
	                    	if(commentArray[i].Id_comentario_padre === -1){
	                        	$scope.tree.push({id:commentArray[i].Id_comentario,user: commentArray[i].user, text: commentArray[i].descripción,nodes: []})	//SE AÑADEN LOS NODOS PADRES
	                        	$scope.tree[cont].nodes=$scope.fillChildrenNodes(commentArray,commentArray[i].Id_comentario)
	                        	cont = cont +1;
	                    	}
	                  	}
	                }
	         	})
	       	}//fin 1st for
      	})
    }

    $scope.fillChildrenNodes = function(array, parentId){
        var newArray = [];
        var cont = 0;
        for (var i = 0; i < array.length; i++) {
          	if(array[i].Id_comentario_padre === parentId){
              	newArray.push({id:array[i].Id_comentario,user: array[i].user,text: array[i].descripción,nodes: []})
              	var children = $scope.fillChildrenNodes(array, array[i].Id_comentario)
              	if(children.length > 0 ){
                	newArray[cont].nodes=children
                	cont= cont +1;
              	}
          	}
        }
        return newArray;
    }

   	$scope.deactivatePreviousReplies = function(array){
      var newArray = []
   		var cont = 0
     	for (var i = 0; i < array.length; i++) {
            array[i].showReply = false;
            newArray.push(array[i])
            if(array[i].nodes.length > 0 ){
              	newArray[i].nodes = $scope.deactivatePreviousReplies(array[i].nodes)
              	cont = cont+1;
            }
       	}
   		return newArray
  	}

  	$scope.goHome=function(){
  		$state.go('home');
  	}


    $scope.iniciar = function(algo){
      	if (algo==="inicia_se") {
        	$state.go('login');
      	}else{
         	$state.go('signUp');
      	}
   	}
    //fin comentarios
  }]);
