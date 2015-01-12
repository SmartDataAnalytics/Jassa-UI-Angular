
/**
 * Falsy valued arguments will be replaced with empty strings or 0
 */
var Coordinate = Jassa.ext.Class.create({
    initialize: function(s, p, i, c) {
        this.s = s || '';
        this.p = p || '';
        this.i = i || 0;
        this.c = c || '';
    },

    equals: function(that) {
        var result = this.s === that.s && this.p === that.p && this.i === that.i && this.c === that.c;
        return result;
    },

    hashCode: function() {
        if(this.hash == null) {
            this.hash =
                jassa.util.ObjectUtils.hashCodeStr(this.s) +
                3 * jassa.util.ObjectUtils.hashCodeStr(this.p) +
                7 * this.i +
                11 * jassa.util.ObjectUtils.hashCodeStr(this.c);
        }

        return this.hash;
    },

    toString: function() {
        var result = this.s + ' ' + this.p + ' ' + this.i + ' ' + this.c;
        return result;
    },
});

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

var createCompileComponent = function($rexComponent$, $component$, $parse, oneWay) {
    //var $rexComponent$ = 'rex' + capitalize($component$);
//if(true) { return; }

    var tag = '[' + $component$ + ']';

    return {
        pre: function(scope, ele, attrs, ctrls) {


            var modelExprStr = attrs[$rexComponent$];
            var modelGetter = $parse(modelExprStr);
            var modelSetter = modelGetter.assign;

            if(!oneWay) {
                syncAttr($parse, scope, attrs, $rexComponent$);
            }

            var contextCtrl = ctrls[0];
            //var objectCtrl = ctrls[1];

            var slot = contextCtrl.allocSlot();
            slot.entry = {};

            scope.$on('$destroy', function() {
//console.log('Destroying compile component ' + tag);

                slot.release();
            });

//console.log('Start: Creating compile component ' + tag);

            // If the coordinate changes, we copy the value at the override's old coordinate to the new coordinate
            scope.$watch(function() {
                var r = createCoordinate(scope, $component$);
                return r;
            }, function(newCoordinate, oldCoordinate) {
                slot.entry.key = newCoordinate;

                var oldValue = getEffectiveValue(scope.rexContext, oldCoordinate); //scope.rexContext.getValue(oldCoordinate);
                if(oldValue) {
                    var entry = {
                        key: newCoordinate,
                        val: oldValue
                    };

                    //contextCtrl.getOverride().putEntries([entry]);
                    setValueAt(contextCtrl.getOverride(), entry.key, entry.val);
                }
            }, true);


            if(!oneWay) {
                scope.$watch(function() {
                    var coordinate = slot.entry.key;
                    var r = getEffectiveValue(scope.rexContext, coordinate); //scope.rexContext.getValue(coordinate);
                    return r;

                }, function(value) {
                    var coordinate = slot.entry.key;

                    var entry = {
                        key: coordinate,
                        val: value
                    };

                    //console.log('Value at coordinate ')

                    if(value != null) {
                        //contextCtrl.getOverride().putEntries([entry]);
                        setValueAt(contextCtrl.getOverride(), entry.key, entry.val);
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
            }

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
                    //contextCtrl.getOverride().putEntries([entry]);
                    setValueAt(contextCtrl.getOverride(), entry.key, entry.val);
                }
//                else {
//                    // Remove null values
//                    // TODO Can this happen?
//                    contextCtrl.getOverride().remove(coordinate);
//                }

                //console.log(tag + ' Model changed to ', newVal, ' from ', oldVal, ' at coordinate ', coordinate, '; updating override ', slot.entry);
            }, true);
//console.log('Done: Creating compile component ' + tag);

        }

    };
};

var assembleTalisRdfJson = function(map) {
    //console.log('Assembling talis rdf json');
    var result = {};

    var entries = map.entries();

    entries.forEach(function(entry) {
        var coordinate = entry.key;

        var check = new Coordinate(
            coordinate.s,
            coordinate.p,
            coordinate.i,
            'deleted'
        );

        var isDeleted = map.get(check);

        if(!isDeleted) {
            var str = entry.val;

            var s = result;
            var p = s[coordinate.s] = s[coordinate.s] || {};
            var x = p[coordinate.p] = p[coordinate.p] || [];
            var o = x[coordinate.i] = x[coordinate.i] || {};

            o[coordinate.c] = str;
        }
    });



    return result;
};

/**
 * In place processing of prefixes in a Talis RDF JSON structure.
 *
 * If objects have a prefixMapping attribute, value and datatype fields
 * are expanded appropriately.
 *
 */
var processPrefixes = function(talisRdfJson, prefixMapping) {
    var result = {};

    var sMap = talisRdfJson;
    var ss = Object.keys(sMap);
    ss.forEach(function(s) {
        var pMap = sMap[s];
        var ps = Object.keys(pMap);

        ps.forEach(function(p) {
           var iArr = pMap[p];

           iArr.forEach(function(cMap) {
               //var pm = cMap.prefixMapping;
               var pm = prefixMapping;

               if(pm) {
                   if(cMap.type === 'uri') {
                       var val = cMap.value;
                       cMap.value = pm.expandPrefix(val);
                   } else if(cMap.type === 'literal' && cMap.datatype != null) {
                       var datatype = cMap.datatype;

                       cMap.datatype = pm.expandPrefix(datatype);
                   }

                   //delete cMap['prefixMapping'];
               }
           });
        });
    });

    return result;
};


//var __defaultPrefixMapping = new jassa.rdf.PrefixMappingImpl(jassa.vocab.InitialContext);

var createCoordinate = function(scope, component) {
    var pm = scope.rexPrefixMapping || new jassa.rdf.PrefixMappingImpl(jassa.vocab.InitialContext);
    //__defaultPrefixMapping;

    return new Coordinate(
        pm.expandPrefix(scope.rexSubject),
        pm.expandPrefix(scope.rexPredicate),
        scope.rexObject,
        component
    );
};


//var _array = {
//    create: function() {
//        return [];
//    },
//    put: function(arr, index, value) {
//        data[index] = value;
//    },
//    get: function(arr, index) {
//        return data[index];
//    },
//    remove: function(arr, index) {
//        arr.splice(index, 1);
//    }
//};
//
//var _obj = {
//    create: function() {
//        return {};
//    },
//    put: function(obj, key, value) {
//        obj[key] = value;
//    },
//    get: function(obj, key) {
//        return obj[key];
//    },
//    remove: function(arr, key) {
//        delete obj[key];
//    }
//};
//
//var rdfSchema = [{
//    id: 's',
//    type: _obj
//}, {
//    id: 'p'
//    type: _obj
//}, {
//    id: 'i',
//    type: _array
//}, {
//    id: 'c',
//    type: _obj
//}
//];
//
//var NestedMap = jassa.ext.Class.create({
//    /**
//     * schema: []
//     */
//    initialize: function(schema) {
//        this.schema = schema;
//    },
//
//    put: function(coordinate, value) {
//
//    },
//
//    get: function(coordinate, value) {
//
//    },
//
//    remove: function(coordinate) {
//
//    }
//})


var talisRdfJsonToEntries = function(talisRdfJson) {
    var result = [];

    var sMap = talisRdfJson;
    var ss = Object.keys(sMap);
    ss.forEach(function(s) {
        var pMap = sMap[s];
        var ps = Object.keys(pMap);

        ps.forEach(function(p) {
           var iArr = pMap[p];

           //for(var i = 0; i < iArr.length; ++i) {
           var i = 0;
           iArr.forEach(function(cMap) {
               var cs = Object.keys(cMap);

               cs.forEach(function(c) {
                   var val = cMap[c];

                   var coordinate = new Coordinate(s, p, i, c);

                   result.push({
                       key: coordinate,
                       val: val
                   });
               });
               ++i;
           });

        });

    });

    return result;
};



// Returns the object array at a given predicate
var getObjectsAt = function(talisRdfJson, coordinate) {
    var s = talisRdfJson[coordinate.s];
    var result = s ? s[coordinate.p] : null;
    return result;
};

// Returns the object at a given index
var getObjectAt = function(talisRdfJson, coordinate) {
    var p = getObjectsAt(talisRdfJson, coordinate);
    var result = p ? p[coordinate.i] : null;

    return result;
};

var getOrCreateObjectAt = function(talisRdfJson, coordinate, obj) {
    var s = talisRdfJson[coordinate.s] = talisRdfJson[coordinate.s] || {};
    var p = s[coordinate.p] = s[coordinate.p] || [];
    var result = p[coordinate.i] = p[coordinate.i] || obj || {};
    return result;
};

var removeObjectAt = function(talisRdfJson, coordinate) {
    var s = talisRdfJson[coordinate.s];
    var p = s ? s[coordinate.p] : null;
    //var i = p ? p[coordinate.i] : null;

    if(p) {
        p.splice(coordinate.i, 1);

        if(p.length === 0) {
            delete s[coordinate.p];
        }
    }
};

var removeValueAt = function(talisRdfJson, coordinate) {

    var s = talisRdfJson[coordinate.s];
    var p = s ? s[coordinate.p] : null;
    var i = p ? p[coordinate.i] : null;
    //var c = i ? i[coordinate.c] : null;

    if(i) {
        delete i[coordinate.c];

        if(i.length === 0) {
            delete p[coordinate.p];

            if(Object.keys(p).length === 0) {
                delete s[coordinate.s];
            }
        }
    }
};

var setValueAt = function(talisRdfJson, coordinate, value) {
    if(value != null) {
        var o = getOrCreateObjectAt(talisRdfJson, coordinate);
        o[coordinate.c] = value;
    }
};

// TODO Rename to getComponentAt
var getValueAt = function(talisRdfJson, coordinate) {
    var i = getObjectAt(talisRdfJson, coordinate);
    var result = i ? i[coordinate.c] : null;

    return result;
};


var diff = function(before, after) {
    var result = new jassa.util.HashSet();

    after.forEach(function(item) {
        var isContained = before.contains(item);
        if(!isContained) {
            result.add(item);
        }
    });

    return result;
};


var setDiff = function(before, after) {

    var result = {
        added: diff(before, after),
        removed: diff(after, before)
    };

    return result;
};

var getEffectiveValue = function(rexContext, coordinate) {
    //var result = rexContext.override ? rexContext.override.get(coordinate) : null;
    var result = rexContext.override ? getValueAt(rexContext.override, coordinate) : null;

    if(result == null) {
        result = rexContext.json ? getValueAt(rexContext.json, coordinate) : null;
    }

    return result;
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


var setEleAttrDefaultValue = function(ele, attrs, attrName, defaultValue) {
    var result = ele.attr(attrName);
    if(!result) { // includes empty string
        result = defaultValue;
        ele.attr(attrName, result);

        var an = attrs.$normalize(attrName);
        attrs[an] = result;
    }
    return result;
};






// TODO Create a util for id allocation

angular.module('ui.jassa.rex', []);

var basePriority = 0;
