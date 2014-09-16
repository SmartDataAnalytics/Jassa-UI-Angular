angular.module('ui.jassa.jassa-media-list', [])

.controller('JassaMediaListCtrl', ['$scope', '$q', function($scope, $q) {
    $scope.currentPage = 1;

    $scope.doRefresh = function() {
        $q.when($scope.listService.fetchCount($scope.filter)).then(function(countInfo) {
            $scope.totalItems = countInfo.count;
        });

        $q.when($scope.listService.fetchItems($scope.filter, $scope.limit, $scope.offset)).then(function(items) {
            $scope.items = items.map(function(item) {
                return item.val;
            });
        });
    };

//    $scope.$watch('currentPage', function() {
//        $scope.offset = ($scope.currentPage - 1) * $scope.limit;
//    });

    $scope.$watch('offset', function() {
        $scope.currentPage = Math.floor($scope.offset / $scope.limit) + 1;
    });

    $scope.$watch('[filter, limit, currentPage, refresh]', $scope.doRefresh, true);
    $scope.$watch('listService', $scope.doRefresh);
}])

.directive('jassaMediaList', [function() {
    return {
        restrict: 'EA',
        templateUrl: 'template/jassa-media-list/jassa-media-list.html',
        transclude: true,
        replace: true,
        scope: {
            listService: '=',
            filter: '=',
            limit: '=',
            offset: '=',
            totalItems: '=',
            //currentPage: '=',
            items: '=',
            maxSize: '=',
            refresh: '=' // Extra attribute that is deep watched on changes for triggering refreshs
        },
        controller: 'JassaMediaListCtrl',
        link: function(scope, element, attrs, ctrl, transcludeFn) {
            transcludeFn(scope, function(clone, scope) {
                var e = element.find('ng-transclude');
                var p = e.parent();
                e.remove();
                p.append(clone);
            });
        }
    };
}])

;
