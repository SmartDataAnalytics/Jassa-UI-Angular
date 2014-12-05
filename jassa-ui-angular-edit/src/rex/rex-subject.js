angular.module('ui.jassa.rex')

.directive('rexSubject', ['$parse', '$q', function($parse, $q) {
    return {
        priority: basePriority + 24,
        restrict: 'A',
        scope: true,
        require: '^rexContext',
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, contextCtrl) {

                    var subjectUri = syncAttr($parse, scope, attrs, 'rexSubject');

                    var doPrefetch = function() {
                        var lookupFn = scope.rexLookup;
                        var subjectUri = scope.rexSubject;

                        if(lookupFn && jassa.util.ObjectUtils.isFunction(lookupFn) && subjectUri) {

                            var pm = scope.rexPrefixMapping;
                            var uri = pm ? pm.expandPrefix(subjectUri) : subjectUri;

                            var s = jassa.rdf.NodeFactory.createUri(uri);

                            var promise = scope.rexLookup(s);
                            $q.when(promise).then(function(graph) {
                                var contextScope = contextCtrl.$scope.rexContext;
                                var baseGraph = contextScope.baseGraph = contextScope.baseGraph || new jassa.rdf.GraphImpl();

                                contextScope.baseGraph.addAll(graph);
                                // TODO Add the data to the context
                            });
                        }

//                        $q.when(scope.rexContext.prefetch(s)).then(function() {
//                            // make sure to apply the scope
//                        });
                    };

                    scope.$watch(function() {
                        return scope.rexLookup;
                    }, function(lookupFn) {
                        doPrefetch();
                    });

                    scope.$watch(function() {
                        return scope.rexSubject;
                    }, function(newVal) {
                        doPrefetch();
                    });

                    scope.$watch(function() {
                        return scope.rexPrefixMapping;
                    }, function(pm) {
                        doPrefetch();
                    });
                }
            };
        }
    };
}])

;
