angular.module('ui.jassa.rex')
/**
 * @ngdoc directive
 * @name ui.jassa.rex.directive:rex-datatype
 * @element rdf-term-input
 * @restrict A
 * @function
 *
 * @description
 * Description of rex-directive.
 */
.directive('rexDatatype', ['$parse', function($parse) {
    return {
        priority: 7,
        restrict: 'A',
        scope: true,
        require: ['^rexContext', '^rexObject', '?ngModel'],
        controller: angular.noop,
        compile: function(scope, ele, attrs, ctrls) {
            return createCompileComponent('rexDatatype', 'datatype', $parse);
        }
    };
}])

;
