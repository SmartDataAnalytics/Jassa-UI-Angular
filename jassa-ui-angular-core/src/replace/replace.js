angular.module('ui.jassa.replace', [])

.directive('replace', function () {
    return {
        //require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el, attrs) {
            el.replaceWith(el.children());
        }
    };
})

;
