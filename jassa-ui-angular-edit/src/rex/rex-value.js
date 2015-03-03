angular.module('ui.jassa.rex')

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
