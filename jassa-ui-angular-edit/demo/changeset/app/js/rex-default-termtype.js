angular.module('ui.jassa.rex', [])

.directive('rexTermtype', ['$parse', function() {
    return {
        priority: 7,
        restrict: 'A',
        scope: true,
        controller: function() {},
        link: function(scope, ele, attrs, ctrls) {
            syncAttr($parse, scope, attrs, 'rexTermtype');
        }
    };
}])

;
