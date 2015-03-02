angular.module('ui.jassa.rex')

.directive('rexSparqlService', ['$parse', function($parse) {
    return {
        priority: basePriority + 17,
        restrict: 'A',
        scope: true,
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
