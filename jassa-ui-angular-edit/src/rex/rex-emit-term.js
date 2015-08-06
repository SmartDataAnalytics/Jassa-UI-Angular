angular.module('ui.jassa.rex')

/**
 * Unconditionally emit a triple with a certain RDF term.
 *
 * If this triple already exists in the source data, no action will be performed.
 * Otherwise, a new reference which appends that term is allocated.
 *
 * Note, that unlike rexTerm, rexEmitTerm is NOT a reference to a value itself.
 * It just makes sure that such triple exists.
 */
.directive('rexEmitTerm', ['$parse', '$compile', function($parse, $compile) {
    return {
        priority: 1000,
        restrict: 'A',
        scope: true,
        terminal: true,
        controller: angular.noop,
        compile: function(ele, attrs) {
            return {
                pre: function(scope, ele, attrs, ctrls) {
                    // TODO Implement me
                }
            };
        }
    };
}])

;