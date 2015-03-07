angular.module('ui.jassa.rex')

.directive('rexLang', ['$parse', function($parse) {
    return {
        priority: 7,
        restrict: 'A',
        scope: true,
        require: ['^rexContext', '^rexObject', '?ngModel'],
        controller: angular.noop,
        compile: function(scope, ele, attrs, ctrls) {
            return createCompileComponent('rexLang', 'lang', $parse);
        }
    };
}])

;
