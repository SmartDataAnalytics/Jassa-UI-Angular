angular.module('ui.jassa.sync')
/**
 * @ngdoc directive
 * @name ui.jassa.sync.directive:sync-to-source
 * @element sync-to-source
 * @restrict A
 * @function
 *
 * @description
 * Description of sync-directive.
 */
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

