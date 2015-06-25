angular.module('main')
.controller('porjectCtrl', ['$rootScope', '$scope', '$http', '$routeParams', '$mdDialog',
	function($rootScope, $scope, $http, $routeParams, $mdDialog) {
		$scope.confirm = false;
		var project = {'heading': $routeParams.id};
		$http({method:'POST', url:'/project', data: project}).success(function(data) {
			$scope.project = data[0];
			$scope.tree = $scope.project.children;
			$scope.treeData = $scope.project.children[0];

			$scope.rootIsEmpty = function() {
				//debugger;
				if (typeof $scope.project.children !== undefined) {
					if ($scope.project.children.length < 1) {
						return true;
					}
				} else {
					return false;
				}
			};
		});
		$scope.saveProject = function() {
			$http({method:'POST', url:'/addChild', data: $scope.project}).success(function() {

			});
		}
		$scope.addRootNode = function() {
			$scope.project.children.push({id: 'node', title:"Root Node" ,nodes: [],collapsed : false, users : [], estimations : []});
		}
		$scope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
			// Appending dialog to document.body to cover sidenav in docs app
			if (!$scope.confirm) {
				event.preventDefault();
				//console.log(newUrl);
				var confirm = $mdDialog.confirm()
				.parent(angular.element(document.body))
				.title('Are you sure you want to leave this page?')
				.content('All unsaved changes will be lost.')
				.ariaLabel('Yes')
				.ok('Yes')
				.cancel('No')
				.targetEvent(event);
				$mdDialog.show(confirm).then(function() {
				newUrl = newUrl.split('#');
				$scope.goTo(newUrl[1]);
				$scope.confirm = true;
				//$scope.saveProject();
			}, function() {
				
			});
			}
		
		});
		$scope.saveProjectDialog = function() {

		}

		$scope.remove = function(scope) {
			scope.remove();
		};

		$scope.toggleNode = function(scope) {
			debugger;
			scope.toggle();
		};

		$scope.moveLastToTheBeginning = function() {
			var a = $scope.data.pop();
			$scope.data.splice(0, 0, a);
		};

		$scope.newSubItem = function(scope) {
			var nodeData = scope.$modelValue;
			nodeData.nodes.push({
				id: nodeData.id * 10 + nodeData.nodes.length,
				title: nodeData.title + '.' + (nodeData.nodes.length + 1),
				nodes: [],
				collapsed : false,
				users : [],
				estimations : []
			});
		};

		$scope.collapseAll = function() {
			$scope.$broadcast('collapseAll');
		};

		$scope.expandAll = function() {
			$scope.$broadcast('expandAll');
		};

		$scope.estimate = function(node) {
			var currnode = $scope.project.children[0];
			var n;
			$scope.searchTree([currnode], node.$$hashKey, function(res) {
				n = res;
			});
			// Push user to user array, if not there already, and place estimation at same index
			$scope.estimateForUser(n, node.qty);
		};

		$scope.estimateForUser = function(node, qty) {
			var user = $rootScope.currentUser;
			var count = 0;
			var found = false;
			for (var u in node.users) {
				if (node.users[u] === user) {
					found = true;
					count = u;
					break;
				}
			}
			if (!found) {
				node.users.push(user);
				node.estimations.push(qty);
			} else {
				node.estimations[count] = qty;
			}
		};

		$scope.searchTree = function(node, id, callback) {
			var found = false;
			var result;
			for (var i in node) {
				if (id === node[i].$$hashKey) {
					found = true;
					callback(node[i]);
				}
			}
			if (found === false) {
				for (i in node) {
					$scope.searchTree(node[i].nodes, id, callback);
				}
			}
		};

		$scope.getEstimateForUser = function() {
			return 1;
		};
	}]);
