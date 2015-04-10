angular.module('ui.jassa.rex')

/**
 * @ngdoc directive
 * @name ui.jassa.rex.directive:rex-object
 * @element div
 * @restrict A
 * @function
 *
 * @description
 * rexObject takes an index to reference an object in a (conceptual) array under a given subject and predicate
 *
 * Hm, no, I still think we can do better: There are different ways to refer to a specific object:
 *
 * - by index (the 3nd item under leipzig -> rdfs:label (possibly of a certain datatype and lang)
 * - by value (i am referring to the triple having leipzig -> population -> 500000)
 *   yet, we could generalize a value reference  to an index reference:
 *      the first object satisfying "leipzig -> population -> {value: 500000 }"
 *
 * So long story short: this directive references an item in regard to a set of filters.
 *
 * <strong>TODO Update below</strong>
 *
 * Note that this directive only creates a context for setting components
 * (term type, value, datatype and language tag) of an object -
 * it does not create an rdf.Node object directly.
 *
 * <pre>rex-object="{}" // someObject</pre>
 *
 * The argument is optional.
 *
 * If one is provided, it is as a reference to an object being built, otherwise
 * a new object is allocated.
 *
 * The provided object is registered at the object for the
 * corresponding predicate and subject in the context where it is used.
 *
 * Note that this means that in principle several triples being built could reference
 * the state of the same object (even if they are built using different rex-contexts).
 */
.directive('rexObject', ['$parse', function($parse) {
    return {
        priority: 13,
        restrict: 'A',
        scope: true,
        require: ['^rexContext', '^rexPredicate'],
        controller: angular.noop,
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
