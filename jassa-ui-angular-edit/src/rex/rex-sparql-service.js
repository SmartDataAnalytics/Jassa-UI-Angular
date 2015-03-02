angular.module('ui.jassa.rex')

.directive('rexSparqlService', ['$parse', function($parse) {
    return {
        priority: 30,
        restrict: 'A',
        scope: true,
        controller: angular.noop,
        compile: function(ele, attrs){
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    syncAttr($parse, scope, attrs, 'rexSparqlService');
                }
            };
        }
    };
}])

;
