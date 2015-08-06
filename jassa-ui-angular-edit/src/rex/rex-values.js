angular.module('ui.jassa.rex')

/**
 * @ngdoc directive
 * @name ui.jassa.rex.directive:rex-nav-targets
 * @element div
 * @restrict A
 * @function
 *
 * @description
 * <strong>TODO rex-results may be conceptually a much cleaner approach - deprecated/remove this directive if it proofs true</strong>
 *
 * Directive to refer to the set of URIs at a target
 *
 * <pre>rexNavTargets="arrayOfTargetIriStrings"</pre>
 *
 * Requires:
 *
 * - rex-subject on any ancestor
 * - rex-nav-predicate present on the same element as rex-nav-targets
 *
 * Optional:
 *
 * - rex-nav-inverse Whether to navigate the given predicate in inverse direction\
 *
 */
.directive('rexValues', ['$parse', '$q', '$dddi', function($parse, $q, $dddi) {
    return {
        priority: 10,
        restrict: 'A',
        scope: true,
        require: ['^rexContext', '^rexSubject'],
        controller: angular.noop,
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {

                    var contextCtrl = ctrls[0];

                    var slot = contextCtrl.allocSlot();
                    slot.triples = [];
                    //slot.entry = {};

                    scope.$on('$destroy', function() {
                        slot.release();
                    });



                    syncAttr($parse, scope, attrs, 'rexNavPredicate');
                    syncAttr($parse, scope, attrs, 'rexNavInverse');


                    syncAttr($parse, scope, attrs, 'rexFilterTermtype');
                    syncAttr($parse, scope, attrs, 'rexFilterLang');
                    syncAttr($parse, scope, attrs, 'rexFilterDatatype');

                    syncAttr($parse, scope, attrs, 'rexDefaultTermtype');
                    syncAttr($parse, scope, attrs, 'rexDefaultLang');
                    syncAttr($parse, scope, attrs, 'rexDefaultDatatype');

                    //syncAttr($parse, scope, attrs, 'rex');

                    syncAttr($parse, scope, attrs, 'rexOffset');
                    syncAttr($parse, scope, attrs, 'rexLimit');



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


                    var updateRelation = function(array) {
                        // Convert the array to triples

                        var pm = scope.rexPrefixMapping || new jassa.rdf.PrefixMappingImpl(jassa.vocab.InitialContext);

                        var s = jassa.rdf.NodeFactory.createUri(pm.expandPrefix(scope.rexSubject));
                        var p = jassa.rdf.NodeFactory.createUri(pm.expandPrefix(scope.rexNavPredicate));

                        var triples = array.map(function(item) {
                            var o = jassa.rdf.NodeFactory.createUri(pm.expandPrefix(item));
                            var r = scope.rexNavInverse
                                ? new jassa.rdf.Triple(o, p, s)
                                : new jassa.rdf.Triple(s, p, o)
                                ;

                            return r;
                        });

                        // TODO: We must check whether that triple already exists, and if it does not, insert it
                        //jassa.io.TalisRdfJsonUtils.triplesToTalisRdfJson(triples, scope.rexContext.override);

                        // Notify the context about the triples which we require to exist
                        slot.triples = triples;
                    };

                    // TODO Check for changes in the target array, and update
                    // relations as needed

                    // ISSUE: We need to ensure that each IRI in the array has the appropriate relation to
                    // the source resource of the navigation
                    scope.$watchCollection(targetModelStr, function(array) {
                        if(array) {
                            updateRelation(array);
                        }
                    });

                }
            };
        }
    };
}])

;
