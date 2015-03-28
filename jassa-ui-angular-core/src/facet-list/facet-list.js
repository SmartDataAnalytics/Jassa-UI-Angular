angular.module('ui.jassa.facet-list', ['ui.jassa.breadcrumb', 'ui.jassa.paging-style', 'ui.jassa.paging-model', 'ui.bootstrap', 'dddi']) // ui.bootstrap for paginator


/**
 * Controller for the SPARQL based FacetTree
 * Supports nested incoming and outgoing properties
 *
 */
.controller('FacetListCtrl', ['$rootScope', '$scope', '$q', '$dddi', function($rootScope, $scope, $q, $dddi) {

    // TODO Rename plugins to facetPlugins
    // Alternatively, plugins could be tagged to which type they apply
    $scope.facetPlugins = $scope.facetPlugins || [];
    $scope.showConstraints = false;

    var listServiceWatcher = new ListServiceWatcher($scope, $q);

    $scope.ls = listServiceWatcher.watch('listService');

    $scope.pagingStyle = $scope.pagingStyle || {};
    $scope.ObjectUtils = jassa.util.ObjectUtils;
    $scope.loading = $scope.loading || {data: false, pageCount: false};
    $scope.NodeUtils = jassa.rdf.NodeUtils;
    $scope.breadcrumb = $scope.breadcrumb || {};

    $scope.location = null;



    // Maps to track the filters set for the facets, facet values and the constraints
    $scope.locationToFilter = new jassa.util.HashMap();


    var modes = {
        constraint: {
            type: 'constraint',
            itemTemplate: 'template/facet-list/facet-list-item-constraint.html',
            listServiceFn: function() {
                var r = $scope.constraintService;
                return r;
            }
        },
        facet: {
            type: 'facet',
            itemTemplate: 'template/facet-list/facet-list-item-facet.html',
            listServiceFn: function() {
                var r = ( $scope.facetService
                    ? $scope.facetService.prepareListService($scope.breadcrumb.pathHead)
                    : null );

                return r;
            }
        },
        facetValue: {
            type: 'facetValue',
            itemTemplate: 'template/facet-list/facet-list-item-facet-value.html',
            listServiceFn: function() {
                var r = ( $scope.facetValueService
                    ? $scope.facetValueService.prepareTableService($scope.facetValuePath, true)
                    : null );

                return r;
            }
        }
    };



    /*
    $scope.pathToFilter = new jassa.util.HashMap();
    $scope.pathHeadToFilter = new jassa.util.HashMap();
    $scope.constraintFilter = {}; //new jassa.util.HashMap();
    */


    var defs = {
        pathHead: new jassa.facete.PathHead(new jassa.facete.Path()),
        property: null
    };

    _.defaults($scope.breadcrumb, defs);



    // This property is derived from the values of $scope.facetValueProperty
    $scope.facetValuePath = null;


    /*
     * Actions
     */

    /**
     * Moves to the sub-facets via a property
     */
    $scope.descendFacet = function(property) {
        var pathHead = $scope.breadcrumb.pathHead;

        var newStep = new jassa.facete.Step(property.getUri(), pathHead.isInverse());
        var newPath = pathHead.getPath().copyAppendStep(newStep);
        $scope.breadcrumb.pathHead = new jassa.facete.PathHead(newPath, pathHead.isInverse());
    };


    /**
     * Creates a path object by appending a property to a pathHead
     */
    var appendProperty = function(pathHead, propertyName) {
        var result = pathHead.getPath().copyAppendStep(new jassa.facete.Step(propertyName, pathHead.isInverse()));
        return result;
    };


    /*
    var updateFacetService = function() {
        if($scope.facetService) {
            $q.when($scope.facetService.prepareListService($scope.breadcrumb.pathHead)).then(function(listService) {
                $scope.listService = listService;
            });
        }
    };

    var updateFacetValueService = function() {
        if($scope.facetValueService) {
            $q.when($scope.facetValueService.prepareTableService($scope.facetValuePath, true)).then(function(listService) {
                $scope.listService = listService;
            });
        }
    };
    */

    $scope.toggleConstraint = function(node) {
        var path = $scope.facetValuePath;
        var constraintManager = $scope.constraintManager;

        var constraint = new jassa.facete.ConstraintEquals(path, node);

        // TODO Integrate a toggle constraint method into the filterManager
        constraintManager.toggleConstraint(constraint);
    };

    /*
     * Refresh
     */

    /*
    var update = function() {
        var promise = $scope.mode.listServiceFn();
        $q.when(promise).then(function(listService) {
            $scope.listService = listService;
        })
    }
    */
    /*
    var update = function() {
        if($scope.facetValuePath == null) {
            updateFacetService();
        } else {
            updateFacetValueService();
        }
    };
    */

    /*
     * DDDI
     */

    var dddi = $dddi($scope);

    dddi.register('mode', ['showConstraints', 'breadcrumb.pathHead.hashCode()', '?breadcrumb.property', function(showConstraints) {
        var breadcrumb = $scope.breadcrumb;

        var r;
        if(showConstraints === true) {
            r = modes['constraint'];
        } else {
            var property = breadcrumb.property;

            if(property === true) { // facet values for the empty facet
                r = modes['facetValue'];
            } else {
                r = property == null ? modes['facet'] : modes['facetValue'];
            }
        }
        return r;
    }]);

    dddi.register('facetValuePath', ['breadcrumb.pathHead.hashCode()', 'breadcrumb.property', // property may be null, but breadcrumb must exist
        function() {
            var breadcrumb = $scope.breadcrumb;
            var property = breadcrumb.property;

            var r;
            if(property === true) {
                r = $scope.breadcrumb.pathHead.getPath();
            } else {
                r = property == null ? null : appendProperty($scope.breadcrumb.pathHead, property);
            }
            return r;
        }]);

    dddi.register('location', ['mode', '?facetValuePath.hashCode()', '?breadcrumb.pathHead.hashCode()',
        function() {
            var r;
            if($scope.mode.type === 'constraint') {
                r = jassa.facete.Path.parse('constraint'); //'constraint';
            } else {
                r = $scope.facetValuePath != null ? $scope.facetValuePath : $scope.breadcrumb.pathHead;
            }

            return r;
        }]);


    /**
     * Retrieve the filter object for the given location and mode
     */
    dddi.register('listFilter', ['location.hashCode()',
        function(location) {
            var r = $scope.locationToFilter.get($scope.location);
            if(r == null) {
                r = { limit: 10, offset: 0, concept: null };
                $scope.locationToFilter.put($scope.location, r);
            }
            return r;
        }]);

    dddi.register('filterModel', ['listFilter.concept', function(concept) {
        return concept;
    }]);

    $scope.$watch('listFilter', function(listFilter) {
        if(listFilter) {
            angular.copy(listFilter, $scope.ls.ctrl.filter);
        }
    });

    /*
    dddi.register('ls.ctrl.filter', ['?listFilter',
        function(listFilter) {
            //var r = listFilter || $scope.ls.ctrl.filter; // retain the value if the argument is null
            var r = listFilter;
            return r;
        }]);
    */


    dddi.register('listService', ['mode', 'location', 'facetService', 'facetValueService', 'constraintService', function(mode) {
        var r = mode.listServiceFn();
        return r;
    }]);

    dddi.register('totalConstraints', ['constraintManager.getConstraints().length', function(r) {
        return r;
    }]);

}])


/**
 * The actual dependencies are:
 * - sparqlServiceFactory
 * - facetTreeConfig
 * - labelMap (maybe this should be part of the facetTreeConfig)
 */
.directive('facetList', function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'template/facet-list/facet-list.html',
        //transclude: false,
        scope: {
            constraintManager: '=',
            lookupServiceNodeLabels: '=',
            facetService: '=',
            facetValueService: '=',
            constraintService: '=',


            //sparqlService: '=',
            //facetTreeConfig: '=',
            //facetConfig: '=',
            listFilter: '=?',
            breadcrumb: '=?uiModel', // The visible facet / facetValue
            pathHead: '=?',
            facetPlugins: '=?',
            pluginContext: '=?', //plugin context
            pagingStyle: '=?',
            loading: '=?',
            onSelect: '&select'
        },
        controller: 'FacetListCtrl',
        compile: function(elm, attrs) {
            return function link(scope, elm, attrs, controller) {
            };
        }
    };
});
