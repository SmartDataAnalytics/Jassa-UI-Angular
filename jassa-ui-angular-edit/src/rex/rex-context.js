angular.module('ui.jassa.rex')

.directive('rexContext', ['$parse', function($parse) {
    return {
        priority: basePriority + 20,
        restrict: 'A',
        scope: true,
        controller: ['$scope', function($scope) {

            //this.rexContext = $scope.rexContext;
            this.getOverride = function() {
                return $scope.rexContext.override;
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

//            this.releaseSlot = function(slot) {
//                delete this.changeSlots[slot.id];
//            }

        }],
        compile: function(ele, attrs) {
            //console.log('DA FUQ ON', ele, attrs);


            return {
                pre: function(scope, ele, attrs, ctrls) {
                    syncAttr($parse, scope, attrs, 'rexContext');

                    // Remove all entries from map that exist in base
                    var mapDifference = function(map, base) {
                        var mapEntries = map.entries();
                        mapEntries.forEach(function(mapEntry) {
                            var mapKey = mapEntry.key;
                            var mapVal = mapEntry.val;

                            var baseVal = base.get(mapKey);

                            if(jassa.util.ObjectUtils.isEqual(mapVal, baseVal)) {
                                map.remove(mapKey);
                            }
                        });
                    };

                    var createDataMap = function(coordinates) {
                        coordinates = coordinates || getReferencedCoordinates();

                        var override = scope.rexContext.override;

                        //console.log('Override', JSON.stringify(scope.rexContext.override.entries()));

                        var combined = new jassa.util.HashMap();

                        //console.log('Coordinates: ', JSON.stringify(coordinates));
                        //var map = new MapUnion([scope.rexContext.override, scope.rex]);
                        var result = new jassa.util.HashMap();
                        coordinates.forEach(function(coordinate) {
                             var val = scope.rexContext.getValue(coordinate);
                             result.put(coordinate, val);
                        });

                        //console.log('DATA', result.entries());

                        return result;
                    };

                    var updateDerivedValues = function(dataMap) {

                        var talis = assembleTalisRdfJson(dataMap);
                        //console.log('Talis JSON', talis);
                        var turtle = jassa.io.TalisRdfJsonUtils.talisRdfJsonToTurtle(talis);


                        var tmp = assembleTalisRdfJson(scope.rexContext.cache);

                        var before = jassa.io.TalisRdfJsonUtils.talisRdfJsonToTriples(tmp).map(function(x) { return '' + x; });

                        var after = jassa.io.TalisRdfJsonUtils.talisRdfJsonToTriples(talis).map(function(x) { return '' + x; });
                        var remove = _(before).difference(after);
                        var added = _(after).difference(before);

                        //console.log('DIFF: Added: ' + added);
                        //console.log('DIFF: Removed: ' + remove);

                        scope.rexContext.talisJson = turtle;
                    };


                    /*
                    var mapKeySet = function(map) {
                        var result = new jassa.util.HashSet();

                        var keys = map.keys();
                        keys.forEach(function(key) {
                            result.add(key);
                        });
                        return result;
                    };*/

                    var arrayToSet = function(arr) {
                        var result = new jassa.util.HashSet();

                        arr.forEach(function(item) {
                            result.add(item);
                        });
                        return result;
                    };



                    var mapRetainKeys = function(map, keySet) {
                        var mapKeys = map.keys();

                        mapKeys.forEach(function(mapKey) {
                            var isContained = keySet.contains(mapKey);
                            if(!isContained) {
                                map.remove(mapKey);
                            }
                        });
                    };


                    var getReferencedCoordinates = function() {
                        var slots = scope.rexChangeSlots;
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

                    var cleanupOverride = function()
                    {
                        var override = scope.rexContext.override;

                        // Remove values from override that equal the source data
                        mapDifference(override, scope.rexContext.cache);

                        // Remove undefined entries from override
                        var entries = override.entries();
                        entries.forEach(function(entry) {
                            if(entry.val == null) {
                                override.remove(entry.key);
                            }
                        });
                    };


                    var cleanupReferences = function(coordinates) {
                        coordinates = coordinates || getReferencedCoordinates();

                        //console.log('Referenced coordinates', JSON.stringify(coordinates));
                        var coordinateSet = arrayToSet(coordinates);

                        mapRetainKeys(scope.rexContext.override, coordinateSet);
                        //console.log('Override after cleanup', JSON.stringify(scope.rexContext.override.keys()));
                    };


                    // TODO Remove unreferenced values from the override
                    scope.$watch(function() {
                        return getReferencedCoordinates();
                    }, function(coordinates) {
                        //console.log('Override', scope.rexContext.override);
                        cleanupReferences(coordinates);
                        cleanupOverride();
                    }, true);

                    scope.$watch(function() {
                        var coordinates = getReferencedCoordinates();
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
