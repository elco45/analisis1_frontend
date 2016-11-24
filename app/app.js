var app = angular.module('AngularScaffold', ['ui.router','ngDragDrop','ngStorage','AngularScaffold.Services', 'AngularScaffold.Controllers']);

angular.module('AngularScaffold.Controllers', []);
angular.module('AngularScaffold.Services', []);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('start');
	$stateProvider
		.state('home', {
            url: '/home',
            params: {content:undefined},
            templateUrl: '/viewsAdmin/addRooms.html'
        })
        .state('login', {
            url: '/login',
            params: {content:undefined},
            templateUrl: '/viewsAdmin/login.html'
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
        .state('reports', {
            url: '/reports',
            params: {content:undefined},
            templateUrl: '/viewsAdmin/history.html'
        })
        .state('choose', {
            url: '/choose',
            params: {content:undefined},
            templateUrl: '/viewsAdmin/chooseEmps.html'
        })
        .state('dist', {
            url: '/dist',
            params: {content:undefined},
            templateUrl: '/viewsAdmin/distributeRooms.html',
        })
        .state('emp', {
            url: '/emp',
            params: {content:undefined},
            templateUrl: '/viewsAdmin/mainEmp.html'
        })
        .state('roomemp', {
            url: '/roomemp',
            params: {content:undefined},
            templateUrl: '/viewsAdmin/roomEmp.html'
        })
        .state('start', {
            url: '/start',
            params: {content:undefined},
            templateUrl: '/viewsAdmin/start_page.html'
        })
        .state('pin_login', {
            url: '/login_emp',
            params: {content:undefined},
            templateUrl: '/viewsAdmin/pin_login.html'
        });
}])