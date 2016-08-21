var app = angular.module('AngularScaffold', ['ui.router', 'ngStorage','AngularScaffold.Services', 'AngularScaffold.Controllers']);

angular.module('AngularScaffold.Controllers', []);
angular.module('AngularScaffold.Services', []);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('manage');
	$stateProvider
		.state('home', {
            url: '/home',
            params: {content:undefined},
            templateUrl: '/viewsAdmin/addRooms.html',
            controller: 'UsersController'
        })
        .state('login', {
            url: '/login',
            params: {content:undefined},
            templateUrl: '/viewsAdmin/loginAdmin.html',
            controller: 'UsersController'
        })
        .state('manage', {
            url: '/manage',
            params: {content:undefined},
            templateUrl: '/viewsAdmin/manageUsers.html',
            controller: 'UsersController'
        })
        .state('choose', {
            url: '/choose',
            params: {content:undefined},
            templateUrl: '/viewsAdmin/chooseEmps.html',
            controller: 'UsersController'
        });
}])
