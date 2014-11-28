
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
