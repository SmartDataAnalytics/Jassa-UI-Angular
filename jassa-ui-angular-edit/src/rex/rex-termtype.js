angular.module('ui.jassa.rex')

.directive('rexTermtype', ['$parse', function($parse) {
    return {
        priority: 7,
        restrict: 'A',
        scope: true,
        require: ['^rexContext', '^rexObject'],
        controller: function() {},
        compile: function(ele, attrs) {
            return createCompileComponent('rexTermtype', 'type', $parse);
        }
    };
}])

;
