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
