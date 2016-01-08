

var ArrayTool = Jassa.ext.Class.create({
    filter: function() {
        throw new Error('not implemented');
    },

    project: function(obj) {
        throw new Error('not implemented');
    },

    /**
     * Inverse of the projection function.
     */
    inject: function(obj, value) {
        throw new Error('not implemented');
    },

    /**
     * Generate a new default base value (i.e. an object on which project
     * can be applied)
     */
    generate: function() {
        throw new Error('not implemented');
    }
});

var RdfObjectFilter = Jassa.ext.Class.create({
    initialize: function(types, langs, datatypes) {
        this.types = termTypes || null;
        this.langs = langs || null;
        this.datatypes = datatypes || null;
    }

    // TODO Add validate function (here or in a util class)
});


/**
 * Tooling for creating a virtual array based on filters on RDF objects
 *
 */
var ArrayToolRdfObject = Jassa.ext.Class.create({
    initialize: function(rdfObjectFilter, defaultTalisRdfJson, projectAttr) {
        this.rdfObjectFilter = rdfObjectFilter;
        this.defaultTalisRdfJson = defaultTalisRdfJson; // Talis rdf json object with default values
        this.projectAttr = projectAttr || 'value';
    },

    deriveDefaults: function() {
        var rof = this.rdfObjectFilter;

        var result = {
            type: rof.types ? rof.types[0] : null,
            lang: rof.langs ? rof.langs[0] : null,
            datatype: rof.datatypes ? rof.datatypes[0] : null,
            value: null
        };

        return result;
    },

    arrayContains: function(array, item) {
        var result = array == null
            ? true
            : array.indexOf(item) > -1;

        return result;
    },

    filter: function(json) {
        var rof = this.rdfObjectFilter;
        //var json = NodeUtils.toTalisRdfJson(node);
        //var json =

        var acceptType = arrayContains(rof.types, json.type);
        var acceptLang = arrayContains(rof.langs, json.lang);
        var acceptDatatype = arrayContains(rof.datatypes, json.datatype);

        var result = acceptType && acceptLang && acceptDataype;
        return result;
    },

    // TODO Does project return the default if the projected value is null? I'd say yes.
    project: function(obj, value) {
        var result = obj[this.projectAttr];
        return result;
//
//        if(arguments.length === 1) {
//            result = obj[this.projectAttr];
//        } else {
//            obj[this.projectAttr] = value;
//        }
//        return result;
    },

    inject: function(obj, value) {
        obj[this.projectAttr] = value;
    },


    generate: function() {
        var result = {};
        ObjectUtils.extend(result, this.defaultTalisRdfJson);

        return result;
    }
});


var SimpleArray = Jassa.ext.Class.create({

});


/**
 * An array of all URIs that are reachable via a property in inverse direction
 *
 */
var SimpleArrayRdfInverse = Jassa.ext.Class.create({
    initialize: function(talisRdfJson, propertyStr, sourceRdfObject) {
        this.talisRdfJson = talisRdfJson;
        this.propertyStr = propertyStr;
        this.sourceRdfObject = sourceRdfObject;
    }
});




var ArrayWrapper = Jassa.ext.Class.create(SimpleArray, {
    initialize: function(baseArray) {
        this.baseArray = baseArray;
    },

    get: function(index) {
        var result = this.baseArray[index];
        return result;
    },

    set: function(index, value) {
       this.baseArray[index] = value;
    },

    push: function(value) {
        this.baseArray.push(value);
    },

    pop: function() {
        var result = this.baseArray.pop();
        return result;
    },

//    remove: function(index) {
//        this.baseArray.splice(index, 1);
//    },

    size: function() {
        var result = this.baseArray.length;
        return result;
    }
});


/**
 * Notes on deletion: TODO Which semantic to use - remove or mark as deleted?
 *
 * Note: This array object is not a proxy, but it can be delegated
 * to by one.
 *
 */
var SimpleArrayVirt = Jassa.ext.Class.create({
    initialize: function(baseArrayFn, arrayTool) {
        //this.talisRdfJson = talisRdfJson || {};
        this.baseArrayFn = baseArrayFn; // getter/setter that returning a base array
        this.arrayTool = arrayTool;

        var self = this;
        this.itemPredicate = function(item) {
            var r = self.arrayTool.filter(item);
            return r;
        };
    },

    /**
     * Removal
     */
    remove: function(virtIndex) {
        var baseArray = this.baseArrayFn();
        var indexMap = ArrayUtils.createIndexMapVirtToBase(baseArray, this.itemPredicate);

        var baseIndex = virtIndex < indexMap.length
            ? indexMap[virtIndex]
            : null;

        if(baseIndex != null) {
            //baseArray.splice(baseIndex, 1);
            baseArray.remove(baseIndex, 1);
            this.baseArrayFn(baseArray); // set the array with the removed element back
        }
    },

    set: function(virtIndex, value) {
        var baseArray = this.baseArrayFn();
        var indexMap = ArrayUtils.createIndexMapVirtToBase(baseArray, this.itemPredicate);

        var baseIndex = virtIndex < indexMap.length
            ? indexMap[virtIndex]
            : null;

        // If there was no base index, we need to allocate additional array elements
        if(baseIndex != null) {
            var delta = virtIndex - offset;
            for(var i = 0; i < delta; ++i) {
                var newItem = this.arrayTool.generate();
                baseArray.push(newItem);
                indexMap.push(baseArray.length);
            }
        }

        var item = baseArray.get(baseIndex);
        //this.arrayTool.project(item, value);
        this.arrayTool.inject(item, value);
    },

    push: function(value) {
        var index = this.size();
        this.set(index, value);
    },

    get: function(virtIndex) {
        var baseArray = this.baseArrayFn();
        var indexMap = ArrayUtils.createIndexMapVirtToBase(baseArray, this.itemPredicate);

        var baseIndex = virtIndex < indexMap.length
            ? indexMap[virtIndex]
            : null;

        var item = baseIndex
            ? baseArray.get(baseIndex)
            : null;

        var result = this.arrayTool.project(item);

        return result;
    },

    size: function() {
        var indexMap = ArrayUtils.createIndexMapVirtToBase(baseArray, this.itemPredicate);
        var result = indexMap.length;
        return result;
    }


});


SimpleArrayVirt.createVirtArrayForRdf = function(talisRdfJson, subject, predicate) {

};


var ArrayUtils = {
    /**
     * Create a mapping of indices between a baseArray
     * and the virtual array when the array is filtered via some predicate.
     *
     * result[virtualIndex] = baseIndex
     *
     * @param predicate A function
     */
    createIndexMapVirtToBase: function(baseArrayFn, itemPredicate) {
        var result = [];
        var baseArray = this.baseArrayFn();

        for(var i = 0; i < baseArray.size(); ++i) {
            var baseItem = baseArray.get(i);
            var isAccepted = itemPredicate(baseItem);

            if(isAccepted) {
                result.push(i);
            } // else: just skip the item
        }

        return result;
    },


    /**
     * Copies data from destArr to srcArr via the indexArr.
     * indexArr maps indexes of srcArr to those in destArr
     *
     *
     * @param destArr Array containing the data
     * @param indexArr (in/out) Array mapping indexes to t
     * @param srcArray Array containing the source data
     */
    syncToSrc: function(srcArr, destArr, indexArr) {
        destArr.forEach(function(item, destIndex) {
            var srcIndex = indexArr[destIndex];
            if(srcIndex == null) {
                // if there is no srcIndex, append the item to srcArr
                srcIndex = srcArr.length;
                srcArray.push(item);
                indexArr[destIndex] = srcIndex;
            } else {
                srcArray[srcIndex] = item;
            }
        });

        // TODO Delete items that were removed from dest
    },

    syncToDest: function(srcArr, destArr, indexArr) {
        indexArr.forEach(function(srcIndex, destIndex) {
            var item = srcArr[srcIndex];
            destArr[destIndex] = item;
        });
    }
};


// Prefix str:
//var parsePrefixStr = function(str) {
//    regex = /\s*([^:]+)\s*:\s*([^\s]+)\s*/g;
//};


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
                    jassa.rdf.TalisRdfJsonUtils.setValueAt(contextCtrl.getOverride(), slot.entry.key, value);
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
                    jassa.rdf.TalisRdfJsonUtils.setValueAt(contextCtrl.getOverride(), newCoordinate, value);

                    // experimental:
                    /*
                        jassa.rdf.TalisRdfJsonUtils.removeValueAt(scope.rexContext.json, oldCoordinate);
                        jassa.rdf.TalisRdfJsonUtils.setValueAt(scope.rexContext.json, newCoordinate, value);
                    */


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
                jassa.rdf.TalisRdfJsonUtils.setValueAt(contextCtrl.getOverride(), coordinate, value);

            }, true);

        }

    };
};





/**
 * Create the function for projecting an attribute
 */
var createCompileArray = function() {
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
};





var assembleTalisRdfJson = function(map) {
    //console.log('Assembling talis rdf json');
    var result = {};

    var entries = map.entries();

    entries.forEach(function(entry) {
        var coordinate = entry.key;

        var check = new jassa.rdf.Coordinate(
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


var createCoordinate = function(scope, component) {
    return new jassa.rdf.Coordinate(
        scope.rexSubject,
        scope.rexPredicate,
        scope.rexObject,
        component
    );
};


/**
 * Transform a talis RDF json structure to Map<Coordinate, String>
 *
 */
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

                   var coordinate = new jassa.rdf.Coordinate(s, p, i, c);

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

/**
 * Return an array of coordinate objects
 */
var talisRdfJsonToCoordinates = function(talisRdfJson) {
    var entries = talisRdfJsonToEntries(talisRdfJson);
    var result = [];
    entries.forEach(function(entry) {
        result.push(entry.key);
    });
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
    var result = rexContext.override ? jassa.rdf.TalisRdfJsonUtils.getValueAt(rexContext.override, coordinate) : null;

    if(result == null) {
        result = rexContext.json ? jassa.rdf.TalisRdfJsonUtils.getValueAt(rexContext.json, coordinate) : null;
    }

    return result;
};



/**
 * One way binding of the value of an attribute into scope
 * (possibly via a transformation function)
 *
 */
var syncAttr = function($parse, $scope, attrs, attrName, deep, transformFn) {
    var result;

    if(attrName in attrs) {
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

        result = getEffectiveValue();
        // Also init the value immediately
        $scope[attrName] = result;
    } else {
        result = undefined;
    }

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


var rexIsPredicateNew = function(rexContext, s, p) {
    var basePToOs = rexContext.base[s];
    var jsonPToOs = rexContext.json[s];

    var existedBefore = basePToOs ? p in basePToOs : false;
    var existsNow = jsonPToOs ? p in jsonPToOs : false;

    var result = existsNow && !existedBefore;
    return result;
};





// TODO Create a util for id allocation

// NOTE: We should make a rex module only for the annotations without the widgets, so that the annotations would not depend on ui.select
angular.module('ui.jassa.rex', ['dddi', 'ui.select'])


/**
 * Convert an object into an array of objects
 * with the keys 'key' and 'val'.
 *
 * Implicitly creates stable arrays using angular.equals
 */
.filter('toArray', ['$dddi', function($dddi) {
    return $dddi.utils.wrapArrayFn(function(obj) {
        var r;
        if (obj instanceof Object) {
            r = _.map(obj, function(val, key) {
                return {
                    key: key,
                    val: val
                };
            });
        } else {
            r = obj;
        }

        return r;
    });
}])

/**
 * A filter that creates stable arrays from input arrays.
 *
 */
.filter('stableArray', ['$dddi', function($dddi) {
    return $dddi.utils.wrapArrayFn(function(arr) {
        return arr;
    });
}])

/**
 * ng-repeat = "rexContext.json[rexSubject] | rexSortPredicatesByNovelty"
 */
.filter('rexPredicateNew', function() {
    return function(predicateObjectArray, scope, targetKey) {
        if(!predicateObjectArray) {
            return predicateObjectArray;
        }


        var rexContext = scope.rexContext;

        var rexSubject = scope.rexSubject;
        //var json = scope.json;

        targetKey = targetKey || 'isNew';

        predicateObjectArray.forEach(function(item) {
            var p = item.key;
            var r = rexIsPredicateNew(rexContext, rexSubject, p);
            item[targetKey] = r;
        });

        /*
        var result = _.sortBy(predicateObjectArray, function(entry) {
            var p = entry.key;
            var r = rexIsPredicateNew(rexContext, rexSubject, p);
            return r;
        });
        */

        return predicateObjectArray;
    };
})

;
//var basePriority = 0;
