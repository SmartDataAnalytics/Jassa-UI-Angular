angular.module('ui.jassa.rex')

/**
 * @ngdoc directive
 * @name ui.jassa.rex.directive:rex-termtype
 * @element rdf-term-input
 * @restrict A
 * @function
 *
 * @description
 * Description of rex-directive.
 */
.directive('rexTermtype', ['$parse', function($parse) {
    return {
        priority: 10,
        restrict: 'A',
        scope: true,
        require: ['^rexContext', '^rexObject', '?ngModel'],
        controller: angular.noop,
        compile: function(ele, attrs) {
            return createCompileComponent('rexTermtype', 'type', $parse);
        }
    };
}])

;
