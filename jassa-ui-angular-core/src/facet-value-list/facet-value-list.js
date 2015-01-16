angular.module('ui.jassa.facet-value-list', [])

/**
 * Controller for the SPARQL based FacetTree
 * Supports nested incoming and outgoing properties
 *
 */
.controller('FacetValueListCtrl', ['$rootScope', '$scope', '$q', function($rootScope, $scope, $q) {

    $scope.filterText = '';

    $scope.pagination = {
        totalItems: 0,
        currentPage: 1,
        maxSize: 5
    };

    $scope.path = null;
    var facetValueService = null;

    var updateFacetValueService = function() {
        var isConfigured = $scope.sparqlService && $scope.facetTreeConfig && $scope.path;

        //facetValueService = isConfigured ? new jassa.facete.FacetValueService($scope.sparqlService, $scope.facetTreeConfig) : null;
        if(isConfigured) {
            var facetConfig = $scope.facetTreeConfig.getFacetConfig();
            facetValueService = new facete.FacetValueService($scope.sparqlService, facetConfig, 5000000);
        }
    };

    var refresh = function() {
        var path = $scope.path;

        if(!facetValueService || !path) {
            $scope.totalItems = 0;
            $scope.facetValues = [];
            return;
        }

        facetValueService.prepareTableService($scope.path, true)
            .then(function(ls) {

                var filter = null;
                var pageSize = 10;
                var offset = ($scope.pagination.currentPage - 1) * pageSize;

                var countPromise = ls.fetchCount(filter);
                var dataPromise = ls.fetchItems(filter, pageSize, offset);

                $q.when(countPromise).then(function(countInfo) {
                    //console.log('countInfo: ', countInfo);

                    $scope.pagination.totalItems = countInfo.count;
                });

                $q.when(dataPromise).then(function(entries) {
                    var items = entries.map(function(entry) {
                        return entry.val;
                    });
                    /*
                    var items = entries.map(function(entry) {
                        var labelInfo = entry.val.labelInfo = {};
                        labelInfo.displayLabel = '' + entry.key;
                        //console.log('entry: ', entry);

                        var path = $scope.path;
                        entry.val.node = entry.key;
                        entry.val.path = path;

                        entry.val.tags = {};

                        return entry.val;
                    });
                    */
                    var cm = $scope.facetTreeConfig.getFacetConfig().getConstraintManager();
                    var cs = cm.getConstraintsByPath(path);
                    var values = {};
                    cs.forEach(function(c) {
                        if(c.getName() === 'equals') {
                            values[c.getValue()] = true;
                        }
                    });

                    items.forEach(function(item) {
                        var isConstrained = values['' + item.node];
                        item.tags = item.tags || {};
                        item.tags.isConstrainedEqual = isConstrained;
                    });

                    $scope.facetValues = items;
                });
            });
    };

    var update = function() {
        updateFacetValueService();
        refresh();
    };

    $scope.ObjectUtils = jassa.util.ObjectUtils;

    var watchList = '[ObjectUtils.hashCode(facetTreeConfig), "" + path, pagination.currentPage]';
    $scope.$watch(watchList, function() {
        update();
    }, true);

    $scope.$watch('sparqlService', function() {
        update();
    });



    $scope.toggleConstraint = function(item) {
        var constraintManager = $scope.facetTreeConfig.getFacetConfig().getConstraintManager();

        var path = $scope.path;
        var node = item.node;
        var constraint = new jassa.facete.ConstraintEquals(path, node);

        // TODO Integrate a toggle constraint method into the filterManager
        constraintManager.toggleConstraint(constraint);
    };

    $scope.filterTable = function(filterText) {
        $scope.filterText = filterText;
        update();
    };


    /*
    $scope.$on('facete:facetSelected', function(ev, path) {

        $scope.currentPage = 1;
        $scope.path = path;

        updateItems();
    });

    $scope.$on('facete:constraintsChanged', function() {
        updateItems();
    });
    */
//  $scope.firstText = '<<';
//  $scope.previousText = '<';
//  $scope.nextText = '>';
//  $scope.lastText = '>>';

}])

/**
 * The actual dependencies are:
 * - sparqlServiceFactory
 * - facetTreeConfig
 * - labelMap (maybe this should be part of the facetTreeConfig)
 */
.directive('facetValueList', function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'template/facet-value-list/facet-value-list.html',
        transclude: false,
        require: 'facetValueList',
        scope: {
            sparqlService: '=',
            facetTreeConfig: '=',
            path: '=',
            onSelect: '&select'
        },
        controller: 'FacetValueListCtrl'
//        compile: function(elm, attrs) {
//            return function link(scope, elm, attrs, controller) {
//            };
//        }
    };
})

;

