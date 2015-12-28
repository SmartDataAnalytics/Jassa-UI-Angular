

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

/**
 *
 * @param oneWay If true, the model is not updated on rexContext changes for the respective coordinate
 *
 */
var createCompileComponent = function($rexComponent$, $component$, $parse, oneWay) {

    var tag = '[' + $component$ + ']';

    return {
        pre: function(scope, ele, attrs, ctrls) {

            //if($component$ != 'deleted') { return; }

            var modelExprStr = attrs[$rexComponent$];
            var modelGetter = $parse(modelExprStr);
            var modelSetter = modelGetter.assign;

            if(!oneWay) {
                syncAttr($parse, scope, attrs, $rexComponent$);
            }

            var contextCtrl = ctrls[0];

            // ngModel is optionally referenced for dirty checking
            var ngModel = ctrls[2];

            var slot = contextCtrl.allocSlot();
            slot.entry = {};

            scope.$on('$destroy', function() {
                slot.release();
                unsetDirty();
            });


            // Immediately set the initial coordinate and set the model value
            // If we don't do it now we will lose any present model values should the coordinate change
            {
                slot.entry.key = createCoordinate(scope, $component$);
                var value = modelGetter(scope);
                if(value) {
                    setValueAt(contextCtrl.getOverride(), slot.entry.key, value);
                }
            }


            var setDirty = function() {
                var coordinate = slot.entry.key;
                //console.log('>> DIRTY   : ' + coordinate);

                var dirty = scope.rexContext.dirty;
                var dirtySlotIds = dirty[coordinate] = dirty[coordinate] || {};
                dirtySlotIds[slot.id] = true;
            };

            var unsetDirty = function(coordinate) {
                coordinate = coordinate || slot.entry.key;
                //console.log('>> PRISTINE: ' + coordinate);

                var dirty = scope.rexContext.dirty;
                var dirtySlotIds = dirty[coordinate];
                if(dirtySlotIds) {
                    delete dirtySlotIds[slot.id];

                    //console.log('>> PRISTINE SLOT: ' + coordinate + ' [' + slot.id + ']');

                    if(Object.keys(dirtySlotIds).length === 0) {
                        delete dirty[coordinate];

                        //console.log('>> PRISTINE COORD: ' + coordinate);
                    }
                }
            };

            /**
             * This is a bit hacky:
             *
             * The deleted attribute is always transferred when the coordinate changes
             *
             */
            var checkDirty = function(coordinate) {
                var result;
                if($component$ === 'deleted') {
                    result = true;
                } else {

                    coordinate = coordinate || slot.entry.key;
                    var dirty = scope.rexContext.dirty;
                    var dirtySlotIds = dirty[coordinate];
                    result = !!dirtySlotIds;
                }
                return result;
            };



            // If there is a model, take the pristine state into account
            if(ngModel) {
                var updateDirtyState = function() {
                    if(ngModel.$pristine) {
                        unsetDirty();
                    } else {
                        setDirty();
                    }
                };

                scope.$watch(updateDirtyState);
            }

            // If the coordinate changes AND the target is not dirty,
            // we copy the value at the override's old coordinate to the new coordinate
            // This way we ensure we are not overwriting a user's input
            // Otherwise (if the model is pristine), just set the model to the value of the current base data
            scope.$watch(function() {
                var r = createCoordinate(scope, $component$);
                return r;
            }, function(newCoordinate, oldCoordinate) {

                // TODO This handler often gets called even if the coordinates actually equal - can we optimize it?
                if(newCoordinate && !newCoordinate.equals(oldCoordinate)) {
                    //console.log('>> Coordinate change from [' + oldCoordinate + '] to ' + ' [' + newCoordinate + ']');

                    // Check the dirty state at the old coordinate
                    var isDirty = checkDirty(oldCoordinate);

                    // Inform the context about the current coordinate we are referring to
                    // TODO: If we did slot.setCoordinate(newCoordinate) then the context could immediately perform actions
                    slot.entry.key = newCoordinate;

                    var value = isDirty
                        ? getEffectiveValue(scope.rexContext, oldCoordinate)
                        : getEffectiveValue(scope.rexContext, newCoordinate)
                        ;

                    //console.log('## Watch 1: Transferring value [' + value + '] from coordinate [' + oldCoordinate + '] to [' + newCoordinate + ']');
                    setValueAt(contextCtrl.getOverride(), newCoordinate, value);

                    //console.log('>> UNDIRTY : ' + oldCoordinate);
                    unsetDirty(oldCoordinate);
                }
            }, true);


            // If the effective value at a coordinate changes, set the model to that value
            if(!oneWay) {
                scope.$watch(function() {
                    var coordinate = slot.entry.key;
                    var r = getEffectiveValue(scope.rexContext, coordinate);
                    return r;

                }, function(value) {
                    var coordinate = slot.entry.key;

                    if(modelSetter) {
                        //console.log('## Watch 2: Setting model value [' + value + '] from coordinate [' + coordinate + ']');
                        modelSetter(scope, value);
                    }

                }, true);
            }

            // If the model value changes, set the value in the override
            // at that coordinate to reflect this
            scope.$watch(function() {
                var r = modelGetter(scope);
                return r;
            }, function(value) {
                var coordinate = slot.entry.key;

                //console.log('## Watch 3: Setting shadow value [' + value + '] at coordinate [' + coordinate + ']');
                setValueAt(contextCtrl.getOverride(), coordinate, value);

            }, true);

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
        } else {
            //console.log('<< DELETED: ' + coordinate);
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


//var createCoordinate = function(scope, component) {
//    var pm = scope.rexPrefixMapping || new jassa.rdf.PrefixMappingImpl(jassa.vocab.InitialContext);
//
//    return new Coordinate(
//        pm.expandPrefix(scope.rexSubject),
//        pm.expandPrefix(scope.rexPredicate),
//        scope.rexObject,
//        component
//    );
//};

var createCoordinate = function(scope, component) {
    return new Coordinate(
        scope.rexSubject,
        scope.rexPredicate,
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
    var s = coordinate ? talisRdfJson[coordinate.s] : null;
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

/* Dangerous: splicing breaks references by index
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
*/

var compactTrailingNulls = function(arr) {
    while(arr.length && arr[arr.length-1] == null){
        arr.pop();
    }
};

var removeValueAt = function(talisRdfJson, coordinate) {

    var ps = talisRdfJson[coordinate.s];
    var is = ps ? ps[coordinate.p] : null;
    var cs = is ? is[coordinate.i] : null;

    if(cs) {
        delete cs[coordinate.c];

        if(Object.keys(cs).length === 0) {

            delete is[coordinate.i];
            compactTrailingNulls(is);

            if(is.length === 0) {
                delete ps[coordinate.p];

                if(Object.keys(ps).length === 0) {
                    delete talisRdfJson[coordinate.s];
                }
            }
        }
    }
};

var setValueAt = function(talisRdfJson, coordinate, value) {
    //if(value != null) {
    if(coordinate != null) {
        var o = getOrCreateObjectAt(talisRdfJson, coordinate);
        o[coordinate.c] = value;
    //}
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

    var getEffectiveValue = function() {
        var v = getterFn($scope);
        var r = transformFn ? transformFn(v) : v;
        return r;
    };

    $scope.$watch(getEffectiveValue, function(v) {
        $scope[attrName] = v;
    }, deep);

    var result = getEffectiveValue();
    // Also init the value immediately
    $scope[attrName] = result;

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

// NOTE: We should make a rex module only for the annotations without the widgets, so that the annotations would not depend on ui.select
angular.module('ui.jassa.rex', ['dddi', 'ui.select'])

.filter('toArray', function() {
    var result = function(obj) {
        var r = obj;
        if (obj instanceof Object) {
            r = _.map(obj, function(val, key) {
                return {
                    key: key,
                    val: val
                };

                //return Object.defineProperty(val, '$key', {__proto__: null, value: key});
            });
        }
        return r;
    };
    return result;
})

;
//var basePriority = 0;
