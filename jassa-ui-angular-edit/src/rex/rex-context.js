angular.module('ui.jassa.rex')


.directive('rexContext', ['$parse', '$q', function($parse, $q) {
    return {
        priority: 30,
        restrict: 'A',
        scope: true,
        require: 'rexContext',
        controller: ['$scope', function($scope) {

            $scope.rexContext = $scope.rexContext || {};

            this.$scope = $scope;


            //$scope.override = new jassa.util.HashMap();

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

            //console.log('DA FUQ');

            //this.rexChangeSlots =

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

                    //dddi = $dddi(scope);

                    // If no context object is provided, we create a new one
//                    if(!attrs.rexContext) {
//                        scope.rexContextAnonymous = {};
//                        //attrs.rexContext = 'rexContextAnonymous';
//                    }

                    syncAttr($parse, scope, attrs, 'rexContext');


                    var initContext = function(rexContext) {
                        rexContext.override = rexContext.override || {};//  new jassa.util.HashMap();

                        // a map from coordinate to slotId to true
                        rexContext.dirty = {};


                        rexContext.refSubjects = {}; // a map from subject to reference count. Filled out by rexSubject.



                        /**
                         * Resets the form by iterating over all referenced coordinates
                         * and setting the override to the corresponding values from the base graph
                         */
                        rexContext.reset = function() {
                            // TODO Reload all data for referenced resources
                            // This essentially means that rexSubject has to registered referenced resources here...

                            var coordinates = ctrl.getReferencedCoordinates();

                            coordinates.forEach(function(coordinate) {
                                var currentValue = getEffectiveValue(rexContext, coordinate);
                                var originalValue = getValueAt(rexContext.json, coordinate);
                                setValueAt(rexContext.override, coordinate, originalValue);
                                //console.log('Resetting ' + coordinate + ' from [' + currentValue + '] to [' + originalValue + ']');
                            });
                        };


                        /*
                        rexContext.remove = rexContext.remove || function(coordinate) {
                            // Removes an object
                            var objs = getObjectsAt(rexContext.json, coordinate);
                            if(objs) {
                                objs.splice(coordinate.i, 1);
                            }

                            objs = getObjectsAt(rexContext.override, coordinate);
                            if(objs) {
                                objs.splice(coordinate.i, 1);
                            }
                        };
                        */

                        /*
                        rexContext.setObject = function(s, p, i, sourceObj) {
                            var coordinate = new Coordinate(s, p, i);
                            var targetObj = getOrCreateObjectAt(rexContext.override, coordinate);
                            angular.copy(sourceObj, targetObj);
                            //setObjectAt(rexContext.override, coordinate, value) {
                        };
                        */
/* TODO I think it is not used anymore, but code left here for reference
                        rexContext.addObject = function(_s, _p, sourceObj) {
                            var pm = scope.rexPrefixMapping || new jassa.rdf.PrefixMappingImpl(jassa.vocab.InitialContext);
                            //__defaultPrefixMapping;

                            var s = pm.expandPrefix(_s);
                            var p = pm.expandPrefix(_p);

                            var coordinate = new Coordinate(s, p);

                            var as = getObjectsAt(rexContext.json, coordinate);
                            var bs = getObjectsAt(rexContext.override, coordinate);

                            var a = as ? as.length : 0;
                            var b = bs ? bs.length : 0;

                            var i = Math.max(a, b);

                            var c = new Coordinate(s, p, i);

                            var targetObj = getOrCreateObjectAt(rexContext.override, c);
                            angular.copy(sourceObj, targetObj);
                            //setObjectAt(rexContext.override, coordinate, value) {
                        };
*/

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

                   var updateSubjectGraphs = function() {
                       var lookupEnabled = scope.rexLookup;
                       var sparqlService = scope.rexSparqlService;
                       var subjectStrs = scope.rexContext.subjects;

                       if(lookupEnabled && sparqlService && subjectStrs) {
                           var subjects = subjectStrs.map(function(str) {
                               return jassa.rdf.NodeFactory.createUri(str);
                           });

                           var lookupService = new jassa.service.LookupServiceGraphSparql(sparqlService);

                           var promise = lookupService.lookup(subjects);

                           $q.when(promise).then(function(subjectToGraph) {
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
                       }
                   };


                    scope.$watchCollection('[rexSparqlService, rexLookup, rexPrefixMapping]', function() {
                        updateSubjectGraphs();
                    });

                    scope.$watchCollection(getSubjects, function(subjects) {
                        scope.rexContext.subjects = subjects;

                        console.log('Subjects: ' + JSON.stringify(subjects));
                        updateSubjectGraphs();
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


                    /*
                    var getComponentValueForNode = function(node, component) {
                        var json = jassa.rdf.NodeUtils.toTalisRdfJson(node);
                        var result = json[compononte];
                        return result;
                    };

                    // A hacky function that iterates the graph
                    getValue: function(graph, coordinate) {

                    }
                    */









                    // TODO Watch any present sourceGraph attribute
                    // And create the talis-json structure

                    // The issue is, that the source graph might become quite large
                    // (e.g. consider storing a whole DBpedia Data ID in it)
                    // Would it be sufficient to only convert the subset of the graph
                    // to RDF which is referenced by the form?

//                    scope.$watch(function() {
//                        return scope.rexSourceGraph;
//                    }, function(sourceGraph) {
//                        scope.rexJson = jassa.io.TalisRdfJsonUtils.triplesToTalisRdfJson(sourceGraph);
//                    }, true);


                    // Remove all entries from map that exist in base
//                    var mapDifference = function(map, baseFn) {
//                        var mapEntries = map.entries();
//                        mapEntries.forEach(function(mapEntry) {
//                            var mapKey = mapEntry.key;
//                            var mapVal = mapEntry.val;
//
//                            var baseVal = baseFn(mapKey);
//
//                            if(jassa.util.ObjectUtils.isEqual(mapVal, baseVal)) {
//                                map.remove(mapKey);
//                            }
//                        });
//                    };

                    var createDataMap = function(coordinates) {

                        //var override = scope.rexContext.override;
                        var override = ctrl.getOverride();

                        //console.log('Override', JSON.stringify(scope.rexContext.override.entries()));

                        //var combined = new jassa.util.HashMap();

                        //console.log('Coordinates: ', JSON.stringify(coordinates));
                        //var map = new MapUnion([scope.rexContext.override, scope.rex]);
                        var result = new jassa.util.HashMap();
                        coordinates.forEach(function(coordinate) {
                             //var val = scope.rexContext.getValue(coordinate);
                            var val = getEffectiveValue(scope.rexContext, coordinate);
                            result.put(coordinate, val);
                        });

                        //console.log('DATA', result.entries());

                        return result;
                    };

                    var dataMapToGraph = function(dataMap, prefixMapping) {
                        var talis = assembleTalisRdfJson(dataMap);
                        processPrefixes(talis, prefixMapping);

                        // Update the final RDF graph
                        var result = jassa.io.TalisRdfJsonUtils.talisRdfJsonToGraph(talis);
                        return result;
                    };

                    var updateDerivedValues = function(dataMap, prefixMapping) {
//console.log('Start update derived');
                        /*
                        var talis = assembleTalisRdfJson(dataMap);
                        processPrefixes(talis, prefixMapping);

                        // Update the final RDF graph
                        var targetGraph = jassa.io.TalisRdfJsonUtils.talisRdfJsonToGraph(talis);
                        */
                        var targetGraph = dataMapToGraph(dataMap, prefixMapping);

                        var enforcedGraph = ctrl.getEnforcedGraph();
                        // TODO Remove from enforcedGraph those triples that are already present in the source data
                        //enforcedGraph.removeAll();
                        targetGraph.addAll(enforcedGraph);



                        scope.rexContext.graph = targetGraph;

                        scope.rexContext.targetJson = jassa.io.TalisRdfJsonUtils.triplesToTalisRdfJson(targetGraph);

                        // Update the referenced sub graph
                        var refGraph = new jassa.rdf.GraphImpl();
                        var coordinates = ctrl.getReferencedCoordinates();

                        var srcJson = scope.rexContext.json;

                        coordinates.forEach(function(coordinate) {
                            var obj = getObjectAt(srcJson, coordinate);
                            if(obj != null) {
                                var o = jassa.rdf.NodeFactory.createFromTalisRdfJson(obj);

                                var s = jassa.rdf.NodeFactory.createUri(coordinate.s);
                                var p = jassa.rdf.NodeFactory.createUri(coordinate.p);

                                var t = new jassa.rdf.Triple(s, p, o);
                                refGraph.add(t);
                            }
                        });

                        scope.rexContext.srcGraph = refGraph;

                        scope.rexContext.diff = setDiff(refGraph, targetGraph);
//console.log('End update derived');


                        //console.log('Talis JSON', talis);
                        //var turtle = jassa.io.TalisRdfJsonUtils.talisRdfJsonToTurtle(talis);


                        //var tmp = assembleTalisRdfJson(scope.rexContext.cache);

                        //var before = jassa.io.TalisRdfJsonUtils.talisRdfJsonToTriples(tmp).map(function(x) { return '' + x; });

                        //var after = jassa.io.TalisRdfJsonUtils.talisRdfJsonToTriples(talis).map(function(x) { return '' + x; });
                        //var remove = _(before).difference(after);
                        //var added = _(after).difference(before);

                        //console.log('DIFF: Added: ' + added);
                        //console.log('DIFF: Removed: ' + remove);

                        //scope.rexContext.talisJson = turtle;
                    };


                    // NOT NEEDED: The override reflects the state of the form
                    // it solely depends on the references; not the source data
                    var cleanupOverride = function()
                    {
                        var json = scope.rexContext.json;
                        var override = ctrl.getOverride();
                        //var override = scope.rexContext.override;

                        // Remove values from override that equal the source data
                        /*
                        var entries = talisRdfJsonToEntries(override);
                        entries.forEach(function(entry) {
                            var coordinate = entry.key;
                            var val = entry.val;

                            var sourceVal = getValueAt(json, coordinate);
                            if(sourceVal === val || val == null) {
                                removeValueAt(override, coordinate);
                            }
                        });
                        */


                        /*
                        mapDifference(override, function(coordinate) {
                            var r = getValueAt(scope.rexContext.json, coordinate);
                            return r;
                        });
                        */

                        // Remove undefined entries from override
//                        var entries = override.entries();
//                        entries.forEach(function(entry) {
//                            if(entry.val == null) {
//                                override.remove(entry.key);
//                            }
//                        });
                    };


                    var cleanupReferences = function(coordinateSet) {
                        //coordinates = coordinates || ctrl.getReferencedCoordinates();

                        //console.log('Referenced coordinates', JSON.stringify(coordinates));
                        //var coordinateSet = jassa.util.SetUtils.arrayToSet(coordinates);

                        var override = ctrl.getOverride();
                        //jassa.util.MapUtils.retainKeys(override, coordinateSet);
                        var entries = talisRdfJsonToEntries(override);

                        entries.forEach(function(entry) {
                            var coordinate = entry.key;
                            var isContained = coordinateSet.contains(coordinate);
                            if(!isContained) {
                                removeValueAt(override, coordinate);
                            }
                        });

                        //console.log('Cleaned up override from ' + entries.length, entries);
                        //console.log('Override after cleanup', JSON.stringify(scope.rexContext.override.keys()));
                    };


                    var currentCoordinateSet = new jassa.util.HashSet();
                    /*
                    var hashCodeArr = function(arr) {
                        var result = 0;
                        var l = arr ? arr.length : 0;
                        for (var i = 0; i < l; i++) {
                            var item = arr[i];
                            var hashCode = item.hashCode ? item.hashCode : 127;
                            result = result * 31 + hashCode;
                            res = res & res;
                        }

                        return result;
                    };
                    */

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
                        cleanupOverride();
                    }, true);

                    var currentDataMap = new jassa.util.HashMap();

                    scope.$watch(function() {
                        currentDataMap = createDataMap(currentCoordinateSet);
                        var r = currentDataMap.hashCode();
                        //console.log('dataMapHash: ', r);
                        return r;
                    }, function(dataMap) {

                        var rexContext = scope.rexContext;
                        var prefixMapping = rexContext ? rexContext.prefixMapping : null;

                        updateDerivedValues(currentDataMap, prefixMapping);
                    }, true);


                }
            };
        }
    };
}])

;
