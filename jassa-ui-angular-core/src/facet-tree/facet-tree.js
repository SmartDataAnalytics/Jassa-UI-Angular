angular.module('ui.jassa.facet-tree', ['ui.jassa.template-list'])

/*
.controller('FacetDirCtrl', ['$scope', function($scope) {
    dirset.offset = dirset.listFilter.getOffset() || 0;
    dirset.limit = dirset.listFilter.getLimit() || 0;
    dirset.pageCount = dirset.limit ? Math.floor(dirset.childCountInfo.count / dirset.limit) : 1;
    dirset.currentPage = dirset.limit ? Math.floor(dirset.offset / dirset.limit) + 1 : 1;
}])
*/

.controller('FacetNodeCtrl', ['$scope', function($scope) {
    $scope.$watchCollection('[facet.incoming, facet.outgoing]', function() {
        var facet = $scope.facet;
        if(facet) {
            $scope.dirset = facet.outgoing ? facet.outgoing : facet.incoming;
        }
    });

    $scope.$watchCollection('[dirset, dirset.listFilter.getOffset(), dirset.listFilter.getLimit(), dirset.childCountInfo.count]', function() {
        var dirset = $scope.dirset;
        if(dirset) {
            dirset.offset = dirset.listFilter.getOffset() || 0;
            dirset.limit = dirset.listFilter.getLimit() || 0;
            dirset.pageCount = dirset.limit ? Math.floor(dirset.childCountInfo.count / dirset.limit) : 1;
            dirset.currentPage = dirset.limit ? Math.floor(dirset.offset / dirset.limit) + 1 : 1;
        }
    });

}])

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
    $scope.Math = Math;

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
            filter = new jassa.facete.ListFilter(null, 10, 0);
            pathHeadToFilter.put(pathHead, filter);
        }

        filter.setConcept(filterString);
        filter.setOffset(0);


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


    $scope.selectPage = function(pathHead, page) {
        var pathHeadToFilter = $scope.facetTreeConfig.getFacetTreeState().getPathHeadToFilter();
        var filter = pathHeadToFilter.get(pathHead);
        if(!filter) {
            filter = new jassa.facete.ListFilter(null, 10, 0);
            pathHeadToFilter.put(pathHead, filter);
        }
        var newOffset = (page - 1) * filter.getLimit();
        filter.setOffset(newOffset);
        //console.log('newOffset: ' + newOffset);
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
