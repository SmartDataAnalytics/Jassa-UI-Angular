angular.module('ui.jassa.rex')

/**
 * Directive to attach a rex lookup function to the scope
 *
 * Different lookup functions can be used at different HTML regions under a rex-context.
 *
 * If present, rex-subject will use the provided function to perform data lookups
 * on its IRIs and store the content in the scope
 *
 */
.directive('rexLookup', ['$parse', function($parse) {
    return {
        priority: 26,
        restrict: 'A',
        scope: true,
        require: '^rexContext',
        controller: angular.noop,
        //require: ['^?rexSubject', '^?rexObject']
//        controller: ['$scope', function($scope) {
//        }],
        compile: function(ele, attrs){
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    syncAttr($parse, scope, attrs, 'rexLookup');
                }
            };
        }
    };
}])

;
