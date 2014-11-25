
var createCoordinate = function(scope, component) {
    return {
        s: scope.rexSubject,
        p: scope.rexPredicate,
        i: scope.rexObject,
        c: component
    };
};

var syncAttr = function($parse, $scope, attrs, attrName, deep) {
    var attr = attrs[attrName];
    var getterFn = $parse(attr);

    $scope.$watch(function() {
        var r = getterFn($scope);
        return r;
    }, function(newVal, oldVal) {
        //console.log('Syncing: ', attrName, ' to ', newVal, ' in ', $scope);
        $scope[attrName] = newVal;
    }, deep);

    var result = getterFn($scope);
    // Also init the value immediately
    $scope[attrName] = result;

    return result;
};

angular.module('ui.jassa.rex', []) //['ngSanitize', 'ui.bootstrap', 'ui.jassa']


.directive('rexContext', ['$parse', function($parse) {
    return {
        priority: 399,
        restrict: 'A',
        scope: true,
        controller: ['$scope', function($scope) {

            // Attribute where child directives can register changes
            this.rexChangeScopes = $scope.rexChangeScopes = [];
        }],
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    syncAttr($parse, scope, attrs, 'rexContext');


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
                    scope.$watch(function() {
                        var entries = scope.rexChangeScopes.map(function(child) {
                            return child.entry;
                        });

                        entries = entries.filter(function(entry) {
                            return entry != null && entry.val != null;
                        });

                        return entries;
                        //console.log('Test: ', entries);

                    }, function(newEntries) {
                        if(newEntries) {
                            console.log('Overrides: ', newEntries);
                            scope.rexContext.override.clear();
                            scope.rexContext.override.putEntries(newEntries);
                        }
                    }, true);

                }
            };
        }
    };
}])

.directive('rexPrefixes', ['$parse', function($parse) {
    return {
        priority: 398,
        restrict: 'A',
        scope: true,
        // require: '^',
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    syncAttr($parse, scope, attrs, 'rexPrefixes');
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

                    var s = jassa.rdf.NodeFactory.createUri(subjectUri);
                    //console.log('Prefetching: ', s);

                    $q.when(scope.rexContext.prefetch(s)).then(function() {
                        // make sure to apply the scope
                    });
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
        require: '^rexPredicate',
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, predicateCtrl) {
                    var modelExprStr = ele.attr('rex-object-iri');

                    ele.removeAttr('rex-object-iri');

                    // Allocate a new object in the corresponding predicate scope

                    // Allocate a new object in this scope, and pass it to rex-object
                    //scope.objectIriObject = {};

                    //var objectIndex = predicateCtrl.objects.length;
                    //predicateCtrl.objects.push(scope.objectIriObject);

                    ele.attr('rex-object', ''); //'objectIriObject');
                    ele.attr('rex-termtype', 'iri');
                    ele.attr('rex-value', modelExprStr);

                    //console.log('Ele: ', ele);



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
        priority: 7,
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
        require: '^rexObject',
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, objectCtrl) {
                    var obj = syncAttr($parse, scope, attrs, 'rexTermtype');

                    /*
                    objectCtrl.type = obj;

                    scope.$watch('rexTermtype', function(val) {
                        objectCtrl.type = val;
                    });
                    */
                }
            };
        }
    };
}])

.directive('rexDatatype', ['$parse', function($parse) {
    return {
        priority: 7,
        restrict: 'A',
        scope: true,
        controller: function() {},
        link: function(scope, ele, attrs, ctrls) {
            syncAttr($parse, scope, attrs, 'rexDatatype');
        }
    };
}])

.directive('rexLang', ['$parse', function($parse) {
    return {
        priority: 7,
        restrict: 'A',
        scope: true,
        controller: function() {},
        link: function(scope, ele, attrs, ctrls) {
            syncAttr($parse, scope, attrs, 'rexLang');
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
        link: function(scope, ele, attrs, ctrls) {
            syncAttr($parse, scope, attrs, 'rexLang');
        }
    };
}])
*/


.directive('rexValue', ['$parse', function($parse) {
    return {
        priority: 7,
        restrict: 'A',
        scope: true,
        require: ['^rexContext', '^rexObject'],
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    //console.log('Setting up rexValue');

                    var obj = syncAttr($parse, scope, attrs, 'rexValue');

                    var contextCtrl = ctrls[0];
                    var objectCtrl = ctrls[1];


                    contextCtrl.rexChangeScopes.push(scope);
                    scope.$on('$destroy', function() {
                        jassa.util.ArrayUtils.removeItemStrict(scope.rexChangeScopes, scope);
                    });



                    // Forwards: If the model changes, we need to update the change object
                    // in the scope
                    var modelGetter = $parse(attrs['rexValue']);
                    var modelSetter = modelGetter.assign;

                    scope.$watch(function() {
                        var r = modelGetter(scope);
                        return r;
                    }, function(newVal, oldVal) {
                        if(newVal !== oldVal) {
                            var coordinate = createCoordinate(scope, 'value');
                            scope.entry = {
                                key: coordinate,
                                val: newVal
                            };
                        }
                    });


                    // Backwards: If the referenced value changes, we need to update
                    // the model
                    scope.$watch(function() {
                        var coordinate = createCoordinate(scope, 'value');
                        var r = scope.rexContext.getValue(coordinate);
                        return r;
                    }, function(newVal, oldVal) {
                        //if(newVal != oldVal) {
                            modelSetter(scope, newVal);
                        //}
                    });
                }
            };
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
            console.log('<lang>', scope.rexLang);
        }
    };
})


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







