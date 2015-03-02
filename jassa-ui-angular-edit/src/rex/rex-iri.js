angular.module('ui.jassa.rex')

/**
 * Convenience directive
 *
 * rexObjectIri="model"
 *
 * implies rex-object rex-termtype="iri" rex-value="model"
 */
.directive('rexIri', ['$parse', '$compile', function($parse, $compile) {
    return {
        priority: basePriority + 900, //+ 1000,
        restrict: 'A',
        scope: true,
        terminal: true,
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    var modelExprStr = ele.attr('rex-iri');

                    if(jassa.util.ObjectUtils.isEmptyString(modelExprStr)) {
                        var name = getModelAttribute(attrs);
                        modelExprStr = attrs[name];
                    }

                    if(!modelExprStr) {
                        throw new Error('No model provided and found');
                    }


                    ele.removeAttr('rex-iri');

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

;
