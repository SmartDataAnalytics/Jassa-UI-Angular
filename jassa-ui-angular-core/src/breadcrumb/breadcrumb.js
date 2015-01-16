angular.module('ui.jassa.breadcrumb', [])


/**
 * Controller for the SPARQL based FacetTree
 * Supports nested incoming and outgoing properties
 *
 */
.controller('BreadcrumbCtrl', ['$rootScope', '$scope', '$q', '$timeout', function($rootScope, $scope, $q, $timeout) {

    $scope.slots = [];

    $scope.invert = function() {
        $scope.model.property = null;

        var pathHead = $scope.model.pathHead;
        if(pathHead) {
            $scope.model.pathHead = new jassa.facete.PathHead(pathHead.getPath(), !pathHead.isInverse());
        }
    };

    var update = function() {
        var sparqlService = $scope.sparqlService;

        var propertyName = $scope.model.property;
        var property = propertyName == null ? null : jassa.rdf.NodeFactory.createUri(propertyName);

        var pathHead = $scope.model.pathHead;
        var path = pathHead ? pathHead.getPath() : null;

        if(sparqlService && path) {
            var steps = path.getSteps();

            var ls = jassa.sponate.LookupServiceUtils.createLookupServiceNodeLabels(sparqlService);
            // Value
            ls = new jassa.service.LookupServiceTransform(ls, function(val) { return val.displayLabel; });
            //ls = new jassa.service.LookupServicePathLabels(ls);

            var uris = jassa.facete.PathUtils.getUris(path);

            if(property != null) {
                uris.push(property);
            }

            $q.when(ls.lookup(uris)).then(function(map) {

                var slots = steps.map(function(step) {
                    var node = jassa.rdf.NodeFactory.createUri(step.getPropertyName());
                    var r = {
                        property: node,
                        labelInfo: {
                            displayLabel: map.get(node),
                        },
                        isInverse: step.isInverse()
                    };

                    return r;
                });

                var value = null;
                if(property) {
                    value = {
                        property: property,
                        labelInfo: {
                            displayLabel: map.get(property)
                        }
                    };
                }

                var r = {
                    slots: slots,
                    value: value
                };

                return r;
            }).then(function(state) {
                $scope.state = state;
            });

        }

    };

    $scope.$watch('[ObjectUtils.hashCode(facetTreeConfig), model.pathHead.hashCode(), model.property]', function() {
        update();
    }, true);

    $scope.$watch('sparqlService', function() {
        update();
    });



//    var pathToItems = function() {
//
//    };


    // TODO Add a function that splits the path according to maxSize

    /*
    var updateVisiblePath = function() {
        var path = $scope.path;
        if(path) {
            var l = path.getLength();
            var maxSize = $scope.maxSize == null ? l : $scope.maxSize;

            //console.log('offset: ' + $scope.offset);
            $scope.offset = Math.max(0, l - maxSize);
            $scope.visiblePath = $scope.maxSize ? path : new facete.Path(path.steps.slice($scope.offset));
        } else {
            $scope.offset = 0;
            $scope.visiblePath = null;
        }
    }
    */

//    $scope.$watch(function() {
//        var model = $scope.model;
//        var r = 0;
//        if(model) {
//            r = model.pathHead ? model.pathHead.hashCode() : 0;
//            r += jassa.util.ObjectUtils.hashCodeStr(model.property);
//        }
//        return r;
//    }, function() {
//        updateVisiblePath();
//    });


//    $scope.$watch(function() {
//        return $scope.maxSize;
//    }, function() {
//        updateVisiblePath();
//    });



//    $scope.selectIncoming = function(path) {
//        if($scope.facetTreeConfig) {
//            var pathToDirection = $scope.facetTreeConfig.getFacetTreeState().getPathToDirection();
//            pathToDirection.put(path, -1);
//
//        }
//    };
//
//    $scope.selectOutgoing = function(path) {
//        if($scope.facetTreeConfig) {
//            var pathToDirection = $scope.facetTreeConfig.getFacetTreeState().getPathToDirection();
//            pathToDirection.put(path, 1);
//
//        }
//    };

//    $scope.isEqual = function(a, b) {
//        var r = a == null ? b == null : a.equals(b);
//        return r;
//    };


    $scope.setPath = function(index) {
        $scope.model.property = null;

        var pathHead = $scope.model.pathHead;
        var path = pathHead ? pathHead.getPath() : null;
        var isInverse = pathHead ? pathHead.isInverse() : false;
        if(path != null) {
            var steps = path.getSteps();
            var newSteps = steps.slice(0, index);

            var newPath = new jassa.facete.Path(newSteps);
            $scope.model.pathHead = new jassa.facete.PathHead(newPath, isInverse);
        }
    };

//    $scope.selectPath = function(path) {
//        $scope.path = path;
//        //alert(path);
//    };
    //
}])

/**
 * The actual dependencies are:
 * - sparqlServiceFactory
 * - facetTreeConfig
 * - labelMap (maybe this should be part of the facetTreeConfig)
 */
.directive('breadcrumb', function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'template/breadcrumb/breadcrumb.html',
        scope: {
            sparqlService: '=',
            model: '=ngModel',
            maxSize: '=?',
            onSelect: '&select'
        },
        controller: 'BreadcrumbCtrl',
        compile: function(elm, attrs) {
            return {
                pre: function(scope, elm, attrs, controller) {
                }
            };
//            return function link(scope, elm, attrs, controller) {
//            };
        }
    };
})

;
