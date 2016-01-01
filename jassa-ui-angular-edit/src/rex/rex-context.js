angular.module('ui.jassa.rex')

/**
 * @ngdoc directive
 * @name ui.jassa.rex.directive:rex-context
 * @element div
 * @restrict A
 * @function
 *
 * @description
 * Description of rex-directive.
 */
.directive('rexContext', ['$parse', '$q', '$dddi', function($parse, $q, $dddi) {
    return {
        priority: 30,
        restrict: 'A',
        scope: true,
        require: 'rexContext',
        controller: ['$scope', function($scope) {

            $scope.rexContext = $scope.rexContext || {};

            this.$scope = $scope;

            //this.rexContext = $scope.rexContext;
            this.getOverride = function() {
                //return $scope.override;
                var rexContext = $scope.rexContext;
                var r = rexContext ? rexContext.override : null;
                return r;
            };


            // Attribute where child directives can register changes
            //this.rexChangeScopes = $scope.rexChangeScopes = [];

            // Arrays where child directives can register slots where
            // they publish their change
            this.nextSlot = 0;
            $scope.rexChangeSlots = {};


            /**
             * Allocate a 'slot' - an object that can be used as storage.
             *
             */
            this.allocSlot = function() {
                var tmp = this.nextSlot++;
                var id = 'slot_' + tmp;

                //var self = this;
                //console.log('[SLOT]: Allocated ' + id);

                var result = $scope.rexChangeSlots[id] = {
                    id: id,
                    release: function() {
                        //console.log('[SLOT]: Released ' + id);
                        delete $scope.rexChangeSlots[id];

                        //console.log('[SLOT]: In Use ' + Object.keys(self.rexChangeSlots).length);
                    }
                };

                return result;
            };

            this.getSlots = function() {
                var slots = $scope.rexChangeSlots;
                var slotIds = Object.keys(slots);

                var result = slotIds.map(function(slotId) {
                    var slot = slots[slotId];
                    return slot;
                });

                return result;
            };

            // Iterate all slots and create a graph from all .triples attributes
            this.getEnforcedGraph = function() {
                var result = new jassa.rdf.GraphImpl();
                var slots = this.getSlots();
                slots.forEach(function(slot) {
                    var triples = slot.triples;

                    if(triples) {
                        result.addAll(triples);
                    }
                });

                return result;
            };

            // Iterate all slots and collect referenced coordinates
            this.getReferencedCoordinates = function() {
                var result = new jassa.util.HashSet();

                var slots = this.getSlots();
                slots.forEach(function(slot) {
                    var entry = slot.entry;

                    var coordinate = entry ? entry.key : null;
                    if(coordinate != null) {
                        result.add(coordinate);
                    }
                });

                return result;
            };

//            this.releaseSlot = function(slot) {
//                delete this.changeSlots[slot.id];
//            }

        }],

        compile: function(ele, attrs) {

            setEleAttrDefaultValue(ele, attrs, 'rex-context', 'rexContext');

            return {
                pre: function(scope, ele, attrs, ctrl) {


                    // If no context object is provided, we create a new one
//                    if(!attrs.rexContext) {
//                        scope.rexContextAnonymous = {};
//                        //attrs.rexContext = 'rexContextAnonymous';
//                    }

                    syncAttr($parse, scope, attrs, 'rexContext');


                    var initContext = function(rexContext) {
                        rexContext.override = rexContext.override || {};//  new jassa.util.HashMap();

                        // a map from coordinate to slotId to true
                        rexContext.dirty = rexContext.dirty || {};


                        rexContext.refSubjects = rexContext.refSubjects || {}; // a map from subject to reference count. Filled out by rexSubject.

                        rexContext.srcGraph = rexContext.srcGraph || new jassa.rdf.GraphImpl();

                        /**
                         * Sets the override as the new source data
                         */
                        rexContext.checkpoint = function() {


                        };

                        /**
                         * Reloads all referenced data
                         */
                        resetData = function() {

                        };

                        /**
                         * Resets the form by iterating over all referenced coordinates
                         * and setting the override to the corresponding values from the base graph
                         */
                        rexContext.reset = function() {

                            var r = updateSubjectGraphs().then(function() {

                                // TODO Reload all data for referenced resources
                                // This essentially means that rexSubject has to registered referenced resources here...

                                var coordinates = ctrl.getReferencedCoordinates();

                                coordinates.forEach(function(coordinate) {
                                    var currentValue = getEffectiveValue(rexContext, coordinate);
                                    var originalValue = jassa.rdf.TalisRdfJsonUtils.getValueAt(rexContext.json, coordinate);
                                    jassa.rdf.TalisRdfJsonUtils.setValueAt(rexContext.override, coordinate, originalValue);
                                    //console.log('Resetting ' + coordinate + ' from [' + currentValue + '] to [' + originalValue + ']');
                                });

                                return true;
                            });

                            r = $q.when(r).then(angular.noop).then(angular.noop, function() {
                                console.error('error while rexContext.reset');
                            });

                            return r;
                        };

                    };

                    var updateArray = function(arrFn) {
                        var result = [];

                        return function() {
                            var items = arrFn();

                            while(result.length) { result.pop(); }

                            result.push.apply(result, items);

                            return result;
                        };
                    };

                   var getSubjects = updateArray(function() {
                       var r = Object.keys(scope.rexContext.refSubjects);
                       //console.log('Subjects:' + JSON.stringify(r));
                       return r;
                   });


                   var createExprFilterByNodes = function(v, nodes) {
                       var result;

                       if(nodes) {
                           if(nodes.length === 1) {
                               result = new E_Equals(v, nodes[0]);
                           } else {
                               result = new E_Equals(v, nodes);
                           }
                       } else {
                           result = jassa.sparql.NodeValue.nvFalse;
                       }

                       return result;
                   };

                   var appendExpr = function(arr, expr) {
                       var isSatisfiable = expr.equals(jassa.rdf.NodeValue.nvFalse);

                       if(isSatisfiable) {
                           if(!se.equals(jassa.rdf.NodeValue.nvTrue)) {
                               arr.push(expr);
                           }
                       }

                       return isSatisfiable;
                   };

                   /**
                    * Creates a query based on (arrays of; optional)
                    *
                    * subjects, predicates, languages
                    */
                   var createElementObjectsBySpl = function(sparqlService, subjectStrs, predicateStrs, isInverse, langStrs) {
                       var subjects = subjectStrs.map(function(str) {
                           return jassa.rdf.NodeFactory.createUri(str);
                       });

                       var predicates = predicateStrs.map(function(str) {
                           return jassa.rdf.NodeFactory.createUri(str);
                       });

                       var vars = jassa.rdf.VarUtils;
                       var triple = isInverse
                           ? new jassa.rdf.Triple(vars.s, vars.p, vars.o)
                           : new jassa.rdf.Triple(vars.o, vars.p, vars.s);

                       var tripleEl = new jassa.rdf.ElementTriplesBlock([triple]);

                       var isSatisfiable = true;

                       var exprs = [];

                       var se = createExprFilterByNodes(vars.s, subjects);
                       isSatisfiable = isSatisfiable && appendExpr(se, exprs);

                       var pe = createExprFilterByNodes(vars.p, predicates);
                       isSatisfiable = isSatisfiable && appendExpr(pe, exprs);

                       // TODO: lang matches

                       var result = isSatisfiable
                           ? (exprs.length > 0
                               ? new jassa.sparql.ElementGroup([
                                 tripleEl,
                                 new jassa.sparql.ElementFilter(exprs)
                               ])
                               : tripleEl)
                           : null;

                       return result;
                   };

                   var updateSubjectGraphs = function() {
                       var lookupEnabled = scope.rexLookup;
                       var sparqlService = scope.rexSparqlService;
                       var subjectStrs = scope.rexContext.subjects;

                       var r;

                       if(lookupEnabled && sparqlService && subjectStrs) {
                           var subjects = subjectStrs.map(function(str) {
                               return jassa.rdf.NodeFactory.createUri(str);
                           });

                           var lookupService = new jassa.service.LookupServiceGraphSparql(sparqlService);

                           var promise = lookupService.lookup(subjects);

                           r = promise.then(function(subjectToGraph) {
                               var contextScope = scope.rexContext;
                               var baseGraph = contextScope.baseGraph = contextScope.baseGraph || new jassa.rdf.GraphImpl();

                               subjectToGraph.forEach(function(graph, subject) {
                                   // Remove prior data from the graph
                                   var pattern = new jassa.rdf.Triple(subject, null, null);
                                   baseGraph.removeMatch(pattern);

                                   baseGraph.addAll(graph);
                               });

                               // Add the updated data
                               // TODO Add the data to the context
                           });
                       } else {
                           r = Promise.resolve();
                       }

                       r = r.then(function() {
                           var rexContext = scope.rexContext;
                           rexContext.json = rexContext.baseGraph ? jassa.io.TalisRdfJsonUtils.triplesToTalisRdfJson(rexContext.baseGraph) : {};
                       });

                       return r;
                   };


                    scope.$watchCollection('[rexSparqlService, rexLookup, rexPrefixMapping]', function() {
                        $q.when(updateSubjectGraphs()).then(angular.noop).then(angular.noop, function() {
                            console.error('error while watching rexSparqlService, rexLookup, rexPrefixMapping');
                        });
                    });

                    scope.$watchCollection(getSubjects, function(subjects) {
                        scope.rexContext.subjects = subjects;

                        console.log('Subjects: ' + JSON.stringify(subjects));
                        $q.when(updateSubjectGraphs()).then(angular.noop).then(angular.noop, function() {
                            console.error('error while watching getSubjects');
                        });
                    });


                    // Make sure to initialize any provided context object
                    // TODO: The status should probably be part of the context directive, rather than a context object
                    scope.$watch(function() {
                        return scope.rexContext;
                    }, function(newVal) {
                        initContext(newVal);
                    });

                    initContext(scope.rexContext);

                    var getBaseGraph = function() {
                        var rexContext = scope.rexContext;
                        var r = rexContext ? rexContext.baseGraph : null;
                        return r;
                    };

                    // Synchronize the talis json structure with the graph
                    // TODO Performance-bottleneck: Synchronize via an event API on the Graph object rather than using Angular's watch mechanism
                    scope.$watch(function() {
                        var baseGraph = getBaseGraph();
                        var r = baseGraph ? baseGraph.hashCode() : null;
                        return r;
                    }, function() {
                        var baseGraph = getBaseGraph();
                        scope.rexContext.json = baseGraph ? jassa.io.TalisRdfJsonUtils.triplesToTalisRdfJson(baseGraph) : {};
                    });

                    var createDataMap = function(coordinates) {

                        var override = ctrl.getOverride();

                        var result = new jassa.util.HashMap();
                        coordinates.forEach(function(coordinate) {
                            var val = getEffectiveValue(scope.rexContext, coordinate);
                            result.put(coordinate, val);
                        });

                        return result;
                    };

                    var dataMapToGraph = function(dataMap, prefixMapping) {
                        var talis = assembleTalisRdfJson(dataMap);
                        processPrefixes(talis, prefixMapping);

                        // Update the final RDF graph
                        var result = jassa.io.TalisRdfJsonUtils.talisRdfJsonToGraph(talis);
                        return result;
                    };

                    // Update the referenced sub graph
                    var createRefGraph = function() {
                        var result = new jassa.rdf.GraphImpl();
                        var coordinates = ctrl.getReferencedCoordinates();

                        var srcJson = scope.rexContext.json;

                        coordinates.forEach(function(coordinate) {
                            var obj = getObjectAt(srcJson, coordinate);
                            if(obj != null) {
                                var o = jassa.rdf.NodeFactory.createFromTalisRdfJson(obj);

                                var s = jassa.rdf.NodeFactory.createUri(coordinate.s);
                                var p = jassa.rdf.NodeFactory.createUri(coordinate.p);

                                var t = new jassa.rdf.Triple(s, p, o);
                                result.add(t);
                            }
                        });

                        return result;
                    };



                    /**
                     * Removes any non-referenced data from the override
                     */
                    var cleanupReferences = function(coordinateSet) {
                        //console.log('Referenced coordinates', JSON.stringify(coordinates));

                        var override = ctrl.getOverride();
                        var entries = talisRdfJsonToEntries(override);

                        entries.forEach(function(entry) {
                            var coordinate = entry.key;
                            var isContained = coordinateSet.contains(coordinate);
                            if(!isContained) {
                                removeValueAt(override, coordinate);
                            }
                        });
                    };


                    var currentCoordinateSet = new jassa.util.HashSet();

                    // TODO The following two $watch's have linear complexity but
                    // could be optimized if we managed references in a more
                    // clever way

                    // TODO Remove unreferenced values from the override
                    scope.$watch(function() {
                        currentCoordinateSet = ctrl.getReferencedCoordinates();

                        var r = currentCoordinateSet.hashCode();
                        //console.log('coordinateSetHash: ', r);
                        return r;
                    }, function() {
                        //console.log('Override', scope.rexContext.override);
                        cleanupReferences(currentCoordinateSet);
                    }, true);


                    var dddi = $dddi(scope);

                    scope.currentDataMap = new jassa.util.HashMap();

                    dddi.register('currentDataMap', function() {
                        var r = createDataMap(currentCoordinateSet);

                        r = r.hashCode() === scope.currentDataMap.hashCode()
                            ? scope.currentDataMap
                            : r;

                        return r;
                    });

                    dddi.register('rexContext.graph', ['currentDataMap.hashCode()', function() {
                        var r = dataMapToGraph(scope.currentDataMap, scope.rexContext.prefixMapping);

                        var enforcedGraph = ctrl.getEnforcedGraph();
                        // TODO Remove from enforcedGraph those triples that are already present in the source data
                        //enforcedGraph.removeAll();
                        r.addAll(enforcedGraph);

                        return r;
                    }]);

                    dddi.register('rexContext.targetJson', ['rexContext.graph.hashCode()',
                        function() {
                            var r = jassa.io.TalisRdfJsonUtils.triplesToTalisRdfJson(scope.rexContext.graph);
                            return r;
                        }]);

                    dddi.register('rexContext.srcGraph',
                        function() {
                            var r = createRefGraph();

                            r = r.hashCode() === scope.rexContext.srcGraph.hashCode()
                                ? scope.rexContext.srcGraph
                                : r;

                            return r;
                        });

                    dddi.register('rexContext.diff', ['rexContext.srcGraph.hashCode()', 'rexContext.graph.hashCode()',
                        function() {
                            var r = setDiff(scope.rexContext.srcGraph, scope.rexContext.graph);
                            return r;
                        }]);

                }
            };
        }
    };
}])

;


