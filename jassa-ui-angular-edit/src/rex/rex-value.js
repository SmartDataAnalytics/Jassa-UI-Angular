angular.module('ui.jassa.rex')
/**
 * @ngdoc directive
 * @name ui.jassa.rex.directive:rex-value
 * @element rdf-term-input
 * @restrict A
 * @function
 *
 * @description
 * Description of rex-directive.
 */
.directive('rexValue', ['$parse', function($parse) {
    return {
        priority: 4,
        restrict: 'A',
        scope: true,
        require: ['^rexContext', '^rexObject', '?ngModel'],
        controller: angular.noop,
        compile: function(ele, attrs) {
            return createCompileComponent('rexValue', 'value', $parse);
        }
    };
}])

;
