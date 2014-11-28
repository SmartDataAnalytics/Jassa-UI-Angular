angular.module('ui.jassa.rex')

.directive('rexDatatype', ['$parse', function($parse) {
    return {
        priority: 7,
        restrict: 'A',
        scope: true,
        require: ['^rexContext', '^rexObject'],
        controller: function() {},
        compile: function(scope, ele, attrs, ctrls) {
            return createCompileComponent('rexDatatype', 'datatype', $parse);
        }
    };
}])

;
