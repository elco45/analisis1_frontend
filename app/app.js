var app = angular.module('AngularScaffold', ['ui.router','ngDragDrop','ngStorage','AngularScaffold.Services', 'AngularScaffold.Controllers']);

angular.module('AngularScaffold.Controllers', []);
angular.module('AngularScaffold.Services', []);

app.config(['$stateProvider', '$urlRouterProvider','$provide', function($stateProvider, $urlRouterProvider,$provide) {
    $urlRouterProvider.otherwise('start');
	$stateProvider
		.state('home', {
            url: '/home',
            params: {content:undefined},
            templateUrl: '/views/addRooms.html',
            authenticate: true
        })
        .state('login', {
            url: '/login',
            params: {content:undefined},
            templateUrl: '/views/login.html',
            authenticate: false
        })
        .state('manage', {
            url: '/manage',
            params: {content:undefined},
            templateUrl: '/views/manageUsers.html',
            authenticate: true
        })
        .state('reports', {
            url: '/reports',
            params: {content:undefined},
            templateUrl: '/views/history.html',
            authenticate: true
        })
        .state('emp', {
            url: '/emp',
            params: {content:undefined},
            templateUrl: '/views/mainEmp.html',
            authenticate: true
        })
        .state('start', {
            url: '/start',
            params: {content:undefined},
            templateUrl: '/views/start_page.html',
            authenticate: false
        })
        .state('problemas', {
            url: '/problemas',
            params: {content:undefined},
            templateUrl: '/views/crud_problemas.html',
            authenticate: true
        })
        .state('pin_login', {
            url: '/login_emp',
            params: {content:undefined},
            templateUrl: '/views/pin_login.html',
            authenticate: false
        });

}])