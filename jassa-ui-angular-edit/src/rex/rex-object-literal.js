angular.module('ui.jassa.rex')

.directive('rexObjectLiteral', ['$parse', '$compile', function($parse, $compile) {
    return {
        priority: basePriority + 1000,
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

                    // TODO: Do not overwrite rex-object if already present

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

;
