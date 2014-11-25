angular.module('ui.jassa.rex', [])

.directive('rexValue', ['$parse', function($parse) {
    return {
        priority: 7,
        restrict: 'A',
        scope: true,
        controller: function() {},
        link: function(scope, ele, attrs, ctrls) {
            syncAttr($parse, scope, attrs, 'rexValue');
        }
    };
}])

;
