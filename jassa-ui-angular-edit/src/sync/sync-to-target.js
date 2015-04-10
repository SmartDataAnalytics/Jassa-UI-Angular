angular.module('ui.jassa.sync')

// sync-to-target="toString"
/**
 * @ngdoc directive
 * @name ui.jassa.sync.directive:sync-to-target
 * @element input
 * @restrict A
 * @function
 *
 * @description
 * <pre>sync-to-target="toString"</pre>
 * @example
 * <pre>sync-to-target="toString"</pre>
 */
.directive('syncToTarget', ['$parse', '$interpolate', function($parse, $interpolate) {
    return {
        priority: 390,
        restrict: 'A',
        //scope: true,
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {

                    var interpolateSource = 'syncSourceInterpolate' in attrs;

                    syncHelper(scope, attrs, $parse, $interpolate, 'syncSource', 'syncTarget', 'syncToTarget', 'syncToTargetCond', interpolateSource);
                }
            };
        }
    };
}])

;
