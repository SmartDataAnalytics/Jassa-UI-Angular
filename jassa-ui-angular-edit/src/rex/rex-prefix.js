angular.module('ui.jassa.rex')

/**
 * Prefixes
 *
 * prefixes must be declared together with the context and cannot be nested
 *
 */
.directive('rexPrefix', ['$parse', function($parse) {
    return {
        priority: 19,
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
