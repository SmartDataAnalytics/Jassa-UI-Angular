angular.module('ui.jassa.rex')

.directive('rexContext', ['$parse', function($parse) {
    return {
        priority: basePriority + 30,
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
                var id = '' + tmp;

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


            this.getReferencedCoordinates = function() {
                var slots = $scope.rexChangeSlots;
                var slotIds = Object.keys(slots);

                var result = slotIds.map(function(slotId) {
                    var slot = slots[slotId];
                    var entry = slot.entry;

                    return entry ? entry.key : null;
                });

                result = result.filter(function(key) {
                    return key != null;
                });

                //console.log('rcs:', scope.rexChangeSlots, ' SlotIds: ', slotIds, ' Coordinates: ', JSON.stringify(result), ' Slots: ', slots);

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

                    };

                    // Make sure to initialize any provided context object
                    // TODO: The status should probably be part of the context directive, rather than a context object
                    scope.$watch(function() {
                        return scope.rexContext;
                    }, function(newVal) {
                        initContext(newVal);
                    });

                    initContext(scope.rexContext);


                    // Synchronize the talis json structure with the graph
                    // TODO Performance-bottleneck: Synchronize via an event API on the Graph object rather than using Angular's watch mechanism
                    scope.$watch('rexContext.baseGraph.toArray()', function() {
                        var baseGraph = scope.rexContext.baseGraph;
                        scope.rexContext.json = baseGraph ? jassa.io.TalisRdfJsonUtils.triplesToTalisRdfJson(baseGraph) : {};
                    }, true);


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
                    var mapDifference = function(map, baseFn) {
                        var mapEntries = map.entries();
                        mapEntries.forEach(function(mapEntry) {
                            var mapKey = mapEntry.key;
                            var mapVal = mapEntry.val;

                            var baseVal = baseFn(mapKey);

                            if(jassa.util.ObjectUtils.isEqual(mapVal, baseVal)) {
                                map.remove(mapKey);
                            }
                        });
                    };

                    var createDataMap = function(coordinates) {
                        coordinates = coordinates || ctrl.getReferencedCoordinates();

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

                    var updateDerivedValues = function(dataMap) {

                        var talis = assembleTalisRdfJson(dataMap);

                        // Update the final RDF graph
                        var targetGraph = jassa.io.TalisRdfJsonUtils.talisRdfJsonToGraph(talis);
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


                    var cleanupOverride = function()
                    {
                        var json = scope.rexContext.json;
                        var override = ctrl.getOverride();
                        //var override = scope.rexContext.override;

                        // Remove values from override that equal the source data
                        var entries = talisRdfJsonToEntries(override);
                        entries.forEach(function(entry) {
                            var coordinate = entry.key;
                            var val = entry.val;

                            var sourceVal = getValueAt(json, coordinate);
                            if(sourceVal === val || val == null) {
                                removeValueAt(override, coordinate);
                            }
                        });

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


                    var cleanupReferences = function(coordinates) {
                        coordinates = coordinates || ctrl.getReferencedCoordinates();

                        //console.log('Referenced coordinates', JSON.stringify(coordinates));
                        var coordinateSet = jassa.util.SetUtils.arrayToSet(coordinates);

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

                        //console.log('Override after cleanup', JSON.stringify(scope.rexContext.override.keys()));
                    };


                    // TODO Remove unreferenced values from the override
                    scope.$watch(function() {
                        return ctrl.getReferencedCoordinates();
                    }, function(coordinates) {
                        //console.log('Override', scope.rexContext.override);
                        cleanupReferences(coordinates);
                        cleanupOverride();
                    }, true);

                    scope.$watch(function() {
                        var coordinates = ctrl.getReferencedCoordinates();
                        var r = createDataMap(coordinates);
                        return r;
                    }, function(dataMap) {
                        updateDerivedValues(dataMap);
                    }, true);


                }
            };
        }
    };
}])

;
