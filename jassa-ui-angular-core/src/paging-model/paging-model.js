angular.module('ui.jassa.paging-model', [])

/**
 * A convenience directive which expands itself to several other html attributes
 *
 * {{ls.state.paging.totalItems}}
 * {{ls.state.filter.limit}}
 * {{ls.ctrl.paging.currentPage}}
 *
 *
 * &lt;pagination paging-style="list.pagingStyle" &gt;
 */
.directive('pagingModel', ['$compile', function($compile) {

    return {
        priority: 1050,
        restrict: 'A',
        terminal: true,
        scope: false,
        compile: function(ele, attrs) {
            return {
                pre: function(scope, elem, attrs, ctrls) {
                    // If the attribute is not present, add it
                    var setDefaultAttr = function(key, val) {
                        var expr = elem.attr(key);
                        if(expr == null) {
                            elem.attr(key, val);
                        }
                    };


                    var base = attrs.pagingModel;
                    if(base == null) {
                        throw new Error('Object needed as argument for paging-model');
                    }

                    elem.removeAttr('paging-model');

                    setDefaultAttr('total-items', base + '.state.paging.totalItems');
                    setDefaultAttr('items-per-page', base + '.state.filter.limit');
                    setDefaultAttr('ng-model', base + '.ctrl.paging.currentPage');

                    // Fallback for legacy versions of ui bootstrap
                    setDefaultAttr('page', base + '.ctrl.paging.currentPage');

                    $compile(elem)(scope);
                }
            };
        }
    };
}])

;
