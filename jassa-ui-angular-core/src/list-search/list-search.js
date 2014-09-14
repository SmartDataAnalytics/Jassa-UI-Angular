angular.module('ui.jassa.list-search', [])

.controller('ListSearchCtrl', ['$scope', function($scope) {
    // Don't ask me why this assignment does not trigger a digest
    // if performed inline in the directive...
    $scope.setActiveSearchMode = function(searchMode) {
        $scope.activeSearchMode = searchMode;
    };
}])

.directive('listSearch', function() {
    return {
        restrict: 'EA',
        scope: {
            searchModes: '=',
            activeSearchMode: '=',
            ngModel: '=',
            onSubmit: '&submit'
        },
        controller: 'ListSearchCtrl',
        templateUrl: 'template/list-search/list-search.html'
    };
})

;

