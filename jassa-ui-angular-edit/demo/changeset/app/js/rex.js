var syncAttr = function($parse, $scope, attrs, attrName, deep) {
    var attr = attrs[attrName];
    var getterFn = $parse(attr);

    $scope.$watch(function() {
        var r = getterFn($scope);
        return r;
    }, function(newVal, oldVal) {
        $scope[attrName] = newVal;
    }, deep);
};

angular.module('ui.jassa.rex', []) //['ngSanitize', 'ui.bootstrap', 'ui.jassa']

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

.directive('rexResource', ['$parse', function($parse) {
    return {
        priority: 10,
        restrict: 'A',
        scope: true,
        // require: '^',
        controller: function() {},
        link: function(scope, ele, attrs, ctrls) {
            syncAttr($parse, scope, attrs, 'rexResource');
        }
    };
}])

.directive('rexProperty', ['$parse', function($parse) {
    return {
        priority: 8,
        restrict: 'A',
        scope: true,
        require: '^rexResource',
        controller: function() {},
        link: function(scope, ele, attrs, ctrls) {
            syncAttr($parse, scope, attrs, 'rexProperty');
        }
    };
}])

.directive('rexTermtype', ['$parse', function() {
    return {
        priority: 7,
        restrict: 'A',
        scope: true,
        controller: function() {},
        link: function(scope, ele, attrs, ctrls) {
            syncAttr($parse, scope, attrs, 'rexTermtype');
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

.directive('rexValue', ['$parse', function($parse) {
    return {
        priority: 7,
        restrict: 'A',
        scope: true,
        controller: function() {},
        link: function(scope, ele, attrs, ctrls) {
            syncAttr($parse, scope, attrs, 'rexValue');
        }
    };
}])

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







