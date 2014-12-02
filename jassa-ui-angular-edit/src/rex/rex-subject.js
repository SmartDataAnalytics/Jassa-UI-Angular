angular.module('ui.jassa.rex')

.directive('rexSubject', ['$parse', '$q', function($parse, $q) {
    return {
        priority: basePriority + 18,
        restrict: 'A',
        scope: true,
        require: '^rexContext',
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, contextCtrl) {
                    var subjectUri = syncAttr($parse, scope, attrs, 'rexSubject');

                    var doPrefetch = function() {
                        var subjectUri = scope.rexSubject;

                        var pm = scope.rexPrefixMapping;

                        var uri = pm ? pm.expandPrefix(subjectUri) : subjectUri;

                        var s = jassa.rdf.NodeFactory.createUri(uri);
                        $q.when(scope.rexContext.prefetch(s)).then(function() {
                            // make sure to apply the scope
                        });
                    };

                    scope.$watch('rexSubject', function(newVal) {
                        doPrefetch();
                    });

                    scope.$watch('rexPrefixMapping', function(pm) {
                        doPrefetch();
                    });

                    //console.log('Prefetching: ', s);
                }
            };
        }
    };
}])

;
