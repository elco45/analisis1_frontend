angular.module('AngularScaffold.Controllers')
	.controller('HomeController', ['AuthService','HomeService' , '$scope', '$state', '$rootScope', '$sessionStorage',
		function ($scope, $rootScope, $sessionStorage, HomeService, $state) {
			$scope.user = {};
			$scope.$sessionStorage = $sessionStorage;

			

}]);