angular.module('main')
.controller('projectsCtrl', ['$scope', '$http', '$location', '$mdDialog', '$timeout', function($scope, $http, $location, $mdDialog, $timeout) {
	$http({method:'GET', url:'/projects'}).success(function(data) {
		$scope.projects = data;
	});

	$scope.createProject = function() {
		// console.log("Button press");
		$location.path('/createProject');
	};

	$scope.deleteProject = function(project, ev) {
		var confirm = $mdDialog.confirm()
		.parent(angular.element(document.body))
		.title('Are you sure you wish to delete project ' + project.name + '?')
		.content('This will delete the project and prevent it from showing up in the list of projects.')
		.ariaLabel('Delete the project')
		.ok('Yes')
		.cancel('No');
		$mdDialog.show(confirm).then($timeout(function() {
				$http({method:'POST', url:'/deleteProject', data: project}).success(function() {
					$scope.updateProjects();
				});
				//debugger;
			}, function() {}))
	}
	$scope.updateProjects = function() {
		$http({method:'GET', url:'/projects'}).success(function(data) {
			$scope.projects = data;
		});
	};

	// debugger;
}]);
