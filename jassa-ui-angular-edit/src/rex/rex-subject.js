angular.module('ui.jassa.rex')

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

                    var subjectUri = syncAttr($parse, scope, attrs, 'rexSubject');

                    var doPrefetch = function() {
                        //console.log('doPrefetch');

                        var sparqlService = scope.rexSparqlService;
                        var lookupEnabled = scope.rexLookup;
                        var subjectUri = scope.rexSubject;

                        //if(lookupFn && angular.isFunction(lookupFn) && subjectUri) {
                        if(lookupEnabled && sparqlService && subjectUri) {

                            var pm = scope.rexPrefixMapping;
                            var uri = pm ? pm.expandPrefix(subjectUri) : subjectUri;

                            var s = jassa.rdf.NodeFactory.createUri(uri);


                            var promise = jassa.service.ServiceUtils.execDescribeViaSelect(sparqlService, [s]);

                            // Notify the context that the subject is being loaded
                            //rexContext.loading.add(s);

                            //var promise = scope.rexLookup(s);
                            $q.when(promise).then(function(graph) {
                                var contextScope = contextCtrl.$scope.rexContext;
                                var baseGraph = contextScope.baseGraph = contextScope.baseGraph || new jassa.rdf.GraphImpl();

                                // Remove prior data from the graph
                                var pattern = new jassa.rdf.Triple(s, null, null);
                                contextScope.baseGraph.removeMatch(pattern);

                                // Add the updated data
                                contextScope.baseGraph.addAll(graph);
                                // TODO Add the data to the context
                            });
                        }

//                        $q.when(scope.rexContext.prefetch(s)).then(function() {
//                            // make sure to apply the scope
//                        });
                    };

                    scope.$watch([
                        function() {
                            return scope.rexSparqlService
                        }, function() {
                            return scope.rexLookup;
                        }, function() {
                            return scope.rexSubject;
                        }, function() {
                            return scope.rexPrefixMapping;
                        }
                    ], function() {
                        doPrefetch();
                    });

//                    scope.$watch(function() {
//                        return scope.rexSubject;
//                    }, function(newVal) {
//                        doPrefetch();
//                    });
//
//                    scope.$watch(function() {
//                        return scope.rexPrefixMapping;
//                    }, function(pm) {
//                        doPrefetch();
//                    });
                }
            };
        }
    };
}])

;
