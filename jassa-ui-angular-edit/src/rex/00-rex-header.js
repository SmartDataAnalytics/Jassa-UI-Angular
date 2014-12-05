

var RexContext = jassa.ext.Class.create({
    initialize: function(lookupService) {
        this.lookupService = lookupService;

        this.sourceGraph = new jassa.rdf.GraphImpl();

        // the status of the resources as retrieved from the lookup service
        this.cache = new jassa.util.HashMap();

        this.override = new jassa.util.HashMap();

        this.json = {};
        //this.combined = new MapUnion([this.override, this.cache]);
        // values
        // this.overrides = {};

    },

    prefetch: function(subject) {
        if(this.cache.containsKey(subject)) {
            // TODO Do something
        }

        // TODO Set a loading flag on the resource

        var self = this;
        var result = this.lookupService.lookup([subject]).then(function(map) {
            console.log('Successfully prefetched: ', map);
            var entries = map.entries();
            entries.forEach(function(entry) {
                var dataMap = entry.val.data;
                self.cache.putMap(dataMap);

                var tmp = assembleTalisRdfJson(dataMap);
                _(self.json).extend(tmp);

            });
        });

        return result;
    },

    combinedMap: function() {
        var subMaps = [this.override, this.cache].filter(function(item) {
            return item != null;
        });

        var result = new jassa.util.MapUnion(subMaps);

        return result;
    },

    getValue: function(coordinate) {
        //var subject = rdf.NodeFactory.createUri(coordinate.s);

        //var c = this.cache.get(subject);
        //var o = this.override.get(subject);

        //console.log('Cache: ', this.cache);

        var map = this.combinedMap();

        var result = map.get(coordinate);

        //console.log('Retrieved value: ', result, ' for coordinate ', coordinate);

        return result;
    },

    asTalisJsonRdf: function() {
        var map = this.combinedMap();

        var result = assembleTalisRdfJson(map);
        return result;
    }
});




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
            slot.entry = {};

            scope.$on('$destroy', function() {
                slot.release();
            });

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

                    contextCtrl.getOverride().putEntries([entry]);
                }
            }, true);


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
                    contextCtrl.getOverride().putEntries([entry]);
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
                    contextCtrl.getOverride().putEntries([entry]);
                }

                //console.log(tag + ' Model changed to ', newVal, ' from ', oldVal, ' at coordinate ', coordinate, '; updating override ', slot.entry);
            }, true);

        }
    };
};

var assembleTalisRdfJson = function(map) {
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
var __defaultPrefixMapping = new jassa.rdf.PrefixMappingImpl(jassa.vocab.InitialContext);

var createCoordinate = function(scope, component) {
    var pm = scope.rexPrefixMapping || __defaultPrefixMapping;

    return {
        s: pm.expandPrefix(scope.rexSubject),
        p: pm.expandPrefix(scope.rexPredicate),
        i: scope.rexObject,
        c: component
    };
};


var getValueAt = function(talisRdfJson, coordinate) {
    var s = talisRdfJson[coordinate.s];
    var p = s ? s[coordinate.p] : null;
    var i = p ? p[coordinate.i] : null;
    var result = i ? i[coordinate.c] : null;

    return result;
};

var getEffectiveValue = function(rexContext, coordinate) {
    var result = rexContext.override ? rexContext.override.get(coordinate) : null;

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








// TODO Create a util for id allocation

angular.module('ui.jassa.rex', []);

var basePriority = 0;
