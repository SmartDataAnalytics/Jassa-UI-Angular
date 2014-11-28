angular.module('ui.jassa.rex')

/**
 * TODO Not implemented yet
 */
.directive('rexPrefix', ['$parse', function($parse) {
    return {
        priority: basePriority + 19,
        restrict: 'A',
        scope: true,
        // require: '^',
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    syncAttr($parse, scope, attrs, 'rexPrefix');
                }
            };
        }
    };
}])

;
