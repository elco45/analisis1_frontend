angular.module('AngularScaffold.Controllers')
  .controller('HistoryController', ['HistoryService' ,'ProblemService', '$scope', '$state', '$rootScope', '$sessionStorage',
    function (HistoryService,ProblemService, $scope, $state, $rootScope, $sessionStorage) {
      $scope.reportsList = [];
      $scope.lista_problemas = [];
      $scope.userList = [];
      $scope.statesList = [];
      $scope.records = [];
      $scope.reportBackup =[];
      $scope.startDate =  new Date(2015, 11, 31);
      $scope.endDate = new Date();
      $scope.recordLimit = 8;
      $scope.problem_list = [];

      $scope.getReports = function(){
        HistoryService.GetReports().then(function(response){
          $scope.reportsList = response.data;
          for(var i=0; i<$scope.reportsList.length; i++) {
            $scope.records.push($scope.reportsList);

            $scope.reportBackup.push(response.data[i]);
            if ($scope.userList.indexOf($scope.reportsList[i].employee_username) === -1) {
              $scope.userList.push($scope.reportsList[i].employee_username);
            }
            if ($scope.statesList.indexOf($scope.reportsList[i].room_state) === -1) {
              $scope.statesList.push($scope.reportsList[i].room_state);
            }
          }
          ProblemService.GetProblema().then(function(response2){
            for (var j = 0; j < $scope.reportsList.length; j++) {
              for (var k = 0; k < response2.data.length; k++) {
                if ($scope.reportsList[j].problem_id === response2.data[k]._id) {
                  $scope.reportsList[j].problem_id = response2.data[k].problem_description;
                };
              };
            };
            $scope.getResolved();
          });
          
          
        });
      };

      $scope.getResolved = function(){
          HistoryService.getResolved().then(function(response){
            $scope.lista_problemas  = response.data

            ProblemService.GetProblema().then(function(response2){
              for (var j = 0; j < $scope.lista_problemas.length; j++) {
                for (var k = 0; k < response2.data.length; k++) {
                  if ($scope.lista_problemas[j].problem_id === response2.data[k]._id) {
                    $scope.lista_problemas[j].problem_id = response2.data[k].problem_description;
                  };
                };
              };
            });

          });
      }
      $scope.cambiar_estado_problema = function(algo){
        var params={
          employee_username:algo.employee_username,
          room_number:  algo.room_number,
          problem_id: algo.problem_id,
          room_state: algo.room_state,
          date_reported: algo.date_reported,
          resolved: true
        }
        HistoryService.modResolved(params).then(function(response2){
          $scope.lista_problemas = [];
          $scope.getResolved ();
        });
      }

      $scope.filter = function(){};

      $scope.filterByUsername = function(username){
        return $scope.filter[username.employee_username] || $scope.noFilter($scope.filter);
      };

      $scope.noFilter = function(filterObj){
        return Object.
        keys(filterObj).
        every(function (key) { return !filterObj[key]; });
      };

      $scope.filterState = function(){};

      $scope.filterByState = function(state){
        return $scope.filterState[state.room_state] || $scope.noFilter($scope.filterState);
      };

      $scope.noFilter = function(filterObj){
        return Object.
        keys(filterObj).
        every(function (key) { return !filterObj[key]; });
      };

      $scope.printToCart = function(printSectionId) {
        var innerContents = document.getElementById(printSectionId).innerHTML;
        var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        popupWinindow.document.open();
        popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
        popupWinindow.document.close();
      }

      $scope.filterByDate = function(property){
        for (var i = 0; i < $scope.reportBackup.length; i++) {
          $scope.reportsList.push($scope.reportBackup[i])
        }
        var inicio = document.getElementById('start').value;
        var compi = inicio.split('-');
        var mi = parseInt(compi[0], 10);
        var di = parseInt(compi[1], 10);
        var yi = parseInt(compi[2], 10);
        var datei = new Date(yi,mi-1,di);

        var final = document.getElementById('end').value;
        var comp = final.split('-');
        var m = parseInt(comp[0], 10);
        var d = parseInt(comp[1], 10);
        var y = parseInt(comp[2], 10);
        var date = new Date(y,m-1,d);

        if (inicio > final || (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) 
              || (datei.getFullYear() == yi && datei.getMonth() + 1 == mi && datei.getDate() == di) ) {
          swal({
            title: "Fecha Incorrecta",
            text: "La fecha debe ser válida",
            type: "warning",
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Continuar!",
            closeOnConfirm: true
          },

          function(){
              $scope.endDate = new Date();
          });
        }else{
          for (var i = 0; i < $scope.reportsList.length; i++) {
            var date = $scope.reportsList[i].date_reported.substring(0,10);
            if (date > final || date < inicio) {
              $scope.reportsList.splice(i,1);
              i--;
            }
          }
        }
      };

    // Salva el tab activo en el localStorage
    $scope.setActiveTab = function (activeTab) {
      sessionStorage.setItem("activeTab", activeTab);
    };
    
    // Get el tab activo en el localStorage
    $scope.getActiveTab = function () {
      if(sessionStorage.getItem("activeTab")){
        return sessionStorage.getItem("activeTab");
      }else{
        return 1;
      }
    };

    $scope.getProblemList = function(){
        ProblemService.GetProblema().then(function(response){
          $scope.problem_list = response.data;
          console.log($scope.problem_list)
        });
      }

}]);
