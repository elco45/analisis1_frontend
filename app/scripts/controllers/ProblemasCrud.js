angular.module('AngularScaffold.Controllers')
  .controller('ProblemasCrud', ['HistoryService' , '$scope', '$state', '$rootScope', '$sessionStorage',
    function (HistoryService, $scope, $state, $rootScope, $sessionStorage) {
      $scope.crear_problema= function(){
        console.log("katherin no ayuda");
      }
     
    }]);
