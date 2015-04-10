angular.module('ui.jassa.rex')
/**
 * @ngdoc directive
 * @name ui.jassa.rex.directive:rex-subject
 * @element form
 * @restrict A
 * @function
 *
 * @description
 * rexSubject only registers the referenced subject at the rexContext.
 *
 * This way, the context knows what data needs to be re-fetched in case of a full reset (e.g. after an edit).
 */
.directive('rexSubject', ['$parse', '$q', function($parse, $q) {
    return {
        priority: 24,
        restrict: 'A',
        scope: true,
        require: '^rexContext',
        controller: angular.noop,
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, contextCtrl) {
                    syncAttr($parse, scope, attrs, 'rexSubject', false, function(subject) {
                        var pm = scope.rexPrefixMapping;
                        var r = pm ? pm.expandPrefix(subject) : subject;
                        return r;
                    });

                    scope.$on('destroy', function() {
                        var contextScope = contextCtrl.$scope.rexContext;
                        jassa.util.ObjectUtils.free(contextScope.refSubjects, scope.rexSubject);
                    });


                    var updateRegistration = function(now, old) {
                        var contextScope = contextCtrl.$scope.rexContext;
                        jassa.util.ObjectUtils.alloc(contextScope.refSubjects, now);
                        jassa.util.ObjectUtils.free(contextScope.refSubjects, old);
                    };

                    updateRegistration(scope.rexSubject);
                    scope.$watch('rexSubject', updateRegistration);
                }
            };
        }
    };
}])

;
