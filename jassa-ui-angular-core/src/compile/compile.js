angular.module('ui.jassa.compile', [])

/**
 * Source
 * http://stackoverflow.com/questions/17417607/angular-ng-bind-html-unsafe-and-directive-within-it
 */
.directive('compile', ['$compile', function($compile) {
    return {
        scope: true,
        terminal: true,
        compile: function(elem, attrs) {
            return {
                post: function(scope, elem, attrs, controller) {
                    scope.$watch(function(scope) {
                        // watch the 'compile' expression for changes
                        return scope.$eval(attrs.compile);
                    }, function(value) {
                        // when the 'compile' expression changes
                        // assign it into the current DOM
                        elem.html(value);

                        // compile the new DOM and link it to the current
                        // scope.
                        // NOTE: we only compile .childNodes so that
                        // we don't get into infinite loop compiling ourselves
                        $compile(elem.contents())(scope);
                    });
                }
            };
        }
    };
}])

;
