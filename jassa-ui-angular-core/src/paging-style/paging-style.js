angular.module('ui.jassa.paging-style', [])

/**
 * A convenience directive which expands itself to several other html attributes
 *
 * total-items
 * items-per-page
 * max-size
 * num-pages
 * rotate
 * direction-links
 * previous-text
 * next-text
 * boundary-links
 * first-text
 * last-text
 *
 * &lt;pagination paging-style="list.pagingStyle" &gt;
 */
.directive('pagingStyle', ['$compile', '$parse', function($compile, $parse) {

    return {
        priority: 1050,
        terminal: true,
        pre: function(scope, elem, attrs, ctrls) {
            var createDefaults = function() {
                return {
                    maxSize: 7,
                    rotate: true,
                    boundaryLinks: true,
                    firstText: '&lt;&lt;',
                    previousText: '&lt;',
                    nextText: '&gt;',
                    lastText: '&gt;&gt;'
                };
            };

            // If the attribute is not present, add it
            var setDefaultAttr = function(key, val) {
                var expr = elem.attr(key);
                if(expr == null) {
                    elem.attr(key, '\'' + val + '\'');
                }
            };


            var base = attrs.pagingStyle;
            if(base == null) {
                base = 'pagingStyle';
                scope.pagingStyle = {};
            }

            setDefaultAttr('max-size', base + '.maxSize');
            setDefaultAttr('rotate', base + '.rotate');
            setDefaultAttr('boundary-links', base + '.boundaryLinks');
            setDefaultAttr('first-text', base + '.firstText');
            setDefaultAttr('previous-text', base + '.previousText');
            setDefaultAttr('next-text', base + '.nextText');
            setDefaultAttr('last-text', base + '.lastText');
            setDefaultAttr('direction-links', base + '.directionLinks');

            var defs = createDefaults();

            var exprStr = attrs.pagingStyle;
            var modelGetter = $parse(exprStr);

            var initModel = function(model) {
                model = model || modelGetter();
                if(obj != null) {
                    _.defaults(obj, defs);
                }
            };

            $scope.$watch(function() {
                var r = modelGetter();
                return r;
            }, function(model) {
                initModel(model);
            }, true);

            initModel();
            $compile(ele)(scope);
        }
    };
}])

;
