angular.module('ui.jassa.constraint-list', [])

.controller('ConstraintListCtrl', ['$scope', '$q', '$rootScope', function($scope, $q, $rootScope) {

    var self = this;

    //var constraintManager;

    var updateConfig = function() {
        var isConfigured = $scope.facetTreeConfig;
        //debugger;
        $scope.constraintManager = isConfigured ? $scope.facetTreeConfig.getFacetConfig().getConstraintManager() : null;
    };
    
    var update = function() {
        updateConfig();
        self.refresh();
    };


    $scope.ObjectUtils = Jassa.util.ObjectUtils;

    var watchList = '[ObjectUtils.hashCode(facetTreeConfig)]';
    $scope.$watch(watchList, function() {
		update();
	}, true);
    
    $scope.$watch('sparqlService', function() {
        update();
    });
    
    $scope.$watch('labelService', function() {
        update();
    });
    
    
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
    
    self.refresh = function() {

        var constraintManager = $scope.constraintManager;
        var constraints = constraintManager ? constraintManager.getConstraints() : [];

        var promise = jassa.service.LookupServiceUtils.lookup($scope.labelService, constraints);

        jassa.sponate.angular.bridgePromise(promise, $q.defer(), $scope, function(map) {

            var items =_(constraints).map(function(constraint) {
                var label = map.get(constraint);

                var r = {
                    constraint: constraint,
                    label: label
                };
                
                return r;
            });

            $scope.constraints = items;
        });
    };
    
    $scope.removeConstraint = function(item) {
        $scope.constraintManager.removeConstraint(item.constraint);
        //$scope.$emit('facete:constraintsChanged');
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
            labelService: '=',
            facetTreeConfig: '=',
            onSelect: '&select'
        },
        controller: 'ConstraintListCtrl'
    };
})

;
