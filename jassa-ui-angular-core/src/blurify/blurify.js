angular.module('ui.jassa.blurify', [])

/**
 * Replaces text content with an alternative on blur
 * blurify="(function(model) { return 'displayValue'; })"
 *
 */
.directive('blurify', [ '$parse', function($parse) {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function($scope, element, attrs, model) {
            element.on('focus', function () {
                // Re-render the model on focus
                model.$render();
            });
            element.on('blur', function () {
                var modelVal = $parse(attrs['ngModel'])($scope);
                var labelFn = $parse(attrs['blurify'])($scope);

                if(labelFn) {
                    var val = labelFn(modelVal);
                    if(val && val.then) {
                        val.then(function(label) {
                            element.val(label);
                        });
                    } else {
                        element.val(val);
                    }
                }
//              $scope.$apply(function() {
//                  model.$setViewValue(val);
//              });
            });
        }
    };
}])

;

