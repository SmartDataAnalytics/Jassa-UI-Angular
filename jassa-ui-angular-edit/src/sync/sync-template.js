angular.module('ui.jassa.sync')

/**
 * Convenience directive
 *
 * sync-template="templateStr"
 *
 * implies sync-source="templateStr" sync-interpolate sync-to-target? sync-target?
 *
 * if sync-target is not specified, it will try to detect a target based on model attribute names (e.g. ngModel)
 */
.directive('syncTemplate', ['$parse', '$compile', function($parse, $compile) {
    return {
        priority: 1000,
        restrict: 'A',
        scope: true,
        terminal: true,
        controller: function() {},
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    var templateStr = ele.attr('sync-template');

                    ele.removeAttr('sync-template');

                    ele.attr('sync-source', templateStr);
                    ele.attr('sync-source-interpolate', '');

                    if(ele.attr('sync-target') == null) {
                        var name = getModelAttribute(attrs);
                        var modelExprStr = attrs[name];

                        if(!modelExprStr) {
                            throw new Error('No model provided and found');
                        }

                        ele.attr('sync-target', modelExprStr);
                    }

                    // TODO Create a function to set attr default values
                    if(ele.attr('sync-to-target') == null) {
                        ele.attr('sync-to-target', '');
                    }

                    // Continue processing any further directives
                    $compile(ele)(scope);
                }
            };
        }
    };
}])

;
