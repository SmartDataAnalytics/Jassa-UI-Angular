angular.module('ui.jassa.rex')

/**
 * Directive to mark triples as deleted
 *
 */
.directive('rexDeleted', ['$parse', function($parse) {
    return {
        priority: 379,
        restrict: 'A',
        scope: true,
        require: ['^rexContext', '^rexObject'],
        controller: function() {},
        compile: function(ele, attrs) {
            return createCompileComponent('rexDeleted', 'deleted', $parse);
        }
    };
}])

;
