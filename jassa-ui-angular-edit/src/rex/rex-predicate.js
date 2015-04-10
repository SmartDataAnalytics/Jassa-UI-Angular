angular.module('ui.jassa.rex')

/**
 * @ngdoc directive
 * @name ui.jassa.rex.directive:rex-predicate
 * @element input
 * @restrict A
 * @function
 *
 * @description
 * Description of rex-directive.
 */
.directive('rexPredicate', ['$parse', function($parse) {
    return {
        priority: 17,
        restrict: 'A',
        scope: true,
        //require: ['^?rexSubject', '^?rexObject']
        controller: ['$scope', function($scope) {
            this.rexObjectScopes = $scope.rexObjectScopes = [];
        }],
        compile: function(ele, attrs){
            return {
                pre: function(scope, ele, attrs, ctrls) {

                    // Sync rex-predicate to its resolved value
                    syncAttr($parse, scope, attrs, 'rexPredicate', false, function(predicate) {
                        var pm = scope.rexPrefixMapping;
                        var r = pm ? pm.expandPrefix(predicate) : predicate;
                        return r;
                    });

                }
            };
        }
    };
}])

;
