angular.module('ui.jassa.rex')

/**
 * @ngdoc directive
 * @name ui.jassa.rex.directive:rex-deleted
 * @element input
 * @restrict A
 * @function
 *
 * @description
 * Directive to mark triples as deleted
 */
.directive('rexDeleted', ['$parse', function($parse) {
    return {
        priority: 7,
        restrict: 'A',
        scope: true,
        require: ['^rexContext', '^rexObject', '?ngModel'],
        controller: angular.noop,
        compile: function(ele, attrs) {
            return createCompileComponent('rexDeleted', 'deleted', $parse);
        }
    };
}])

;
