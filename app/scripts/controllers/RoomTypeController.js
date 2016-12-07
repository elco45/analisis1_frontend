angular.module('AngularScaffold.Controllers')
  .controller('RoomTypeController', ['RoomTypeService' , '$scope', '$state', '$rootScope', '$sessionStorage',
    function (RoomTypeService, $scope, $state, $rootScope, $sessionStorage) {
    $scope.roomTypes = [];
    $scope.roomType = {};

    $scope.getAllRoomType = function(){
    	RoomTypeService.getAllRoomType().then(function(response){
    		roomType = response.data;
    	})
    }

    $scope.createRoomType = function(){
    	var param = [
	    	{description: "Sencilla con aire acondicionado"},
	    	{description: "Doble con aire acondicionado"},
	    	{description: "Triple con aire acondicionado"},
	    	{description: "Sencilla con ventilador"},
	    	{description: "Doble con ventilador"},
	    	{description: "Triple con ventilador"},
	    	{description: "Apartamento con aire acondicionado"}
	    ]
	    for (var i = 0; i < param.length; i++) {
	    	RoomTypeService.CreateRoomType(param[i]).then(function(response){

    		})
	    }
    	
    }

    $scope.getRoomType = function(id){
    	RoomTypeService.GetRoomType(id).then(function(response){
    		roomType = response.data;
    	})
    }

}]);