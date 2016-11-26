var app = angular.module('AngularScaffold', ['ui.router','ngDragDrop','ngStorage','AngularScaffold.Services', 'AngularScaffold.Controllers']);

angular.module('AngularScaffold.Controllers', []);
angular.module('AngularScaffold.Services', []);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('start');
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
        .state('manage', {
            url: '/manage',
            params: {content:undefined},
            templateUrl: '/views/manageUsers.html'
        })
        .state('reports', {
            url: '/reports',
            params: {content:undefined},
            templateUrl: '/views/history.html'
        })
        .state('emp', {
            url: '/emp',
            params: {content:undefined},
            templateUrl: '/views/mainEmp.html'
        })
        .state('start', {
            url: '/start',
            params: {content:undefined},
            templateUrl: '/views/start_page.html'
        })
        .state('pin_login', {
            url: '/login_emp',
            params: {content:undefined},
            templateUrl: '/views/pin_login.html'
        });
}])