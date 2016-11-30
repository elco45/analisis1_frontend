angular.module('AngularScaffold.Controllers')
  .controller('HistoryController', ['HistoryService' , '$scope', '$state', '$rootScope', '$sessionStorage',
    function (HistoryService, $scope, $state, $rootScope, $sessionStorage) {
      $scope.reportsList = [];
      $scope.lista_problemas = [];
      $scope.userList = [];
      $scope.statesList = [];
      $scope.records = [];
      $scope.reportBackup =[];
      $scope.startDate =  new Date(2015, 11, 31);
      $scope.endDate = new Date();
      $scope.recordLimit = 8;

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
        });
      };

      $scope.getResolved = function(){
          HistoryService.getResolved().then(function(response){
            $scope.lista_problemas  = response.data
          });
          console.log($scope.lista_problemas);
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
        console.log("numero de habitacion es: "+params.employee_username);

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

      $scope.filterByUsername = function(state){
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
        var final = document.getElementById('end').value;
        for (var i = 0; i < $scope.reportsList.length; i++) {
          var date = $scope.reportsList[i].date_reported.substring(0,10);
          if (date > final || date < inicio) {
            $scope.reportsList.splice(i,1);
            i--;
          }
        }
      };

    }]);
