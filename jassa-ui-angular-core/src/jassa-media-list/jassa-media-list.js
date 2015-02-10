angular.module('ui.jassa.jassa-media-list', ['ui.jassa.include-replace'])

.controller('JassaMediaListCtrl', ['$scope', '$q', '$timeout', function($scope, $q, $timeout) {
    $scope.currentPage = 1;

    $scope.limit = $scope.limit || 10;
    $scope.offset = $scope.offset || 0;
    $scope.items = $scope.items || [];
    $scope.maxSize = $scope.maxSize || 6;




    // TODO Get rid of the $timeouts - not sure why $q.when alone breaks when we return results from cache

    $scope.doRefresh = function() {
        $q.when($scope.listService.fetchCount($scope.filter)).then(function(countInfo) {
            $timeout(function() {
                $scope.totalItems = countInfo.count;
            });
        });

        $q.when($scope.listService.fetchItems($scope.filter, $scope.limit, $scope.offset)).then(function(items) {
            $timeout(function() {
                $scope.items = items.map(function(item) {
                    return item.val;
                });
            });
        });
    };


    $scope.$watch('offset', function() {
        $scope.currentPage = Math.floor($scope.offset / $scope.limit) + 1;
    });

    $scope.$watch('currentPage', function() {
        $scope.offset = ($scope.currentPage - 1) * $scope.limit;
    });


    $scope.$watch('[filter, limit, offset, refresh]', $scope.doRefresh, true);
    $scope.$watch('listService', $scope.doRefresh);
}])

.directive('jassaMediaList', [function() {
    return {
        restrict: 'EA',
        templateUrl: 'template/jassa-media-list/jassa-media-list.html',
        //transclude: true,
        replace: true,
        scope: {
            listService: '=',
            filter: '=?',
            limit: '=?',
            offset: '=?',
            totalItems: '=?',
            //currentPage: '=',
            itemTemplate: '=',
            items: '=?',
            maxSize: '=?',
            refresh: '=?', // Extra attribute that is deep watched on changes for triggering refreshs
            context: '=?' // Extra data that can be passed in // TODO I would prefer access to the parent scope
        },
        controller: 'JassaMediaListCtrl',
        link: function(scope, element, attrs, ctrl, transcludeFn) {
//            transcludeFn(scope, function(clone, scope) {
//                var e = element.find('ng-transclude');
//                var p = e.parent();
//                e.remove();
//                p.append(clone);
//            });
        }
    };
}])

;
