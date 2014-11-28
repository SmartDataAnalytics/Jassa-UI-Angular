angular.module('ui.jassa.rex')

.directive('rexPredicate', ['$parse', function($parse) {
    return {
        priority: basePriority + 17,
        restrict: 'A',
        scope: true,
        //require: ['^?rexSubject', '^?rexObject']
        controller: ['$scope', function($scope) {
            this.rexObjectScopes = $scope.rexObjectScopes = [];
        }],
        compile: function(ele, attrs){
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    syncAttr($parse, scope, attrs, 'rexPredicate');
                }
            };
        }
    };
}])

;
