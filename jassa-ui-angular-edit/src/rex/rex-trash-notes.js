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







