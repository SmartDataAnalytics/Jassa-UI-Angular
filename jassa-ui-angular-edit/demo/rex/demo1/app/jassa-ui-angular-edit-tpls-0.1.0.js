/*
 * jassa-ui-angular-edit
 * https://github.com/GeoKnow/Jassa-UI-Angular

 * Version: 0.1.0 - 2015-01-05
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

//            $scope.onSelectTermType = function(item, model) {
//              $scope.state.type = model.id;
//            };

//            $scope.onSelectDatatype = function(item, model) {
//              $scope.state.datatype = model.id;
//            };
//
//            $scope.onSelectLanguage = function(item, model) {
//              $scope.state.lang = model.id;
//            };

        }],
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ngModel) {



                    var getValidState = function() {
                        var result;

                        var state = scope.state;
                        // {"type":{"id":"http://typedLiteral","displayLabel":"typed"},"value":"297.6","datatype":"http://dbpedia.org/datatype/squareKilometre"}
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
                        default:
                            result = {
                                type: 'uri',
                                value: state.value
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

                      if (!talisJson) {
                      } else {
                          var newState = convertToState(talisJson);

  //                            var newState;
  //                            try {
  //                                newState = convertToState(talisJson);
  //                            } catch(err) {
  //                                newState = {};
  //                            }

                          scope.state = newState;

                          // init value of ui-select-box termtype
                          for (var i in scope.termTypes) {
                            if (scope.termTypes[i].id === scope.state.type) {
                              scope.termTypes.selected = scope.termTypes[i];
                              break;
                            }
                          }

                          // init value of ui-select-box datatype
                          var matchedDatatype = false;
                          for (var j in scope.datatypes) {
                            if (scope.datatypes[j].id === scope.state.datatype) {
                              scope.datatypes.selected = scope.datatypes[j];
                              matchedDatatype = true;
                              break;
                            }
                          }

                          // if the datatype is not in hashmap add them
                          if (!matchedDatatype) {
                            //TODO: short uri for displayLabel
                            var prefixMapping = new jassa.rdf.PrefixMappingImpl();
                            // create new datatype set
                            var newDatatype = {
                              id: scope.state.datatype,
                              displayLabel:  prefixMapping.shortForm(scope.state.datatype)
                            };
                            // add new datatype to datatypes
                            scope.datatypes.push(newDatatype);
                            // set datatype as selected
                            scope.datatypes.selected = newDatatype;
                          }

                          // init value of ui-select-box languages
                          var matchedLang = false;
                          for (var k in scope.langs) {
                            if (scope.langs[k].id === scope.state.lang) {
                              scope.langs.selected = scope.langs[k];
                              matchedLang = true;
                              break;
                            }
                          }

                          // if the datatype is not in hashmap add them
                          if (!matchedLang) {
                            // create new datatype set
                            var newLang = {
                              id: scope.state.lang,
                              displayLabel: scope.state.lang
                            };
                            // add new datatype to datatypes
                            scope.langs.push(newLang);
                            // set datatype as selected
                            scope.langs.selected = newLang;
                          }

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




/**
 * Falsy valued arguments will be replaced with empty strings or 0
 */
var Coordinate = jassa.ext.Class.create({
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


var __defaultPrefixMapping = new jassa.rdf.PrefixMappingImpl(jassa.vocab.InitialContext);

var createCoordinate = function(scope, component) {
    var pm = scope.rexPrefixMapping || __defaultPrefixMapping;

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

angular.module('ui.jassa.rex')

/**
 * Directive to attach a rex lookup function to the scope
 *
 * Different lookup functions can be used at different HTML regions under a rex-context.
 *
 * If present, rex-subject will use the provided function to perform data lookups
 * on its IRIs and store the content in the scope
 *
 */
.directive('rexBaseGraph', ['$parse', function($parse) {
    return {
        priority: basePriority + 28,
        restrict: 'A',
        scope: true,
        require: 'rexContext',
        controller: function() {},
        //require: ['^?rexSubject', '^?rexObject']
//        controller: ['$scope', function($scope) {
//        }],
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    syncAttr($parse, scope, attrs, 'rexBaseGraph');

                    // Watch the reference
                    scope.$watch(function() {
                        return scope.rexBaseGraph;
                    }, function() {
                        scope.rexContext.baseGraph = scope.rexBaseGraph;
                    });
                }
            };
        }
    };
}])

;

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
            this.getOverride =    function() {
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

                var result = new jassa.util.HashSet();

                slotIds.forEach(function(slotId) {
                    var slot = slots[slotId];
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

                    var updateDerivedValues = function(dataMap, prefixMapping) {
//console.log('Start update derived');
                        var talis = assembleTalisRdfJson(dataMap);
                        processPrefixes(talis, prefixMapping);

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
 * Directive to mark triples as deleted
 *
 */
.directive('rexDeleted', ['$parse', function($parse) {
    return {
        priority: 379,
        restrict: 'A',
        scope: true,
        require: ['^rexContext', '^rexObject'],
        controller: function() {},
        compile: function(ele, attrs) {
            return createCompileComponent('rexDeleted', 'deleted', $parse);
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
                }
            };
        }
    };
}])

;

angular.module('ui.jassa.rex')

/**
 * Directive to attach a rex lookup function to the scope
 *
 * Different lookup functions can be used at different HTML regions under a rex-context.
 *
 * If present, rex-subject will use the provided function to perform data lookups
 * on its IRIs and store the content in the scope
 *
 */
.directive('rexLookup', ['$parse', function($parse) {
    return {
        priority: basePriority + 26,
        restrict: 'A',
        scope: true,
        require: '^rexContext',
        controller: function() {},
        //require: ['^?rexSubject', '^?rexObject']
//        controller: ['$scope', function($scope) {
//        }],
        compile: function(ele, attrs){
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    syncAttr($parse, scope, attrs, 'rexLookup');
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
        require: ['^rexContext', '^rexPredicate'],
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
                pre: function(scope, ele, attrs, ctrls) {
                    var predicateCtrl = ctrls[1];
                    var contextCtrl = ctrls[0];

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



                    // If rexObject is present, we also create a rexRef attribute
                    var rexRef = function() {
                        var result = {
                            s: scope.rexSubject,
                            p: scope.rexPredicate,
                            i: scope.rexObject
                        };

                        return result;
                    };

                    scope.$watch(function() {
                        var r = rexRef();
                        return r;
                    }, function(newRef) {
                        scope.rexRef = newRef;
                    }, true);

                    scope.rexRef = rexRef();


                    // Below stuff is deprecated
                    // Make the prefixes part of the Talis RDF json object
                    //var cc = createCompileComponent('rexPrefixMapping', 'prefixMapping', $parse, true);
                    //cc.pre(scope, ele, attrs, ctrls);
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
 *
 * prefixes must be declared together with the context and cannot be nested
 *
 */
.directive('rexPrefix', ['$parse', function($parse) {
    return {
        priority: basePriority + 19,
        restrict: 'A',
        scope: true,
        //require: '^rexContext',
        require: 'rexContext',
        controller: ['$scope', function($scope) {
            $scope.rexPrefix = $scope.rexPrefix || {};
        }],
        compile: function(ele, attrs) {

            setEleAttrDefaultValue(ele, attrs, 'rex-prefix', 'rexPrefix');

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

                        scope.rexContext.prefixMapping = scope.rexPrefixMapping;
                    };

                    // Update the prefixMapping when the prefixes change
                    scope.$watchGroup([function() {
                        return scope.rexPrefix;
                    }, function() {
                        return scope.rexContext;
                    }],
                    function(rexPrefix) {
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
        priority: basePriority + 24,
        restrict: 'A',
        scope: true,
        require: '^rexContext',
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, contextCtrl) {

                    var subjectUri = syncAttr($parse, scope, attrs, 'rexSubject');

                    var doPrefetch = function() {
                        //console.log('doPrefetch');

                        var lookupFn = scope.rexLookup;
                        var subjectUri = scope.rexSubject;

                        if(lookupFn && angular.isFunction(lookupFn) && subjectUri) {

                            var pm = scope.rexPrefixMapping;
                            var uri = pm ? pm.expandPrefix(subjectUri) : subjectUri;

                            var s = jassa.rdf.NodeFactory.createUri(uri);

                            var promise = scope.rexLookup(s);
                            $q.when(promise).then(function(graph) {
                                var contextScope = contextCtrl.$scope.rexContext;
                                var baseGraph = contextScope.baseGraph = contextScope.baseGraph || new jassa.rdf.GraphImpl();

                                contextScope.baseGraph.addAll(graph);
                                // TODO Add the data to the context
                            });
                        }

//                        $q.when(scope.rexContext.prefetch(s)).then(function() {
//                            // make sure to apply the scope
//                        });
                    };

                    scope.$watchGroup([
                        function() {
                            return scope.rexLookup;
                        }, function() {
                            return scope.rexSubject;
                        }, function() {
                            return scope.rexPrefixMapping;
                        }
                    ], function() {
                        doPrefetch();
                    });

//                    scope.$watch(function() {
//                        return scope.rexSubject;
//                    }, function(newVal) {
//                        doPrefetch();
//                    });
//
//                    scope.$watch(function() {
//                        return scope.rexPrefixMapping;
//                    }, function(pm) {
//                        doPrefetch();
//                    });
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

/**
 * Convenience directive
 *
 * sync-template="templateStr"
 *
 * implies sync-source="templateStr" sync-interpolate sync-to-target? sync-target?
 *
 * if sync-target is not specified, it will try to detect a target based on model attribute names (e.g. ngModel)
 */
.directive('syncTemplate', ['$parse', '$compile', function($parse, $compile) {
    return {
        priority: basePriority + 1000,
        restrict: 'A',
        scope: true,
        terminal: true,
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    var templateStr = ele.attr('sync-template');

                    ele.removeAttr('sync-template');

                    ele.attr('sync-source', templateStr);
                    ele.attr('sync-source-interpolate', '');

                    if(ele.attr('sync-target') == null) {
                        var name = getModelAttribute(attrs);
                        var modelExprStr = attrs[name];

                        if(!modelExprStr) {
                            throw new Error('No model provided and found');
                        }

                        ele.attr('sync-target', modelExprStr);
                    }

                    // TODO Create a function to set attr default values
                    if(ele.attr('sync-to-target') == null) {
                        ele.attr('sync-to-target', '');
                    }

                    // Continue processing any further directives
                    $compile(ele)(scope);
                }
            };
        }
    };
}])

;

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
    "<!--     <div class=\"input-group-addon\"> -->\n" +
    "<!--         <select ng-model=\"state.type\"  ng-options=\"item.id as item.displayLabel for item in termTypes\" ng-change=\"ensureValidity()\"></select> -->\n" +
    "<!--     </div> -->\n" +
    "\n" +
    "    <!-- Term type selector -->\n" +
    "    <div class=\"input-group-addon\">\n" +
    "        <ui-select ng-model=\"state.type\" ng-model-options=\"ngModelOptions\" ng-disabled=\"disabled\" theme=\"selectize\"  reset-search-input=\"false\" style=\"width: 100px;\" >\n" +
    "          <ui-select-match placeholder=\"Termtype\">{{$select.selected.displayLabel}}</ui-select-match>\n" +
    "          <ui-select-choices repeat=\"item.id as item in termTypes | filter: $select.search\">\n" +
    "            <span ng-bind-html=\"item.displayLabel | highlight: $select.search\"></span>\n" +
    "          </ui-select-choices>\n" +
    "        </ui-select>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Datatype selector -->\n" +
    "<!--     <span ng-show=\"state.type===vocab.typedLiteral\" class=\"input-group-addon\"> -->\n" +
    "<!--         <select ng-model=\"state.datatype\" ng-model-options=\"ngModelOptions\" ng-options=\"item.id as item.displayLabel for item in datatypes\"></select> -->\n" +
    "<!--     </span> -->\n" +
    "\n" +
    "    <div ng-show=\"state.type===vocab.typedLiteral\" class=\"input-group-addon\" style=\"border-left: 0px;\">\n" +
    "      <ui-select ng-model=\"state.datatype\" ng-model-options=\"ngModelOptions\" ng-disabled=\"disabled\" theme=\"selectize\"  reset-search-input=\"false\" style=\"width: 100px;\" >\n" +
    "        <ui-select-match placeholder=\"Datatype\">{{$select.selected.displayLabel}}</ui-select-match>\n" +
    "        <ui-select-choices repeat=\"item.id as item in datatypes | filter: $select.search\">\n" +
    "          <span ng-bind-html=\"item.displayLabel | highlight: $select.search\"></span>\n" +
    "        </ui-select-choices>\n" +
    "      </ui-select>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <!-- Language selector -->\n" +
    "<!--     <span ng-show=\"state.type===vocab.plainLiteral\" class=\"input-group-addon\"> -->\n" +
    "<!--         <select ng-model=\"state.lang\" ng-model-options=\"ngModelOptions\" ng-options=\"item.id as item.displayLabel for item in langs\"></select> -->\n" +
    "<!--     </span> -->\n" +
    "\n" +
    "    <div ng-show=\"state.type===vocab.plainLiteral\" class=\"input-group-addon\" style=\"border-left: 0px;\">\n" +
    "      <ui-select ng-model=\"state.lang\" ng-model-options=\"ngModelOptions\" ng-disabled=\"disabled\" theme=\"selectize\"  reset-search-input=\"false\" style=\"width: 100px;\" >\n" +
    "        <ui-select-match placeholder=\"Language\">{{$select.selected.displayLabel}}</ui-select-match>\n" +
    "        <ui-select-choices repeat=\"item.id as item in langs | filter: $select.search\">\n" +
    "          <span ng-bind-html=\"item.displayLabel | highlight: $select.search\"></span>\n" +
    "        </ui-select-choices>\n" +
    "      </ui-select>\n" +
    "    </div>\n" +
    "\n" +
    "    <!--div class=\"input-group-addon\">\n" +
    "\n" +
    "    </div-->\n" +
    "    <input type=\"text\" class=\"form-control margin-left-1\" style=\"height:52px; margin-left: -1px !important;\" ng-model=\"state.value\" ng-model-options=\"ngModelOptions\">\n" +
    "</div>\n" +
    "\n" +
    "");
}]);
