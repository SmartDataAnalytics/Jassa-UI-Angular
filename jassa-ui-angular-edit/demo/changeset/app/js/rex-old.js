var syncAttr = function($parse, $scope, attrs, attrName) {
    var expr = $parse(attrs[attrName]);

    $scope.$watch(function() {
        return expr();
    }, function(newVal, oldVal) {
        $scope[attrName] = newVal;
    });
};

angular.module('ui.jassa.rex', []) //['ngSanitize', 'ui.bootstrap', 'ui.jassa']

/*
.directive('resourceRef', function() {
    return {
        priority: 10,
        restrict: 'A',
        scope: {
            resource: '=?'
        },
        controller: ['$scope', function($scope) {
            this.getResource = function() {
                return $scope.resource;
            };
        }],
        link: function(scope, ele, attrs, ctrls) {
            console.log('<resource>', scope.resource);
        }
    };
})
*/


// Awesomeness: http://stackoverflow.com/questions/23803871/how-to-get-two-way-data-binding-in-a-directive-without-an-isolate-scope
.directive('rexTest', function() {
    return {
        priority: 11,
        restrict: 'A',
        scope: true,
        controller: ['$scope', function($scope) {
        }],
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    scope.rexTest = 'sigh';
                    scope.$watch(function() {
                        scope.$parent.$eval(attrs.rexTest);
                    }, function(val) {
                        scope.test = val
                    });
                },
                post: function(scope, ele, attrs, ctrls) {
                }
            };
        }
    };
})



.directive('rexContext', function() {
    return {
        priority: 11,
        restrict: 'A',
        scope: true,
        controller: ['$scope', function($scope) {
            //var rexContext = $scope.rexContext = $scope.rexContext || {};

            this.getValue = function() {
                return $scope.rexContext;
            };

            this.addResource = function(scope) {
                console.log('Added resource to context ', this.getValue(), scope);
                $scope.rexContext.resources.push(scope);
            };

            this.removeResource = function(scope) {
                jassa.util.ArrayUtils.removeItemStrict($scope.rexContext.resources, scope);
            };

        }],
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    scope.rexContext = scope.$parent.$eval(attrs.rexContext);
                    scope.rexContext.resources = scope.rexContext.resources || [];
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
                    console.log('<context>', scope.rexContext);
                }
            };
        }
    };
})

.directive('rexResource', function() {
    return {
        priority: 10,
        restrict: 'A',
        scope: true,
        require: '^rexContext',
        controller: ['$scope', function($scope) {
            this.getValue = function() {
                return $scope.rexResource;
            };

            this.addProperty = function(scope) {
                console.log('Added property to resource ', this.getValue(), scope);
                $scope.properties.push(scope);
            };

            this.removeProperty = function(scope) {
                jassa.util.ArrayUtils.removeItemStrict($scope.properties, scope);
            }

        }],
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, contextCtrl) {
                    scope.$watch(function() {
                        return scope.$parent.$eval(attrs.rexResource);
                    }, function(val) {
                        scope.rexResource = val;
                    });


                    //scope.rexResource = scope.$parent.$eval(attrs.rexResource);
                    scope.properties = scope.properties || [];

                    contextCtrl.addResource(scope);

                    console.log('<resource>', scope.rexResource);
                },
                post: function(scope, ele, attrs, contextCtrl) {
                    scope.$on('$destroy', function() {
                        contextCtrl.removeResource(scope);
                    });
                }
            };
        }
    };
})



.directive('rexTypeof', function() {
    return {
        priority: 9,
        restrict: 'A',
        scope: {
            rexTypeof: '='
        },
        controller: ['$scope', function($scope) {
            this.getValue = function() {
                return $scope.rexTypeof;
            };
        }],
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    scope.rexTypeof = scope.$parent.$eval(attrs.rexTypeof);

                    console.log('<typeof>', scope.rexTypeof);
                },
                post: function(scope, ele, attrs, ctrls) {
                }
            };
        },
    };
})

.directive('rexProperty', function() {
    return {
        priority: 8,
        restrict: 'A',
        scope: true,
        require: '^rexResource',
        controller: ['$scope', function($scope) {
            this.values = [];

            this.getValue = function() {
                return $scope.rexProperty;
            };
        }],
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, resourceCtrl) {
                    scope.$watch(function() {
                        return scope.$parent.$eval(attrs.rexProperty);
                    }, function(val) {
                        scope.rexProperty = val;
                    });

                    resourceCtrl.addProperty(scope);
                    console.log('<property>', scope.rexProperty);
                },
                post: function(scope, ele, attrs, resourceCtrl) {

                }
            };
        }
    };
})

.directive('rexDatatype', function() {
    return {
        priority: 7,
        restrict: 'A',
        scope: true,
        controller: ['$scope', function($scope) {
            this.getValue = function() {
                return $scope.rexDatatype;
            };
        }],
        link: function(scope, ele, attrs, ctrls) {
            scope.rexDatatype = scope.$parent.$eval(attrs.rexDatatype);
            console.log('<datatype>', scope.rexDatatype);
        }
    };
})

.directive('rexLang', function() {
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

.directive('rexValue', function() {
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

.directive('rexObject', function() {
    return {
        priority: 6,
        restrict: 'A',
        scope: true,
        controller: ['$scope', function($scope) {
            $scope.$watch('[ rexResource, rexProperty, rexDatatype, rexLang ]', function(val) {
                console.log('STATUS: ', val)
            }, true);
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







