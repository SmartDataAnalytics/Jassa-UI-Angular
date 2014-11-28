angular.module('ui.jassa.rex')

.directive('rexValue', ['$parse', function($parse) {
    return {
        priority: 379,
        restrict: 'A',
        scope: true,
        require: ['^rexContext', '^rexObject'],
        controller: function() {},
        compile: function(ele, attrs) {
            return createCompileComponent('rexValue', 'value', $parse);
        }
    };
}])

;
