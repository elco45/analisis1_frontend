var app = angular.module('AngularScaffold', ['ui.router', 'ngDragDrop','ngStorage','AngularScaffold.Services', 'AngularScaffold.Controllers']);

angular.module('AngularScaffold.Controllers', []);
angular.module('AngularScaffold.Services', []);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('login');
	$stateProvider
		.state('home', {
            url: '/home',
            params: {content:undefined},
            templateUrl: '/viewsAdmin/addRooms.html'
        })
        .state('login', {
            url: '/login',
            params: {content:undefined},
            templateUrl: '/viewsAdmin/loginAdmin.html'
        })
        .state('addRoom', {
            url: '/addRooms',
            params: {content:undefined},
            templateUrl: '/viewsAdmin/addRooms.html'
        })
        .state('manage', {
            url: '/manage',
            params: {content:undefined},
            templateUrl: '/viewsAdmin/manageUsers.html'
        })
        .state('choose', {
            url: '/choose',
            params: {content:undefined},
            templateUrl: '/viewsAdmin/chooseEmps.html'
        })
        .state('dist', {
            url: '/dist',
            params: {content:undefined},
            templateUrl: '/viewsAdmin/distributeRooms.html'
        });
}])
