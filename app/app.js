var app = angular.module('AngularScaffold', ['ui.router', 'ngStorage','AngularScaffold.Services', 'AngularScaffold.Controllers']);

angular.module('AngularScaffold.Controllers', []);
angular.module('AngularScaffold.Services', []);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('home');
	$stateProvider
		.state('home', {
            url: '/home',
            params: {content:undefined},
            templateUrl: '/views/home.html',
            controller: 'UsersController'
        })
        .state('login', {
            url: '/login',
            params: {content:undefined},
            templateUrl: '/views/login.html',
            controller: 'UsersController'
        })
        .state('estudiante_main', {
            url: '/estudiante_main',
            params: {content:undefined},
            templateUrl: '/views/estudiante_main.html',
            controller: 'EstudianteController'
        })
        .state('docente_main', {
            url: '/docente_main',
            params: {content:undefined},
            templateUrl: '/views/docente_main.html',
            controller: 'DocenteController'
        })
        .state('estudiante', {
            url: '/estudiante',
            params: {content:undefined},
            templateUrl: '/views/estudiante.html',
            controller: 'EstudianteController'
        })
        .state('docente', {
            url: '/docente',
            params: {content:undefined},
            templateUrl: '/views/docente.html',
            controller: 'DocenteController'
        })
        .state('signUp', {
            url: '/signUp',
            params: {content:undefined},
            templateUrl: '/views/signUp.html',
            controller: 'UsersController'
        })
        .state('solucion', {
            url: '/solucion',
            params: {content:undefined},
            templateUrl: '/views/estudiante_solucion_main.html',
            controller: 'EstudianteController'
        })
		.state('nota', {
            url: '/nota',
            params: {content:undefined},
            templateUrl: '/views/docente_nota_main.html',
            controller: 'DocenteController'
        });
}])
