angular.module('ui.jassa.constraint-list', [])

.controller('ConstraintListCtrl', ['$scope', '$q', '$rootScope', function($scope, $q, $rootScope) {

    var self = this;

    var reset = function() {
        if($scope.sparqlService && $scope.facetTreeConfig) {
            //var labelConfig = $scope.facetTreeConfig.getBestLiteralConfig();
            //var mappedConcept = jassa.sponate.MappedConceptUtils.createMappedConceptBestLabel(labelConfig);
            /*
            var ls = jassa.sponate.LookupServiceUtils.createLookupServiceMappedConcept($scope.sparqlService, mappedConcept);
            ls = new jassa.service.LookupServiceTransform(ls, function(val) {
                return val.displayLabel || val.id;
            });
            */

            var literalPreference = $scope.facetTreeConfig.getBestLiteralConfig().getLiteralPreference();
            var ls = jassa.sponate.LookupServiceUtils.createLookupServiceNodeLabels($scope.sparqlService, literalPreference);

            $scope.constraintLabelsLookupService = new jassa.facete.LookupServiceConstraintLabels(ls);
        }
    };

    var refresh = function() {

        if($scope.constraintLabelsLookupService) {

            var constraints = $scope.constraintManager ? $scope.constraintManager.getConstraints() : [];
            var promise = $scope.constraintLabelsLookupService.lookup(constraints);

            //$q.when(promise).then(function(map) {
            $q.when(promise).then(function(map) {

                var items =_(constraints).map(function(constraint) {
                    var label = map.get(constraint);

                    var r = {
                        constraint: constraint,
                        label: label
                    };

                    return r;
                });

                $scope.constraints = items;
            }, function(e) {
                throw e;
            });
        }
    };

    var renderConstraint = function(constraint) {
        var type = constraint.getName();

        var result;
        switch(type) {
        case 'equals':
            var pathStr = ''  + constraint.getDeclaredPath();
            if(pathStr === '') {
                pathStr = '()';
            }
            result = pathStr + ' = ' + constraint.getValue();
        break;
        default:
            result = constraint;
        }

        return result;
    };

    $scope.$watch('constraintLabelsLookupService', function() {
        refresh();
    });

    $scope.$watch('facetTreeConfig.getFacetConfig().getConstraintManager()', function(cm) {
        $scope.constraintManager = cm;
        refresh();
    }, true);

    $scope.$watch('sparqlService', function() {
        reset();
    });

    $scope.$watch('facetTreeConfig.getBestLiteralConfig()', function() {
        reset();
    }, true);

    $scope.removeConstraint = function(item) {
        $scope.constraintManager.removeConstraint(item.constraint);
    };

}])


/**
 * The actual dependencies are:
 * - sparqlServiceFactory
 * - facetTreeConfig
 * - labelMap (maybe this should be part of the facetTreeConfig)
 */
.directive('constraintList', function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'template/constraint-list/constraint-list.html',
        transclude: false,
        require: 'constraintList',
        scope: {
            sparqlService: '=',
            facetTreeConfig: '=',
            onSelect: '&select'
        },
        controller: 'ConstraintListCtrl'
    };
})

;
