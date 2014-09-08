angular.module('ui.jassa.auto-focus', [])

// Source: http://stackoverflow.com/questions/14833326/how-to-set-focus-on-input-field
.directive('autoFocus', function($timeout, $parse) {
    return {
        link: function(scope, element, attrs) {
            var model = $parse(attrs.autoFocus);
            scope.$watch(model, function(value) {
                if(value === true) {
                    $timeout(function() {
                         element[0].focus();
                    });
                }
            });
            // to address @blesh's comment, set attribute value to 'false'
            // on blur event:
            element.bind('blur', function() {
                if(model.assign) {
                    scope.$apply(model.assign(scope, false));
                }
            });
        }
    };
})

;

