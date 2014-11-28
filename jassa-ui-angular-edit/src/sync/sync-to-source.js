angular.module('ui.jassa.sync')

.directive('syncToSource', ['$parse', '$interpolate', function($parse, $interpolate) {
    return {
        priority: 390,
        restrict: 'A',
        //scope: true,
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    syncHelper(scope, attrs, $parse, $interpolate, 'syncTarget', 'syncSource', 'syncToSource', 'syncToSourceCond', false);
                }
            };
        }
    };
}])

;

