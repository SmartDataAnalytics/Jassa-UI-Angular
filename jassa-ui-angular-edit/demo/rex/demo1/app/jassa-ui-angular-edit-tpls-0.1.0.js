/*
 * jassa-ui-angular-edit
 * https://github.com/GeoKnow/Jassa-UI-Angular

 * Version: 0.1.0 - 2014-12-02
 * License: BSD
 */
angular.module("ui.jassa.edit", ["ui.jassa.edit.tpls", "ui.jassa.rdf-term-input","ui.jassa.rex","ui.jassa.sync"]);
angular.module("ui.jassa.edit.tpls", ["template/rdf-term-input/rdf-term-input.html"]);
angular.module('ui.jassa.rdf-term-input', [])

.directive('rdfTermInput', ['$parse', function($parse) {

    // Some vocab - later we could fetch labels on-demand based on the uris.
    var vocab = {
        iri: 'http://iri',
        plainLiteral: 'http://plainLiteral',
        typedLiteral: 'http://typedLiteral'
    };

    return {
        restrict: 'EA',
        priority: 4,
        require: '^ngModel',
        templateUrl: 'template/rdf-term-input/rdf-term-input.html',
        replace: true,
        //scope: true,
        scope: {
            //ngModel: '=',
            bindModel: '=ngModel',
            ngModelOptions: '=?',
            logo: '@?',
            langs: '=?', // suggestions of available languages
            datatypes: '=?' // suggestions of available datatypes
        },
        controller: ['$scope', function($scope) {

            $scope.state = $scope.$state || {};
            $scope.ngModelOptions = $scope.ngModelOptions || {};


            $scope.vocab = vocab;

            $scope.termTypes = [
                {id: vocab.iri, displayLabel: 'IRI'},
                {id: vocab.plainLiteral, displayLabel: 'plain'},
                {id: vocab.typedLiteral, displayLabel: 'typed'}
            ];

            var langs = [
                {id: '', displayLabel: '(none)'},
                {id: 'en', displayLabel: 'en'},
                {id: 'de', displayLabel: 'de'},
                {id: 'fr', displayLabel: 'fr'},
                {id: 'zh', displayLabel: 'zh'},
                {id: 'ja', displayLabel: 'ja'}
            ];

//            setModelAttr: function(attr, val) {
//                ngModel.$modelValue[attr] = val;
//                $scope.apply();
//            };

            /*
            $scope.termTypes = [vocab.iri, vocab.plainLiteral, vocab.typedLiteral];

            $scope.termTypeLabels = {};
            $scope.termTypeLabels[vocab.iri] = 'IRI';
            $scope.termTypeLabels[vocab.plainLiteral] = 'plain';
            $scope.termTypeLabels[vocab.typedLiteral] = 'typed';
            */


            $scope.langs = $scope.langs || langs;

            var keys = Object.keys(jassa.vocab.xsd);
            $scope.datatypes = keys.map(function(key) {

                var id = jassa.vocab.xsd[key].getUri();
                return {
                    id: id,
                    displayLabel: jassa.util.UriUtils.extractLabel(id)
                };
            });
            //$scope.

        }],
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ngModel) {

                    var getValidState = function() {
                        var result;

                        var state = scope.state;
                        var type = state.type;
                        switch(type) {
                        case vocab.iri:
                            result = {
                                type: 'uri',
                                value: state.value
                            };
                            break;
                        case vocab.plainLiteral:
                            result = {
                                type: 'literal',
                                value: state.value,
                                lang: state.lang,
                                datatype: ''
                            };
                            break;
                        case vocab.typedLiteral:
                            result = {
                                type: 'literal',
                                value: state.value,
                                datatype: state.datatype || jassa.vocab.xsd.xstring.getUri()
                            };
                            break;
                        }

                        return result;
                    };

                    var convertToState = function(talisJson) {
                        // IMPORTANT: We cannot apply defaults here on the value taken from the model,
                        // because otherwise
                        // we would expose the state based on the defaults, which could
                        // in turn update the model again and modify its value
                        // Put differently: The model must not be changed unless there is user interaction
                        // with this widget!

                        //var clone = createTalisJsonObjectWithDefaults(talisJson);
                        var clone = talisJson;

                        if(clone.type != null && clone.value == null) {
                            clone.value = '';
                        }

                        var node;
                        try {
                            node = jassa.rdf.NodeFactory.createFromTalisRdfJson(clone);
                        } catch(err) {
                            // Ignore invalid model values, and just wait for them to become valid
                            //console.log(err);
                        }


                        var result;
                        if(!node) {
                            result = {};
                        } else if(node.isUri()) {
                            result = {
                                type: vocab.iri,
                                value: node.getUri()
                            };
                        } else if(node.isLiteral()) {
                            var dt = node.getLiteralDatatypeUri();
                            var hasDatatype = !jassa.util.ObjectUtils.isEmptyString(dt);

                            if(hasDatatype) {
                                result = {
                                    type: vocab.typedLiteral,
                                    value: node.getLiteralLexicalForm(),
                                    datatype: dt
                                };
                            } else {
                                result = {
                                    type: vocab.plainLiteral,
                                    value: node.getLiteralLexicalForm(),
                                    lang: node.getLiteralLanguage()
                                };
                            }
                        }

                        return result;
                    };

                    scope.$watch(function () {
                        var r = scope.bindModel;
                        return r;
                    }, function(talisJson) {
                        //console.log('Got outside change: ', talisJson);

                        if(talisJson) {
                            var newState = convertToState(talisJson);

//                            var newState;
//                            try {
//                                newState = convertToState(talisJson);
//                            } catch(err) {
//                                newState = {};
//                            }

                            scope.state = newState;
                            //console.log('ABSORBED', newState, ' from ', talisJson);
                        }
                    }, true);

                    //if(modelSetter) {

                        scope.$watch(function () {
                            var r = getValidState();
                            return r;
                        }, function(newValue) {
                            if(newValue) {
                                //modelSetter(scope, newValue);
                                //scope.bindModel = newValue;
                                angular.copy(newValue, scope.bindModel);

                                //if(!scope.$phase) { scope.$apply(); }
                                //console.log('EXPOSED', scope.bindModel);
                            }
                        }, true);
                    //}
                }


                // Code below worked with scope:true - but we want an isolated one
                    /*
                    var modelExprStr = attrs['ngModel'];
                    var modelGetter = $parse(modelExprStr);
                    var modelSetter = modelGetter.assign;

                    //console.log('Sigh', modelExprStr, modelGetter(scope));

                    scope.$watch(function () {
                        var r = modelGetter(scope);
                        return r;
                    }, function(talisJson) {
                        //console.log('Got outside change: ', talisJson);

                        if(talisJson) {
                            var newState = convertToState(talisJson);
                            scope.state = newState;
                            //console.log('ABSORBED', newState, ' from ', talisJson);
                        }
                    }, true);

                    if(modelSetter) {

                        scope.$watch(function () {
                            var r = getValidState();
                            return r;
                        }, function(newValue) {
                            if(newValue) {
                                modelSetter(scope, newValue);
                                //console.log('EXPOSED', newValue);
                            }
                        }, true);
                    }
                }
                */
            };
        }
    };
}]);




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

var __defaultPrefixMapping = new jassa.rdf.PrefixMappingImpl(jassa.vocab.InitialContext);

var createCoordinate = function(scope, component) {
    var pm = scope.rexPrefixMapping || __defaultPrefixMapping;

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

                        var talis = assembleTalisJsonRdf(dataMap);
                        //console.log('Talis JSON', talis);
                        var turtle = talisJsonRdfToTurtle(talis);


                        var tmp = assembleTalisJsonRdf(scope.rexContext.cache);

                        var before = talisJsonRdfToTriples(tmp).map(function(x) { return '' + x; });

                        var after = talisJsonRdfToTriples(talis).map(function(x) { return '' + x; });
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

if(false) {
                    scope.$watch(function() {
                        var r = createDataMap();
                        return r;
                        //var r = scope.rexContext.override.entries();
                    }, function(dataMap) {
                        //console.log('override modified', scope.rexContext.override.entries());
                        //mapDifference(scope.rexContext.override, scope.rexContext.cache);

                        // Remove values from override that are not referenced
                        cleanupReferences();
                        cleanupOverride();

                        //var dataMap = createDataMap();
                        updateDerivedValues(dataMap);
                    }, true);
}

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

                    if(false) {
                    scope.$watch(function() {
                        //var entries = scope.rexChangeScopes.map(function(child) {
                        var ids = Object.keys(scope.rexChangeSlots);


                        var entries = ids.map(function(id) {
                            var child = scope.rexChangeSlots[id];
                            return child.entry;
                        });

                        entries = entries.filter(function(entry) {
                            return entry != null && entry.val != null;
                        });

                        //console.log('Updating override with ', entries.length, ' remaining entries:', entries);
                        return entries;

                    }, function(newEntries) {
                        var override = scope.rexContext.override;

                        override.clear();
                        if(newEntries) {
                            override.putEntries(newEntries);

                            //console.log('Override: ', JSON.stringify(newEntries));
                            //console.log('Override: ', JSON.stringify(override.entries()));
                            //console.log('Override: ', override);

                            var talis = assembleTalisJsonRdf(override);
                            var turtle = talisJsonRdfToTurtle(talis);


                            var tmp = assembleTalisJsonRdf(scope.rexContext.cache);

                            var before = talisJsonRdfToTriples(tmp).map(function(x) { return '' + x; });

                            var after = talisJsonRdfToTriples(talis).map(function(x) { return '' + x; });
                            var remove = _(before).difference(after);
                            var added = _(after).difference(before);

                            //console.log('DIFF: Added: ' + added);
                            //console.log('DIFF: Removed: ' + remove);

                            scope.rexContext.talisJson = turtle;

                            //console.log('Talis: ', talis);
                        }
                    }, true);
                    }

                    //scope.rexChangeScopes = []; // Array of scopes of which each provides a 'getChanges()'


                    // TODO Should we keep an array of changes here, which we watch
                    // in the scope and use it to compute the effective RDF data?
                    // sounds reasonable i guess






//                    scope.rexContext = scope.$parent.$eval(attrs.rexContext);
//                    scope.rexContext.resources = scope.rexContext.resources || [];

//                         scope.$watch(function() {
//                             return scope.$parent.$eval(attrs.rexContext);
//                         }, function(val) {
//                             scope.rexContext = val;
//                             scope.rexContext.resources = scope.rexContext.resources || [];
//                         });

                    //scope.$watch()
                    //var rexContext = scope.rexContext = scope.$parent.$eval(attrs.rexContext);
                },
                post: function(scope, ele, attrs, ctrls) {
//                    console.log('<context>', scope.rexContext);
                }
            };
        }
    };
}])

;

angular.module('ui.jassa.rex')

.directive('rexDatatype', ['$parse', function($parse) {
    return {
        priority: 7,
        restrict: 'A',
        scope: true,
        require: ['^rexContext', '^rexObject'],
        controller: function() {},
        compile: function(scope, ele, attrs, ctrls) {
            return createCompileComponent('rexDatatype', 'datatype', $parse);
        }
    };
}])

;

angular.module('ui.jassa.rex')

/**
 * Convenience directive
 *
 * rexObjectIri="model"
 *
 * implies rex-object rex-termtype="iri" rex-value="model"
 */
.directive('rexIri', ['$parse', '$compile', function($parse, $compile) {
    return {
        priority: basePriority + 1000,
        restrict: 'A',
        scope: true,
        terminal: true,
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    var modelExprStr = ele.attr('rex-iri');

                    if(jassa.util.ObjectUtils.isEmptyString(modelExprStr)) {
                        var name = getModelAttribute(attrs);
                        modelExprStr = attrs[name];
                    }

                    if(!modelExprStr) {
                        throw new Error('No model provided and found');
                    }


                    ele.removeAttr('rex-iri');

                    ele.attr('rex-object', ''); //'objectIriObject');
                    ele.attr('rex-termtype', '"uri"');
                    ele.attr('rex-value', modelExprStr);

                    // Continue processing any further directives
                    $compile(ele)(scope);
                },
                post: function(scope, ele, attrs, ctrls) {
                }
            };
        }
    };
}])

;

angular.module('ui.jassa.rex')

.directive('rexLang', ['$parse', function($parse) {
    return {
        priority: 7,
        restrict: 'A',
        scope: true,
        require: ['^rexContext', '^rexObject'],
        controller: function() {},
        compile: function(scope, ele, attrs, ctrls) {
            return createCompileComponent('rexLang', 'lang', $parse);
        }
    };
}])

;

angular.module('ui.jassa.rex')

.directive('rexLiteral', ['$parse', '$compile', function($parse, $compile) {
    return {
        priority: basePriority + 1000,
        restrict: 'A',
        scope: true,
        terminal: true,
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    var modelExprStr = ele.attr('rex-literal');

                    if(jassa.util.ObjectUtils.isEmptyString(modelExprStr)) {
                        var name = getModelAttribute(attrs);
                        modelExprStr = attrs[name];
                    }

                    if(!modelExprStr) {
                        throw new Error('No model provided and found');
                    }

                    ele.removeAttr('rex-literal');

                    // TODO: Do not overwrite rex-object if already present

                    ele.attr('rex-object', ''); //'objectIriObject');
                    ele.attr('rex-termtype', '"literal"');
                    ele.attr('rex-value', modelExprStr);

                    // Continue processing any further directives
                    $compile(ele)(scope);
                },
                post: function(scope, ele, attrs, ctrls) {
                }
            };
        }
    };
}])

;

angular.module('ui.jassa.rex')

/**
 *
 * rexObject takes an index to reference an object in a (conceptual) array under a given subject and predicate
 *
 * Hm, no, I still think we can do better: There are different ways to refer to a specific object:
 * - by index (the 3nd item under leipzig -> rdfs:label (possibly of a certain datatype and lang)
 * - by value (i am referring to the triple having leipzig -> population -> 500000)
 *   yet, we could generalize a value reference  to an index reference:
 *      the first object satisfying "leipzig -> population -> {value: 500000 }"
 *
 * So long story short: this directive references an item in regard to a set of filters.
 *
 *
 * TODO Update below
 *
 * Note that this directive only creates a context for setting components
 * (term type, value, datatype and language tag) of an object -
 * it does not create an rdf.Node object directly.
 *
 * rex-object="{}" // someObject
 * The argument is optional.
 *
 * If one is provided, it is as a reference to an object being built, otherwise
 * a new object is allocated.
 * The provided object is registered at the object for the
 * corresponding predicate and subject in the context where it is used.
 *
 * Note that this means that in principle several triples being built could reference
 * the state of the same object (even if they are built using different rex-contexts).
 */
.directive('rexObject', ['$parse', function($parse) {
    return {
        priority: basePriority + 13,
        restrict: 'A',
        scope: true,
        require: '^rexPredicate',
        controller: function() {},
        compile: function(ele, attrs) {

//            var modelExprStr = ele.attr('rex-object');
//            if(!modelExprStr) {
//                ele.attr('rex-object')
//            }
//
//            // TODO Raise an error if rex-predicate exists on this element
//            //if(ele.attr)
//
//            ele.removeAttr('rex-typeof');
//
//            ele.attr('rex-predicate', '"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"');
//            ele.attr('rex-iri', modelExprStr);


            return {
                pre: function(scope, ele, attrs, predicateCtrl) {
                    var i = predicateCtrl.rexObjectScopes.length;
                    if(!attrs['rexObject']) {
                        attrs['rexObject'] = '' + i;
                    }
                    //console.log('FOOO', attrs);

//console.log('rexObject index: ' + i);
                    predicateCtrl.rexObjectScopes.push(scope);

                    syncAttr($parse, scope, attrs, 'rexObject');

//                    scope.$watch('rexObject', function(newVal) {
//                        console.log('rexObject is: ', newVal, typeof newVal);
//                    })

                    scope.$on('$destroy', function() {
                        jassa.util.ArrayUtils.removeItemStrict(predicateCtrl.rexObjectScopes, scope);
                    });

                }
            };
        }
    };
}])

;

angular.module('ui.jassa.rex')

.directive('rexPredicate', ['$parse', function($parse) {
    return {
        priority: basePriority + 17,
        restrict: 'A',
        scope: true,
        //require: ['^?rexSubject', '^?rexObject']
        controller: ['$scope', function($scope) {
            this.rexObjectScopes = $scope.rexObjectScopes = [];
        }],
        compile: function(ele, attrs){
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    syncAttr($parse, scope, attrs, 'rexPredicate');
                }
            };
        }
    };
}])

;

angular.module('ui.jassa.rex')

/**
 * Prefixes
 */
.directive('rexPrefix', ['$parse', function($parse) {
    return {
        priority: basePriority + 19,
        restrict: 'A',
        scope: true,
        //require: '^rexContext',
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {

                    var processPrefixDecls = function(val) {
                        // Set up a prototype chain to an existing
                        // prefix mapping
                        var parentRexPrefix = scope.$parent.rexPrefix;
                        var parentPrefixes = parentRexPrefix ? parentRexPrefix.prefixes : jassa.vocab.InitialContext;

                        var result;
                        if(parentPrefixes) {
                            result = Object.create(parentPrefixes);
                        } else {
                            result = {};
                        }

                        var obj = jassa.util.PrefixUtils.parsePrefixDecls(val);
                        angular.extend(result, obj);
//                        var keys = Object.keys(obj);
//                        keys.forEach(function(key) {
//                            result[key] = obj[key];
//                        });

                        return result;
                    };

                    syncAttr($parse, scope, attrs, 'rexPrefix', true, processPrefixDecls);

                    // TODO We may need to watch scope.$parent.rexPrefix as well

                    var updatePrefixMapping = function() {
//                        for(var key in scope.rexPrefix) {
//                            console.log('GOT: ', key);
//                        }

                        scope.rexPrefixMapping = new jassa.rdf.PrefixMappingImpl(scope.rexPrefix);
                    };

                    // Update the prefixMapping when the prefixes change
                    scope.$watch(function() {
                        return scope.rexPrefix;
                    }, function(rexPrefix) {
                        updatePrefixMapping();
                    }, true);

                    updatePrefixMapping();
                }
            };
        }
    };
}])

;

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

angular.module('ui.jassa.rex')

.directive('rexTermtype', ['$parse', function($parse) {
    return {
        priority: 7,
        restrict: 'A',
        scope: true,
        require: ['^rexContext', '^rexObject'],
        controller: function() {},
        compile: function(ele, attrs) {
            return createCompileComponent('rexTermtype', 'type', $parse);
        }
    };
}])

;

/*
 * Important: The convenience directives must have a high priority, because
 * any controller with a even higher priority will be compiled again!
 *
 */



/**
 * This directive (under a predicate) only selects corresponding objects having the specified language tag
 * Conversely, each object will will automatically get the given language assigned (this is needed, otherwise
 * an input would not match the filter)
 */
/*
.directive('rex-filter-lang', ['$parse', function($parse) {
    return {
        priority: 7,
        restrict: 'A',
        scope: true,
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    syncAttr($parse, scope, attrs, 'rexFilterLang');
                }
            };
        }
    };
}])
*/


/*
.directive('rexSync', ['$parse', function($parse) {
    return {
        priority: 7,
        restrict: 'A',
        scope: true,
        //require: ['^rexContext', '^rexObject'],
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    var modelExprStr = ele.attr('rex-sync');

                    ele.removeAttr('rex-object-iri');

                    ele.attr('rex-object', ''); //'objectIriObject');
                    ele.attr('rex-termtype', '"uri"');
                    ele.attr('rex-value', modelExprStr);

                    // Continue processing any further directives
                    $compile(ele)(scope);
                }
            };
        }
    };
}])
*/




/*
.directive('rexObject', function() {
    return {
        priority: 0,
        restrict: 'A',
        scope: true,
        require: '?^ngModel',
        controller: function() { },
        link: function(scope, ele, attrs, ngModelCtrl) {
            scope.rexModelCtrl = ngModelCtrl;

            scope.$watch('[rexResource, rexProperty, rexDatatype, rexLang, ngModel, rexModelCtrl.$viewValue]', function(val) {
                console.log('STATUS: ', val, scope)
            }, true);
        }
    };
})
*/

/*
.directive('rexType', function() {
    return {
        priority: 6,
        restrict: 'A',
        scope: true,
        controller: ['$scope', function($scope) {
            this.getValue = function() {
                return $scope.rexLang;
            };
        }],
        link: function(scope, ele, attrs, ctrls) {
            scope.rexLang = scope.$parent.$eval(attrs.rexLang);
            //console.log('<lang>', scope.rexLang);
        }
    };
})
*/

/**
 * A directive that can hold a json object with fields describing an RDF term.
 *
 */
/*
.directive('rexTerm', function() {
    return {
        priority: 4,
        restrict: 'A',
        scope: true,
        controller: ['$scope', function($scope) {
        }],
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, resourceCtrl) {
                },
                post: function(scope, ele, attrs, resourceCtrl) {
                    //alert(scope.rexTest);

                }
            };
        }
    };
})

*/


/*
.directive('rexGraph', function() {
    return {
        priority: 6,
        restrict: 'A',
        require: ['?^rexResource', '?^rexProperty', '?^rexDatatype', '?^rexRang', '?^rexTypeof'],
        // '?^about', '?^rel', '?^rev', '?^src', '?^href', '?^content'
        scope: true,
        controller: ['$scope', function($scope) {
            var ctrls = $scope.ctrls;

            if(ctrls) {
                ctrls.forEach(function(ctrl) {
                    if(ctrl != null) {
                        console.log('Value: ', ctrl, ctrl.getValue());
                    }
                });
            }

        }],
        link: function(scope, ele, attrs, ctrls) {

            scope.ctrls = ctrls;

//                 var resourceCtrl = ctrls[0];
//                 var propertyCtrl = ctrls[1];
//                 var datatypeCtrl = ctrls[2];
//                 var langCtrl = ctrls[3];
        }
    };
})
*/

// TODO Add rex-object (or-rex-value) (argument is interpreted as the lexical form then, and should be a string)
// TODO Add rex-object-id to give an object under a subject/property an id
// TODO Support references to triples/object - Maybe rex-model="some-object-id" could configure an ng-model
   // Issue: It might be the case that we would need rex-model-val , rex-model-dt, rex-model-lang, etc
   // Alternatively, modifiers such as rex-model-type="lang" could be used, an the default would refer to the lexical value
   // If rex-model is used without an argument, a new object will be allocated under given predicate/object contexts


// TODO Disconnected ressources: If a resource attribute is below another resource without a property, the resource is disconnected
// But yet, we could have a resource under a property that should be disconnected
// Maybe we should create a rex-parent
//








angular.module('ui.jassa.rex')

/**
 * Convenience directive
 *
 * implies rex-prediacte="rdf:type" rex-iri
 *
 * !! Important: because rex-predicate is implied, this directive cannot be used on a directive
 * that already hase rex-predicate defined !!
 */
.directive('rexTypeof', ['$parse', '$compile', function($parse, $compile) {
    return {
        priority: basePriority + 1000,
        restrict: 'A',
        scope: true,
        terminal: true,
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    var modelExprStr = ele.attr('rex-typeof');

                    // TODO Raise an error if rex-predicate exists on this element
                    //if(ele.attr)

                    ele.removeAttr('rex-typeof');

                    ele.attr('rex-predicate', '"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"');
                    ele.attr('rex-iri', modelExprStr);

                    // Continue processing any further directives
                    $compile(ele)(scope);
                },
                post: function(scope, ele, attrs, ctrls) {
                }
            };
        }
    };
}])

;

angular.module('ui.jassa.rex')

.directive('rexValue', ['$parse', function($parse) {
    return {
        priority: 379,
        restrict: 'A',
        scope: true,
        require: ['^rexContext', '^rexObject'],
        controller: function() {},
        compile: function(ele, attrs) {
            return createCompileComponent('rexValue', 'value', $parse);
        }
    };
}])

;


// Updates a target model based on transformation whenever the source changes
var syncHelper = function(scope, attrs, $parse, $interpolate, sourceAttr, targetAttr, fnAttr, conditionAttr, iterpolateSource) {

    // TODO Instead of $interpolate we could actually use attrs.$observe()

    var sourceExprStr = attrs[sourceAttr];
    var sourceGetter = iterpolateSource ? $interpolate(sourceExprStr) : $parse(sourceExprStr);

    var targetExprStr = attrs[targetAttr];
    var targetGetter = $parse(targetExprStr);
    var targetSetter = targetGetter.assign;

    var fnExprStr = attrs[fnAttr];
    var fnGetter = $parse(fnExprStr);

    var identity = function(x) {
        return x;
    };


    var conditionExprStr = attrs[conditionAttr];
    var conditionGetter = $parse(conditionExprStr);

    var checkCondition = function() {
        var tmp = conditionGetter(scope);
        var result = angular.isUndefined(tmp) ? true : tmp;
        return result;
    };

    var doSync = function() {
        var isConditionSatisfied = checkCondition();
        if(isConditionSatisfied) {
            var sourceValue = sourceGetter(scope);
            var fn = fnGetter(scope) || identity;
            var v = fn(sourceValue);
            targetSetter(scope, v);
        }
    };

    // If the condition changes to 'true', resync the models
    scope.$watch(function() {
        var r = checkCondition();
        return r;
    }, function(isConditionSatisfied) {
        if(isConditionSatisfied) {
            doSync();
        }
    }); // Condition should be boolean - no need for deep watch

    scope.$watch(function() {
        var r = fnGetter(scope);
        return r;
    }, function(newFn) {
        if(newFn) {
            doSync();
        }
    }); // Functions are compared by reference - no need to deep watch

    scope.$watch(function() {
        var r = sourceGetter(scope);
        return r;
    }, function(sourceValue) {
        doSync();
    }, true);

};

angular.module('ui.jassa.sync', []);

angular.module('ui.jassa.sync')

.directive('syncToSource', ['$parse', '$interpolate', function($parse, $interpolate) {
    return {
        priority: 390,
        restrict: 'A',
        //scope: true,
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    syncHelper(scope, attrs, $parse, $interpolate, 'syncTarget', 'syncSource', 'syncToSource', 'syncToSourceCond', false);
                }
            };
        }
    };
}])

;


angular.module('ui.jassa.sync')

// sync-to-target="toString"
.directive('syncToTarget', ['$parse', '$interpolate', function($parse, $interpolate) {
    return {
        priority: 390,
        restrict: 'A',
        //scope: true,
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {

                    var interpolateSource = 'syncSourceInterpolate' in attrs;

                    syncHelper(scope, attrs, $parse, $interpolate, 'syncSource', 'syncTarget', 'syncToTarget', 'syncToTargetCond', interpolateSource);
                }
            };
        }
    };
}])

;

angular.module("template/rdf-term-input/rdf-term-input.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/rdf-term-input/rdf-term-input.html",
    "<div class=\"input-group\">\n" +
    "\n" +
    "    <!-- First input addon -->\n" +
    "    <!-- TODO Make content configurable -->\n" +
    "<!--     <span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-link\"></span></span> -->\n" +
    "    <span class=\"input-group-addon\" ng-bind-html=\"logo\"></span>\n" +
    "\n" +
    "    <!-- Term type selector -->\n" +
    "    <div class=\"input-group-addon\">\n" +
    "        <select ng-model=\"state.type\" ng-model-options=\"ngModelOptions\" ng-options=\"item.id as item.displayLabel for item in termTypes\" ng-change=\"ensureValidity()\"></select>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Datatype selector -->\n" +
    "    <span ng-show=\"state.type===vocab.typedLiteral\" class=\"input-group-addon\">\n" +
    "        <select ng-model=\"state.datatype\" ng-model-options=\"ngModelOptions\" ng-options=\"item.id as item.displayLabel for item in datatypes\"></select>\n" +
    "    </span>\n" +
    "\n" +
    "    <!-- Language selector -->\n" +
    "    <span ng-show=\"state.type===vocab.plainLiteral\" class=\"input-group-addon\">\n" +
    "        <select ng-model=\"state.lang\" ng-model-options=\"ngModelOptions\" ng-options=\"item.id as item.displayLabel for item in langs\"></select>\n" +
    "    </span>\n" +
    "\n" +
    "    <input type=\"text\" class=\"form-control margin-left-1\" ng-model=\"state.value\" ng-model-options=\"ngModelOptions\">\n" +
    "</div>\n" +
    "\n" +
    "");
}]);
