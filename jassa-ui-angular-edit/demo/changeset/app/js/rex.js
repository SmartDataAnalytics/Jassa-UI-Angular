
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
}


var parsePrefixes = function(prefixMapping) {
    var result = prefixMapping
        ? prefixMapping instanceof PrefixMappingImpl
            ? prefixMapping
            : new PrefixMappingImpl(prefixMapping)
        : new PrefixMappingImpl();

    return result;
};


// Updates a target model based on transformation whenever the source changes
var syncHelper = function(scope, attrs, $parse, $interpolate, sourceAttr, targetAttr, fnAttr, conditionAttr, iterpolateSource) {

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
    }

    // If the condition changes to 'true', resync the models
    scope.$watch(function() {
        var r = checkCondition();
        return r;
    }, function(isConditionSatisfied) {
        if(isConditionSatisfied) {
            doSync();
        }
    });

    scope.$watch(function() {
        var r = fnGetter(scope);
        return r;
    }, function(newFn) {
        if(newFn) {
            doSync();
        }
    });

    scope.$watch(function() {
        var r = sourceGetter(scope);
        return r;
    }, function(sourceValue) {
        doSync();
    }, true);

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

            scope.$on('$destroy', function() {
                slot.release();
            });

            // Backwards: If the referenced value changes, we need to update
            // the model

            // If the coordinate changes, we need to set the current model at that coordinate
            // Afterwards, if the value at the coordinate changes (though the coordinate is the same then),
            // we update the model

            scope.$watch(function() {
                var coordinate = createCoordinate(scope, $component$);
                return coordinate;
            }, function(newCoordinate, oldCoordinate) {
                var r = modelGetter(scope);

                var isUndefined = angular.isUndefined(r);
                var msg = isUndefined ? ' however skipping model update due to undefined ' : ' updating coordinate-target with value ';

                //console.log(tag + ' Coordinate changed to ', newCoordinate, ' from ', oldCoordinate, msg + '; ', r);

                if(!isUndefined) {

                    slot.entry = {
                        key: newCoordinate,
                        val: r
                    };

                    contextCtrl.getOverride().putEntries([slot.entry]);
                }

                // TODO: We need to update the override with the new value before we enter the following $watch below.
            }, true);

            // Forwards: If the model changes, we need to update the
            // change object in the scope
            scope.$watch(function() {
                var r = modelGetter(scope);

                return r;
            }, function(newVal, oldVal) {
                var coordinate = createCoordinate(scope, $component$);
                slot.entry = {
                    key: coordinate,
                    val: newVal
                };

                //console.log(tag + ' Model changed to ', newVal, ' from ', oldVal, '; updating override ', slot.entry);
            }, true);



             // If the given model is writeable, then we need to update it
             // whenever the coordinate's value changes
            if(modelSetter) {

                scope.$watch(function() {
                    var coordinate = createCoordinate(scope, $component$);
                    var r = scope.rexContext.getValue(coordinate);
                    return r;
                }, function(newVal, oldVal) {
                    var coordinate = createCoordinate(scope, $component$);
                    //console.log(tag + ' Coordinate-target value changed to ', newVal, ' from ', oldVal, ' for ', coordinate, ' with scope ', scope, '; updating model');
                    if(newVal) {
                        modelSetter(scope, newVal);
                    }
                }, true);

            }

        }
    };
};

// TODO I think we can remove that function
var firstIfEqual = function(oldVal, newVal) {
    var isEqual = angular.equals(oldVal, newVal);
    var result = isEqual ? oldVal : newVal;
    return result;
}

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

        var s = jassa.rdf.NodeUtils.createUri(sStr);

        var po = data[sStr];
        var ps = Object.keys(po);
        ps.sort();

        ps.forEach(function(pStr) {
            var p = jassa.rdf.NodeUtils.createUri(pStr);

            var os = po[p];

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
            })
        })
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
            })

            result += oStrs.join(', ') + ' ; \n';
        })
        result += '    . \n';
    });

    return result;
};


var createCoordinate = function(scope, component) {
    return {
        s: scope.rexSubject,
        p: scope.rexPredicate,
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

    $scope.$watch(function() {
        var r = getterFn($scope);
        return r;
    }, function(newVal, oldVal) {
        //console.log('Syncing: ', attrName, ' to ', newVal, ' in ', $scope);

        if(transformFn) {
            newVal = transformFn(newVal);
        }

        $scope[attrName] = newVal;
    }, deep);

    var result = getterFn($scope);
    // Also init the value immediately
    $scope[attrName] = result;

    return result;
};


// TODO Create a util for id allocation


angular.module('ui.jassa.rex', []) //['ngSanitize', 'ui.bootstrap', 'ui.jassa']

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
        scope: true,
//        scope: {
//            ngModel: '=',
//            logo: '@?',
//            langs: '=?', // suggestions of available languages
//            datatypes: '=?' // suggestions of available datatypes
//        },
        controller: ['$scope', function($scope) {

            $scope.state = $scope.$state || {};



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
                                lang: state.lang
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
                        var clone = createTalisJsonObjectWithDefaults(talisJson);

                        var node;
                        try {
                            node = jassa.rdf.NodeFactory.createFromTalisRdfJson(clone);
                        } catch(err) {
                            console.log(err);
                        }


                        var result;
                        if(node.isUri()) {
                            result = {
                                type: vocab.iri,
                                value: node.getUri()
                            };
                        } else if(node.isLiteral()) {
                            var dt = node.getLiteralDatatypeUri();
                            var hasDatatype = !jassa.util.ObjectUtils.isEmptyString(dt)

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
            };
        }
    };
}])


.directive('rexContext', ['$parse', function($parse) {
    return {
        priority: 399,
        restrict: 'A',
        scope: true,
        controller: ['$scope', function($scope) {

            //this.rexContext = $scope.rexContext;
            this.getOverride = function() {
                return $scope.rexContext.override;
            }


            // Attribute where child directives can register changes
            //this.rexChangeScopes = $scope.rexChangeScopes = [];

            // Arrays where child directives can register slots where
            // they publish their change
            this.nextSlot = 0;
            this.rexChangeSlots = $scope.rexChangeSlots = {};

            this.allocSlot = function() {
                var tmp = this.nextSlot++;
                var id = '' + tmp;

                var self = this;

                //console.log('[SLOT]: Allocated ' + id);

                var result = this.rexChangeSlots[id] = {
                    id: id,
                    release: function() {
                        //console.log('[SLOT]: Released ' + id);
                        delete self.rexChangeSlots[id];

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
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    syncAttr($parse, scope, attrs, 'rexContext');

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
                            scope.rexContext.talisJson = turtle;

                            //console.log('Talis: ', talis);
                        }
                    }, true);


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

.directive('rexPrefix', ['$parse', function($parse) {
    return {
        priority: 398,
        restrict: 'A',
        scope: true,
        // require: '^',
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    syncAttr($parse, scope, attrs, 'rexPrefix');
                }
            };
        }
    };
}])

.directive('rexSubject', ['$parse', '$q', function($parse, $q) {
    return {
        priority: 397,
        restrict: 'A',
        scope: true,
        require: '^rexContext',
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, contextCtrl) {
                    var subjectUri = syncAttr($parse, scope, attrs, 'rexSubject');

                    var doPrefetch = function(subjectUri) {
                        var s = jassa.rdf.NodeFactory.createUri(subjectUri);
                        $q.when(scope.rexContext.prefetch(s)).then(function() {
                            // make sure to apply the scope
                        });
                    };

                    scope.$watch('rexSubject', function(newVal) {
                        doPrefetch(newVal);
                    });

                    //console.log('Prefetching: ', s);
                }
            };
        }
    };
}])

.directive('rexPredicate', ['$parse', function($parse) {
    return {
        priority: 396,
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
            }
        }
    };
}])


/**
 * Convenience directive
 *
 * implies rex-prediacte="rdf:type" rex-object-iri
 *
 * !! Important: because rex-predicate is implied, this directive cannot be used on a directive
 * that already hase rex-predicate defined !!
 */
.directive('rexTypeof', ['$parse', '$compile', function($parse, $compile) {
    return {
        priority: 396,
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
                    ele.attr('rex-object-iri', modelExprStr);

                    // Continue processing any further directives
                    $compile(ele)(scope);
                },
                post: function(scope, ele, attrs, ctrls) {
                }
            };
        }
    };
}])


/**
 * Convenience directive
 *
 * rexObjectIri="model"
 *
 * implies rex-object rex-object-termtype="iri" rex-object-value="model"
 */
.directive('rexObjectIri', ['$parse', '$compile', function($parse, $compile) {
    return {
        priority: 395,
        restrict: 'A',
        scope: true,
        terminal: true,
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    var modelExprStr = ele.attr('rex-object-iri');

                    ele.removeAttr('rex-object-iri');

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

.directive('rexObjectLiteral', ['$parse', '$compile', function($parse, $compile) {
    return {
        priority: 395,
        restrict: 'A',
        scope: true,
        terminal: true,
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    var modelExprStr = ele.attr('rex-object-literal');

                    if(jassa.util.ObjectUtils.isEmptyString(modelExprStr)) {
                        var name = getModelAttribute(attrs);
                        modelExprStr = attrs[name];
                    }

                    if(!modelExprStr) {
                        throw new Error('No model provided and found');
                    }

                    ele.removeAttr('rex-object-literal');

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
        priority: 380,
        restrict: 'A',
        scope: true,
        require: '^rexPredicate',
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, predicateCtrl) {
                    var i = predicateCtrl.rexObjectScopes.length;
                    if(!attrs['rexObject']) {
                        attrs['rexObject'] = '' + i;
                    }
//console.log('rexObject index: ' + i);
                    predicateCtrl.rexObjectScopes.push(scope);

                    syncAttr($parse, scope, attrs, 'rexObject');

                    scope.$on('$destroy', function() {
                        jassa.util.ArrayUtils.removeItemStrict(predicateCtrl.rexObjectScopes, scope);
                    });

                }
            };
        }
    };
}])



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

// sync-to-target="toString"
.directive('syncToTarget', ['$parse', '$interpolate', function($parse, $interpolate) {
    return {
        priority: 390,
        restrict: 'A',
        scope: true,
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {

                    var interpolateSource = 'syncSourceInterpolate' in attrs;

                    syncHelper(scope, attrs, $parse, $interpolate, 'syncSource', 'syncTarget', 'syncToTarget', 'syncToTargetCond', interpolateSource);
                }
            }
        }
    };
}])

.directive('syncToSource', ['$parse', '$interpolate', function($parse, $interpolate) {
    return {
        priority: 390,
        restrict: 'A',
        scope: true,
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    syncHelper(scope, attrs, $parse, $interpolate, 'syncTarget', 'syncSource', 'syncToSource', 'syncToSourceCond', false);
                }
            }
        }
    };
}])




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







