angular.module('ui.jassa.jassa-list', [])

.controller('JassaListCtrl', ['$scope', '$q', '$timeout', function($scope, $q, $timeout) {

    var defaults = {
        listFilter: {
            concept: null,
            limit: 10,
            offset: 0
        },
        currentPage: 1,
        items: [],
        totalItems: 0,
        maxSize: 7,
        context: {},
        listClass: '',
        paginationOptions: {
            cssClass: 'pagination',
            maxSize: 7,
            rotate: true,
            boundaryLinks: true,
            firstText: '&lt;&lt;',
            previousText: '&lt;',
            nextText: '&gt;',
            lastText: '&gt;&gt;'
        }
    };

    _.defaults($scope, defaults);
    _.defaults($scope.listFilter, defaults.listFilter);
    _.defaults($scope.paginationOptions, defaults.paginationOptions);


    $scope.loading = $scope.loading || { data: false, pageCount: false};
    /*
    $scope.listFilter = $scope.listFilter || { concept: null, limit: 10, offset: 0}; //new jassa.service.ListFilter(null, 10, 0);
    $scope.currentPage = $scope.currentPage || 1;
    $scope.items = $scope.items || [];
    $scope.totalItems = $scope.totalItems || $scope.items.length;
    $scope.maxSize = $scope.maxSize || 7;
    $scope.context = $scope.context || {};
    $scope.listClass = $scope.listClass || '';
    */

    // TODO Get rid of the $timeouts - not sure why $q.when alone breaks when we return results from cache

    $scope.doRefresh = function() {
      $scope.loading.data = true;
      $scope.loading.pageCount = true;

//        $timeout(function() {
//            $scope.items = [];
//            $scope.totalItems = 0;
//        });

        var listFilter = $scope.listFilter;

        var listService = $scope.listService;
        if(angular.isFunction(listService)) {
            listService = listService();
        }

        if(listService == null) {
            return;
        }

        // TODO if the list service is a function, expect the function to return the actual list service
        // We support the list service to be a promise
        $q.when(listService).then(function(listService) {

            $q.when(listService.fetchCount(listFilter.concept)).then(function(countInfo) {
                $timeout(function() {
                    $scope.totalItems = countInfo.count;
                    $scope.loading.pageCount = false;
                });
            });

            $q.when(listService.fetchItems(listFilter.concept, listFilter.limit, listFilter.offset)).then(function(items) {
                $timeout(function() {
                    $scope.items = items.map(function(item) {
                        return item.val;
                    });
                    $scope.loading.data = false;
                });
            });

        });
    };

    $scope.numPages = function() {
        var limit = $scope.listFilter.limit;

        var result = (limit == null ? 1 : Math.ceil($scope.totalItems / limit));

        result = Math.max(result, 1);
        //console.log('Num pages: ' + result);
        return result;
    };

    $scope.$watch('listFilter.offset', function() {
        $scope.currentPage = Math.floor($scope.listFilter.offset / $scope.listFilter.limit) + 1;
    });

    $scope.$watch('currentPage', function() {
        $scope.listFilter.offset = ($scope.currentPage - 1) * $scope.listFilter.limit;
    });

    $scope.$watch(function() {
        return $scope.rawListService;
    }, function(rawListService) {
       jassa.util.PromiseUtils.replaceService($scope, 'listService', rawListService);
    });

    $scope.$watch('[listFilter, refresh]', $scope.doRefresh, true);
    $scope.$watch('listService', $scope.doRefresh);
}])

.directive('jassaList', [function() {
    return {
        restrict: 'EA',
        templateUrl: 'template/jassa-list/jassa-list.html',
        transclude: true,
        //replace: true,
        //scope: true,
        scope: {
            rawListService: '=listService',
            listFilter: '=?', // Any object with the fields {concept, offset, limit}. No need for jassa.service.ListFilter.

            listClass: '=?', // CSS class to apply to the inner list
            paginationOptions: '=?', // Pagination Options

            totalItems: '=?',
            items: '=?',
            loading: '=?',

            //currentPage: '=',
            refresh: '=?', // Extra attribute that is deep watched on changes for triggering refreshs
            context: '=?' // Extra data that can be passed in // TODO I would prefer access to the parent scope
        },
        controller: 'JassaListCtrl',
        link: function(scope, element, attrs, ctrl, transcludeFn) {
            //console.log('My scope: ', scope);
            //var childScope = scope.$new();
//            transcludeFn(childScope, function(clone, scope) {
//                var e = element.find('ng-transclude');
//                var p = e.parent();
//                e.remove();
//                p.append(clone);
//            });


            //transcludeFn(scope, function(clone, scope) {
//                element.append(clone);
//            });


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
