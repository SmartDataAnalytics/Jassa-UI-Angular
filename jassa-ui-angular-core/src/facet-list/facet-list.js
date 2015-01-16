angular.module('ui.jassa.facet-list', ['ui.jassa.breadcrumb'])


/**
 * Controller for the SPARQL based FacetTree
 * Supports nested incoming and outgoing properties
 *
 */
.controller('FacetListCtrl', ['$rootScope', '$scope', '$q', '$timeout', function($rootScope, $scope, $q, $timeout) {

    $scope.showConstraints = false;

    $scope.ObjectUtils = jassa.util.ObjectUtils;
    //$scope.paginationOptions = $scope.paginationOptions || {};

    $scope.loading = $scope.loading || {data: false, pageCount: false};

    $scope.NodeUtils = jassa.rdf.NodeUtils;

    $scope.breadcrumb = {
        pathHead: new jassa.facete.PathHead(new jassa.facete.Path()),
        property: null
    };

    $scope.location = null;

    $scope.listFilter = $scope.listFilter || { limit: 10, offset: 0, concept: null };

    //$scope.listFilter = $scope.listFilter || { limit: 10, offset: 0, concept: null };// new jassa.service.ListFilter();

    $scope.filterMap = new jassa.util.HashMap();


    // This property is derived from the values of $scope.facetValueProperty
    $scope.facetValuePath = null;


    $scope.$watch('filterString', function(newValue) {
        $scope.listFilter.concept = newValue;
    });


    $scope.$watch('location', function() {
        if($scope.location) {
            var lf = $scope.filterMap.get($scope.location);
            if(lf == null) {
                lf = { limit: 10, offset: 0, concept: null };
                $scope.filterMap.put($scope.location, lf);
            }

            $scope.listFilter = lf;
        }

    });

//    $scope.$watch('listFilter', function(newValue) {
//        if($scope.location) {
//
//            var val = newValue == null
//                ? null
//                : {
//                    concept: newValue.concept,
//                    limit: newValue.limit,
//                    offset: newValue.offset
//                };
//
//            filterMap.put($scope.location, val);
//        }
//    }, true);

    $scope.$watch('listFilter.concept', function(newValue) {
        $scope.filterModel = newValue;
        $scope.filterString = newValue;
    });

    $scope.descendFacet = function(property) {
        var pathHead = $scope.breadcrumb.pathHead;

        var newStep = new jassa.facete.Step(property.getUri(), pathHead.isInverse());
        var newPath = pathHead.getPath().copyAppendStep(newStep);
        $scope.breadcrumb.pathHead = new jassa.facete.PathHead(newPath, pathHead.isInverse());
    };


    // Creates a path object by appending a property to a pathHead
    var appendProperty = function(pathHead, propertyName) {
        var result = pathHead.getPath().copyAppendStep(new jassa.facete.Step(propertyName, pathHead.isInverse()));
        return result;
    };

//    $scope.showFacetValues = function(property) {
//    };

    var updateFacetValueService = function() {
        var searchString = $scope.listFilter.concept;

        //console.log('Updating facet values');
        var facetValueService = new jassa.facete.FacetValueService($scope.sparqlService, $scope.facetTreeConfig.getFacetConfig(), 5000000);

        var path = $scope.facetValuePath;

        $q.when(facetValueService.prepareTableService(path, true)).then(function(listService) {

            var fnTransformSearch = function(searchString) {
                var r;
                if(searchString) {

                    var bestLiteralConfig = new jassa.sparql.BestLabelConfig();
                    var relation = jassa.sparql.LabelUtils.createRelationPrefLabels(bestLiteralConfig);
                    // TODO Make it configurable to whether scan URIs too (the true argument)
                    r = jassa.sparql.KeywordSearchUtils.createConceptRegex(relation, searchString, true);
                    //var result = sparql.KeywordSearchUtils.createConceptBifContains(relation, searchString);
                } else {
                    r = null;
                }

                return r;
            };

            listService = new jassa.service.ListServiceTransformConcept(listService, fnTransformSearch);



            listService = new jassa.service.ListServiceTransformItems(listService, function(entries) {

                var cm = $scope.facetTreeConfig.getFacetConfig().getConstraintManager();
                var cs = cm.getConstraintsByPath(path);
                var values = {};
                cs.forEach(function(c) {
                    if(c.getName() === 'equals') {
                        values[c.getValue()] = true;
                    }
                });

                entries.forEach(function(entry) {
                    var item = entry.val;

                    var isConstrained = values['' + item.node];
                    item.isConstrainedEqual = isConstrained;
                });
                //$scope.facetValues = items;
                return entries;
            });


            $scope.listService = listService;
        });

        /*
        facetValueService.prepareTableService(path, false).then(function(ls) {

            $scope.listService = listService;
            var bestLabelConfig = new sparql.BestLabelConfig();
            var labelRelation = sparql.LabelUtils.createRelationPrefLabels(bestLabelConfig);
            var filterConcept = sparql.KeywordSearchUtils.createConceptRegex(labelRelation, 'Germany', true);

            return ls.fetchItems(filterConcept, 10);
        }).then(function(items) {
            items[0].val.bindings[0].get(rdf.NodeFactory.createVar('c_1')).getLiteralValue().should.equal(1094);
            console.log('FACET VALUES\n ' + JSON.stringify(items, null, 4));
        });
        */

    };

    $scope.toggleConstraint = function(node) {
        var path = $scope.facetValuePath;

        var constraintManager = $scope.facetTreeConfig.getFacetConfig().getConstraintManager();

        //var node = item.node;
        var constraint = new jassa.facete.ConstraintEquals(path, node);

        // TODO Integrate a toggle constraint method into the filterManager
        constraintManager.toggleConstraint(constraint);
    };


//    var fetchFacetList = function(path) {
//        var pathExpansions = $scope.facetTreeConfig.getFacetTreeState().getPathExpansions();
//        pathExpansions.clear();
//        pathExpansions.add(path);
//        //pathExpansions.add(new jassa.facete.Path());
//
//        var result = $scope.facetTreeService.fetchFacetTree(path);
//        return result;
//    };

    var updateFacetService = function() {
        console.log('Updating facets');
        var isConfigured = $scope.sparqlService && $scope.facetTreeConfig;
        var facetTreeService = isConfigured ? jassa.facete.FacetTreeServiceUtils.createFacetTreeService($scope.sparqlService, $scope.facetTreeConfig) : null;

        if(facetTreeService != null) {
            // TODO This may be a hack as we break encapsulation
            // The question is whether it should be allowed to get the facetService from a facetTreeService
            var facetService = facetTreeService.facetService;

            $q.when(facetService.prepareListService($scope.breadcrumb.pathHead)).then(function(listService) {
                $scope.listService = listService;
            });
        }
    };

    var update = function() {
        if($scope.facetValuePath == null) {
            updateFacetService();
        } else {
            updateFacetValueService();
        }
    };

//    $scope.$watch(function() {
//        var path = $scope.facetValuePath
//        var r = path == null ? null : '' + path;
//        return r;
//    }, function(str) {
//        if(str == null) {
//            updateFacetService();
//        } else {
//            updateFacetValueService();
//        }
//    }, true);

    $scope.$watch(function() {
        return $scope.breadcrumb.property;
    }, function(property) {
        $scope.facetValuePath = property == null ? null : appendProperty($scope.breadcrumb.pathHead, property);
    });

    $scope.$watch('[breadcrumb.pathHead.hashCode(), facetValuePath.hashCode()]', function() {
        $scope.location = $scope.facetValuePath != null ? $scope.facetValuePath : $scope.breadcrumb.pathHead;
    }, true);


    $scope.$watch('[ObjectUtils.hashCode(facetTreeConfig), breadcrumb.pathHead.hashCode(), facetValuePath.hashCode()]', function() {
        update();
    }, true);

    $scope.$watch('sparqlService', function() {
        update();
    });
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
            sparqlService: '=',
            facetTreeConfig: '=',
            //facetConfig: '=',
            listFilter: '=?',
            pathHead: '=?',
            //plugins: '=',
            //pluginContext: '=', //plugin context
            paginationOptions: '=?',
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
