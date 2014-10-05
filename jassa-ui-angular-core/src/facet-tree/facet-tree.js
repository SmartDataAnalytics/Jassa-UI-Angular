angular.module('ui.jassa.facet-tree', ['ui.jassa.template-list'])

/**
 * Controller for the SPARQL based FacetTree
 * Supports nested incoming and outgoing properties
 *
 */
.controller('FacetTreeCtrl', ['$rootScope', '$scope', '$q', '$timeout', function($rootScope, $scope, $q, $timeout) {

    var self = this;

    var updateFacetTreeService = function() {
        var isConfigured = $scope.sparqlService && $scope.facetTreeConfig;
        $scope.facetTreeService = isConfigured ? jassa.facete.FacetTreeServiceUtils.createFacetTreeService($scope.sparqlService, $scope.facetTreeConfig) : null;
    };

    var update = function() {
        updateFacetTreeService();
        self.refresh();
    };


    $scope.ObjectUtils = jassa.util.ObjectUtils;

    var watchList = '[ObjectUtils.hashCode(facetTreeConfig)]';
    $scope.$watch(watchList, function() {
        update();
    }, true);

    $scope.$watch('sparqlService', function() {
        update();
    });


    $scope.doFilter = function(pathHead, filterString) {
        var pathHeadToFilter = $scope.facetTreeConfig.getFacetTreeState().getPathHeadToFilter();
        var filter = pathHeadToFilter.get(pathHead);
        if(!filter) {
            filter = new jassa.facete.ListFilter();
            pathHeadToFilter.put(pathHead, filter);
        }

        filter.setConcept(filterString);


        //getOrCreateState(path).getListFilter().setFilter(filterString);

        //$scope.facetTreeConfig.getPathToFilterString().put(path, filterString);
        //self.refresh();
    };

    self.refresh = function() {

        if($scope.facetTreeService) {
            var promise = $scope.facetTreeService.fetchFacetTree();
            $q.when(promise).then(function(data) {
                $scope.facet = data;
                //console.log('TREE: ' + JSON.stringify($scope.facet, null, 4));
            });

        } else {
            $scope.facet = null;
        }
    };

    $scope.toggleControls = function(path) {
        var pathToTags = $scope.facetTreeConfig.getPathToTags();
        //tags.showControls = !tags.showControls;
        var tags = pathToTags.get(path);
        if(!tags) {
            tags = {};
            pathToTags.put(path, tags);
        }

        tags.showControls = !tags.showControls;
    };

    $scope.toggleCollapsed = function(path) {
        var pathExpansions = $scope.facetTreeConfig.getFacetTreeState().getPathExpansions();
        jassa.util.CollectionUtils.toggleItem(pathExpansions, path);

        // No need to refresh here, as we are changing the config object
        //self.refresh();
    };

    $scope.selectIncoming = function(path) {
        if($scope.facetTreeConfig) {
            var pathToDirection = $scope.facetTreeConfig.getFacetTreeState().getPathToDirection();
            pathToDirection.put(path, -1);

            // No need to refresh here, as we are changing the config object
            //self.refresh();
        }
    };

    $scope.selectOutgoing = function(path) {
        if($scope.facetTreeConfig) {
            var pathToDirection = $scope.facetTreeConfig.getFacetTreeState().getPathToDirection();
            pathToDirection.put(path, 1);

            // No need to refresh here, as we are changing the config object
            //self.refresh();
        }
    };

}])

/**
 * The actual dependencies are:
 * - sparqlServiceFactory
 * - facetTreeConfig
 * - labelMap (maybe this should be part of the facetTreeConfig)
 */
.directive('facetTree', function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'template/facet-tree/facet-tree-item.html',
        transclude: false,
        require: 'facetTree',
        scope: {
            sparqlService: '=',
            facetTreeConfig: '=',
            plugins: '=',
            pluginContext: '=', //plugin context
            onSelect: '&select'
        },
        controller: 'FacetTreeCtrl',
        compile: function(elm, attrs) {
            return function link(scope, elm, attrs, controller) {
            };
        }
    };
})

;
