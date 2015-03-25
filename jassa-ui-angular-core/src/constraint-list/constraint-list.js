angular.module('ui.jassa.constraint-list', [])

.controller('ConstraintListCtrl', ['$scope', '$q', '$rootScope', '$dddi', function($scope, $q, $rootScope, $dddi) {

    var dddi = $dddi($scope);

    dddi.register('constraintLabelsLookupService', ['lookupService',
        function(lookupService) {
            var r = new jassa.facete.LookupServiceConstraintLabels(ls);
            return r;
        }]);

    dddi.register('constraints', ['=constraintManager.getConstraints()',
        function(constraints) {
            return constraints;
        }]);

    dddi.register('listService', ['constraints', 'constraintLabelsLookupService', function() {

    }]);

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
            lookupService: '=',
            constraintManager: '=',
            onSelect: '&select'
        },
        controller: 'ConstraintListCtrl'
    };
})

;
