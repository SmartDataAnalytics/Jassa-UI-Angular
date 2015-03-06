angular.module('ui.jassa.rex')

/**
 * TODO: Actually we should just implement this as a convenience directive which replaces itself with
 * rex-termtype rex-value rex-lang and rex-datatype
 * This way we wouldn't have to make the book keeping more complex than it already is
 *
 * rexTerm synchronizes a model which is interpreted as an object in a talis RDF json and
 * thus provides the fields 'type', 'value', 'datatype' and 'lang'.
 *
 * <rdf-term-input ng-model="model" rex-term="model"></rdf-term-input>
 *
 * If rex-term appears on a directive using a model attribute   , it can be shortened as shown below:
 *
 * <rdf-term-input ng-model="model" rex-term></rdf-term-input>
 *
 *
 */
.directive('rexTerm', ['$parse', '$compile', function($parse, $compile) {
    return {
        priority: 900,
        restrict: 'A',
        scope: true,
        terminal: true,
        //require: ['^rexContext', '^rexObject', '?^ngModel'],
        controller: angular.noop,
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    var modelExprStr = attrs.rexTerm;

                    if(jassa.util.ObjectUtils.isEmptyString(modelExprStr)) {
                        var name = getModelAttribute(attrs);
                        modelExprStr = attrs[name];
                    }

                    if(!modelExprStr) {
                        throw new Error('No model provided and found');
                    }

                    ele.removeAttr('rex-term');

                    ele.attr('rex-termtype', modelExprStr + '.type');
                    ele.attr('rex-datatype', modelExprStr + '.datatype');
                    ele.attr('rex-lang', modelExprStr + '.lang');
                    ele.attr('rex-value', modelExprStr + '.value');

                    // Continue processing any further directives
                    $compile(ele)(scope);
                }
            };
        }
    };
}])

;

