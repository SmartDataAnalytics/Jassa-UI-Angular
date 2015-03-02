angular.module('ui.jassa.rex')

/**
 * Directive to refer to the set of URIs at a target
 *
 * rexNavTargets="arrayOfTargetIriStrings"
 *
 *
 *
 * Requires:
 * - rex-subject on any ancestor
 * - rex-nav-predicate present on the same element as rex-nav-targets
 *
 * Optional:
 * - rex-nav-inverse Whether to navigate the given predicate in inverse direction\
 *
 */
.directive('rexNavTargets', ['$parse', '$q', '$dddi', function($parse, $q, $dddi) {
    return {
        priority: 10,
        restrict: 'A',
        scope: true,
        require: ['^rexContext', '^rexSubject'],
        controller: angular.noop,
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {

                    syncAttr($parse, scope, attrs, 'rexNavPredicate');
                    syncAttr($parse, scope, attrs, 'rexNavInverse');


                    var targetModelStr = ele.attr('rex-nav-targets');
                    var dddi = $dddi(scope);

                    dddi.register(targetModelStr, ['rexSparqlService', 'rexSubject', 'rexNavPredicate', '?rexNavInverse',
                        function(sparqlService, subjectStr, predicateStr, isInverse) {

                            var pm = scope.rexPrefixMapping || new jassa.rdf.PrefixMappingImpl(jassa.vocab.InitialContext);

                            subjectStr = pm.expandPrefix(subjectStr);
                            predicateStr = pm.expandPrefix(predicateStr);

                            //var path = new jassa.facete.Path([new jassa.facete.Step(propertyStr, isInverse)]);

                            var s = jassa.sparql.VarUtils.s;
                            var p = jassa.rdf.NodeFactory.createUri(predicateStr);
                            //var o = jassa.sparql.VarUtils.o;
                            var o = jassa.rdf.NodeFactory.createUri(subjectStr);

                            var triple = isInverse
                                ? new jassa.rdf.Triple(s, p, o)
                                : new jassa.rdf.Triple(o, p, s)
                                ;

                            var concept = new jassa.sparql.Concept(
                                new jassa.sparql.ElementGroup([
                                    new jassa.sparql.ElementTriplesBlock([triple]),
                                    new jassa.sparql.ElementFilter(new jassa.sparql.E_IsIri(new jassa.sparql.ExprVar(s)))
                                ]), s);

                            var query = jassa.sparql.ConceptUtils.createQueryList(concept);

                            var listService = new jassa.service.ListServiceSparqlQuery(sparqlService, query, concept.getVar());

                            var task = listService.fetchItems().then(function(entries) {
                                var r = entries.map(function(item) {
                                    var s = item.key.getUri();
                                    return s;
                                });

                                return r;
                            });

                            return task;
                    }]);

                    // TODO Check for changes in the target array, and update
                    // relations as needed
                    //scope.$watch()

                }
            };
        }
    };
}])

;
