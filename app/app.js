var app = angular.module('AngularScaffold', ['ui.router', 'ngStorage','AngularScaffold.Services', 'AngularScaffold.Controllers']);

angular.module('AngularScaffold.Controllers', []);
angular.module('AngularScaffold.Services', []);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('login');
	$stateProvider
		.state('home', {
            url: '/home',
            params: {content:undefined},
            templateUrl: '/views/addRooms.html'
        })
        .state('login', {
            url: '/login',
            params: {content:undefined},
            templateUrl: '/views/login.html'
        })
        .state('addRoom', {
            url: '/addRooms',
            params: {content:undefined},
            templateUrl: '/views/addRooms.html'
        })
        .state('manage', {
            url: '/manage',
            params: {content:undefined},
            templateUrl: '/views/manageUsers.html'
        })
        .state('choose', {
            url: '/choose',
            params: {content:undefined},
            templateUrl: '/views/chooseEmps.html'
        })
        .state('dist', {
            url: '/dist',
            params: {content:undefined},
            templateUrl: '/views/distributeRooms.html'
        })
        .state('emp', {
            url: '/emp',
            params: {content:undefined},
            templateUrl: '/views/mainEmp.html'
        })
        .state('roomemp', {
            url: '/roomemp',
            params: {content:undefined},
            templateUrl: '/views/roomEmp.html'
        });
}])
