
var MapUnion = jassa.ext.Class.create({
    initialize: function(subMaps) {
        this.subMaps = subMaps;
    },

    get: function(key) {
        var map = _(this.subMaps).find(function(subMap) {
            var r = subMap.containsKey(key);
            return r;
        });

        var result = map ? map.get(key) : null;
        return result;
    },

    containsKey: function(key) {
        var result = this.subMaps.some(function(subMap) {
            var r = subMap.containsKey(key);
            return r;
        });

        return result;
    },

    entries: function() {
        var keys = new jassa.util.HashSet();

        var result = [];
        this.subMaps.forEach(function(subMap) {
            var subEntries = subMap.entries();

            subEntries.forEach(function(subEntry) {
                var k = subEntry.key;
                var alreadySeen = keys.contains(k);
                if(!alreadySeen) {
                    keys.add(k);
                    result.push(subEntry);
                }
            });
        });

        return result;
    }
});



var RexContext = jassa.ext.Class.create({
    initialize: function(lookupService) {
        this.lookupService = lookupService;

        // the status of the resources as retrieved from the lookup service
        this.cache = new jassa.util.HashMap();

        this.override = new jassa.util.HashMap();

        this.json = {};
        //this.combined = new MapUnion([this.override, this.cache]);
        // values
        // this.overrides = {};

    },

    prefetch: function(subject) {
        if(this.cache.containsKey(subject)) {
            // TODO Do something
        }

        // TODO Set a loading flag on the resource

        var self = this;
        var result = this.lookupService.lookup([subject]).then(function(map) {
            console.log('Successfully prefetched: ', map);
            var entries = map.entries();
            entries.forEach(function(entry) {
                var dataMap = entry.val.data;
                self.cache.putMap(dataMap);

                var tmp = assembleTalisJsonRdf(dataMap);
                _(self.json).extend(tmp);

            });
        });

        return result;
    },

    combinedMap: function() {
        var subMaps = [this.override, this.cache].filter(function(item) {
            return item != null;
        });

        var result = new MapUnion(subMaps);

        return result;
    },

    getValue: function(coordinate) {
        //var subject = rdf.NodeFactory.createUri(coordinate.s);

        //var c = this.cache.get(subject);
        //var o = this.override.get(subject);

        //console.log('Cache: ', this.cache);

        var map = this.combinedMap();

        var result = map.get(coordinate);

        //console.log('Retrieved value: ', result, ' for coordinate ', coordinate);

        return result;
    },

    asTalisJsonRdf: function() {
        var map = this.combinedMap();

        var result = assembleTalisJsonRdf(map);
        return result;
    }
});




/*
var getModelExpr(attrs, baseAttrName) {
    var result = attrs[baseAttrName];

    if(!result) {

    }

}
*/


// Prefix str:
var parsePrefixStr = function(str) {
    regex = /\s*([^:]+)\s*:\s*([^\s]+)\s*/g;
};


var parsePrefixes = function(prefixMapping) {
    var result = prefixMapping
        ? prefixMapping instanceof PrefixMappingImpl
            ? prefixMapping
            : new PrefixMappingImpl(prefixMapping)
        : new PrefixMappingImpl();

    return result;
};





var getModelAttribute = function(attrs) {
    var modelAttrNames = ['ngModel', 'model'];

    var keys = Object.keys(attrs);

    var result = null;
    modelAttrNames.some(function(item) {
        var r = keys.indexOf(item) >= 0;
        if(r) {
            result = item;
        }
        return r;
    });

    return result;
};


function capitalize(s)
{
    return s && s[0].toUpperCase() + s.slice(1);
}

// TODO We need to expand prefixed values if the termtype is IRI

var createCompileComponent = function($rexComponent$, $component$, $parse) {
    //var $rexComponent$ = 'rex' + capitalize($component$);

    var tag = '[' + $component$ + ']';

    return {
        pre: function(scope, ele, attrs, ctrls) {


            var modelExprStr = attrs[$rexComponent$];
            var modelGetter = $parse(modelExprStr);
            var modelSetter = modelGetter.assign;

            var obj = syncAttr($parse, scope, attrs, $rexComponent$);

            var contextCtrl = ctrls[0];
            var objectCtrl = ctrls[1];

            var slot = contextCtrl.allocSlot();
            slot.entry = {};

            scope.$on('$destroy', function() {
                slot.release();
            });

            // If the coordinate changes, we copy the value at the override's old coordinate to the new coordinate
            scope.$watch(function() {
                var r = createCoordinate(scope, $component$);
                return r;
            }, function(newCoordinate, oldCoordinate) {
                slot.entry.key = newCoordinate;

                var oldValue = scope.rexContext.getValue(oldCoordinate);
                if(oldValue) {
                    var entry = {
                        key: newCoordinate,
                        val: oldValue
                    };

                    contextCtrl.getOverride().putEntries([entry]);
                }
            }, true);


            scope.$watch(function() {
                var coordinate = slot.entry.key;
                var r = scope.rexContext.getValue(coordinate);
                return r;

            }, function(value) {
                var coordinate = slot.entry.key;

                var entry = {
                    key: coordinate,
                    val: value
                };

                //console.log('Value at coordinate ')

                if(value != null) {
                    contextCtrl.getOverride().putEntries([entry]);
                }

                slot.entry.value = value;

                if(modelSetter) {
                    // If the given model is writeable, then we need to update it
                    // whenever the coordinate's value changes

                    if(value != null) {
                        modelSetter(scope, value);
                    }
                }

            }, true);

            // Forwards: If the model changes, we need to update the
            // change object in the scope
            scope.$watch(function() {
                var r = modelGetter(scope);

                return r;
            }, function(newVal, oldVal) {

                var coordinate = slot.entry.key;//createCoordinate(scope, $component$);
                var entry = {
                    key: coordinate,
                    val: newVal
                };
                slot.entry.val = newVal;

                if(newVal != null) {
                    contextCtrl.getOverride().putEntries([entry]);
                }

                //console.log(tag + ' Model changed to ', newVal, ' from ', oldVal, ' at coordinate ', coordinate, '; updating override ', slot.entry);
            }, true);

        }
    };
};

//var createCompileComponent = function($rexComponent$, $component$, $parse) {
//    //var $rexComponent$ = 'rex' + capitalize($component$);
//
//    var tag = '[' + $component$ + ']';
//
//    return {
//        pre: function(scope, ele, attrs, ctrls) {
//
//
//            var modelExprStr = attrs[$rexComponent$];
//            var modelGetter = $parse(modelExprStr);
//            var modelSetter = modelGetter.assign;
//
//            var obj = syncAttr($parse, scope, attrs, $rexComponent$);
//
//            var contextCtrl = ctrls[0];
//            var objectCtrl = ctrls[1];
//
//            var slot = contextCtrl.allocSlot();
//
//            scope.$on('$destroy', function() {
//                slot.release();
//            });
//
//            // Backwards: If the referenced value changes, we need to update
//            // the model
//
//            // If the coordinate changes, we need to set the model to the current value at that coordinate*
//            // Afterwards, if the value at the coordinate changes (though the coordinate is the same then),
//            // we update the model
//
//            // * We do not retain the current value for the new coordinate,
//            // because when switching resources we would copy the state of the prior resource over
//
//            if(false) {
//            scope.$watch(function() {
//                var coordinate = createCoordinate(scope, $component$);
//                return coordinate;
//            }, function(newCoordinate, oldCoordinate) {
//                var r = scope.rexContext.getValue(newCoordinate);
//
//                if(modelSetter) {
//                    modelSetter(scope, r);
//                }
//
//                //var r = modelGetter(scope);
//
//                // typeof r === 'undefined';
//                var isUndefined = angular.isUndefined(r);
//                var msg = isUndefined ? ' however skipping model update due to undefined ' : ' updating coordinate-target with value ';
//
//                //console.log(tag + ' Coordinate changed to ', newCoordinate, ' from ', oldCoordinate, msg + '; ', r);
//
//                // In any case we need to declare the referenced value
//                slot.entry = {
//                    key: newCoordinate,
//                    val: r
//                };
//
//                if(!isUndefined) {
//                    contextCtrl.getOverride().putEntries([slot.entry]);
//                }
//
//                // TODO: We need to update the override with the new value before we enter the following $watch below.
//            }, true);
//            }
//
//
//             // If the given model is writeable, then we need to update it
//             // whenever the coordinate's value changes
//            if(modelSetter) {
//
//                scope.$watch(function() {
//                    var coordinate = createCoordinate(scope, $component$);
//                    var r = {
//                        coordinate: coordinate,
//                        value: scope.rexContext.getValue(coordinate)
//                    };
//                    return r;
//                }, function(newVal, oldVal) {
//                    var coordinate = newVal.coordinate;//createCoordinate(scope, $component$);
//                    //console.log(tag + ' Coordinate target value changed to ', newVal, ' from ', oldVal, ' for ', coordinate, ' with scope ', scope, '; updating model');
//
//
//                    var value = newVal.value;
//                    slot.entry = {
//                        key: coordinate,
//                        val: value
//                    };
//
//                    if(value != null) {
//                        modelSetter(scope, newVal.value);
//                    }
//                }, true);
//
//            }
////            else {
////                var coordinate = createCoordinate(scope, $component$);
////                console.log('[WARN] No setter for ' + modelExprStr + ' for coordinate ', coordinate);
////            }
//
//
//            // Forwards: If the model changes, we need to update the
//            // change object in the scope
//            scope.$watch(function() {
//                var r = modelGetter(scope);
//
//                return r;
//            }, function(newVal, oldVal) {
//                var coordinate = createCoordinate(scope, $component$);
//                slot.entry = {
//                    key: coordinate,
//                    val: newVal
//                };
//
//                contextCtrl.getOverride().putEntries([slot.entry]);
//
//                //console.log(tag + ' Model changed to ', newVal, ' from ', oldVal, ' at coordinate ', coordinate, '; updating override ', slot.entry);
//            }, true);
//
//        }
//    };
//};


// TODO I think we can remove that function
var firstIfEqual = function(oldVal, newVal) {
    var isEqual = angular.equals(oldVal, newVal);
    var result = isEqual ? oldVal : newVal;
    return result;
};

var assembleTalisJsonRdf = function(map) {
    var result = {};

    var entries = map.entries();

    entries.forEach(function(entry) {
        var coordinate = entry.key;
        var str = entry.val;

        var s = result;
        var p = s[coordinate.s] = s[coordinate.s] || {};
        var x = p[coordinate.p] = p[coordinate.p] || [];
        var o = x[coordinate.i] = x[coordinate.i] || {};

        o[coordinate.c] = str;
    });

    return result;
};

var createTalisJsonObjectWithDefaults = function(o) {
    var result = {
        type: o.type || 'literal',
        value: o.value || '',
        lang: o.lang || '',
        datatype: o.datatype || ''
    };

    return result;
};

var talisJsonRdfToTriples = function(data) {
    var result = [];

    var ss = Object.keys(data);
    ss.sort();

    ss.forEach(function(sStr) {

        var s = jassa.rdf.NodeFactory.createUri(sStr);

        var po = data[sStr];
        var ps = Object.keys(po);
        ps.sort();

        ps.forEach(function(pStr) {
            var p = jassa.rdf.NodeFactory.createUri(pStr);

            var os = po[pStr];

            os.forEach(function(oJson) {

                // Create a clone with defaults applied
                var clone = createTalisJsonObjectWithDefaults(oJson);

                try {
                    o = jassa.rdf.NodeFactory.createFromTalisRdfJson(clone);

                    var triple = new jassa.rdf.Triple(s, p, o);
                    result.push(triple);

                } catch(err) {
                  console.log('Error: could not create node from ' + oJson);
                }
            });
        });
    });

    return result;
};

var talisJsonRdfToTurtle = function(data) {
    var ss = Object.keys(data);
    ss.sort();

    var result = '';
    ss.forEach(function(s) {

        result += '<' + s + '>\n';

        var po = data[s];
        var ps = Object.keys(po);
        ps.sort();

        ps.forEach(function(p) {
            result += '    <' + p + '> ';

            var os = po[p];

            var oStrs = os.map(function(o) {

                var clone = createTalisJsonObjectWithDefaults(o);

                var r;
                try {
                    node = jassa.rdf.NodeFactory.createFromTalisRdfJson(clone);
                    r = '' + node;
                } catch(err) {
                    r += '\n';

                    //console.log('Error: could not create node from ' + o);
                    r += '        // Invalid data for RDF generation:\n';
                    r += '        // raw: ' + JSON.stringify(o) + '\n';
                    r += '        // defaults: ' + JSON.stringify(o) + '\n';
                    r += '        // ' + err + '\n';
                    r += '\n';
                }

                return r;
            });

            result += oStrs.join(', ') + ' ; \n';
        });
        result += '    . \n';
    });

    return result;
};

var __emptyPrefixMapping = new jassa.rdf.PrefixMappingImpl();

var createCoordinate = function(scope, component) {
    var pm = scope.rexPrefixMapping || __emptyPrefixMapping;

    return {
        s: pm.expandPrefix(scope.rexSubject),
        p: pm.expandPrefix(scope.rexPredicate),
        i: scope.rexObject,
        c: component
    };
};


/**
 * One way binding of the value of an attribute into scope
 * (possibly via a transformation function)
 *
 */
var syncAttr = function($parse, $scope, attrs, attrName, deep, transformFn) {
    var attr = attrs[attrName];
    var getterFn = $parse(attr);

    var updateScopeVal = function(val) {
        var v = transformFn ? transformFn(val) : val;

        $scope[attrName] = v;
    };

    $scope.$watch(function() {
        var r = getterFn($scope);
        return r;
    }, function(newVal, oldVal) {
        //console.log('Syncing: ', attrName, ' to ', newVal, ' in ', $scope);
        updateScopeVal(newVal);
    }, deep);

    var result = getterFn($scope);
    // Also init the value immediately
    updateScopeVal(result);

    return result;
};








// TODO Create a util for id allocation

angular.module('ui.jassa.rex', []);

var basePriority = 0;
