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
        restrict: 'A',
        terminal: true,
        scope: false,
        compile: function(elem, attrs) {
            return {
                pre: function(scope, elem, attrs, ctrls) {
                    var createDefaults = function() {
                        return {
                            maxSize: 6,
                            rotate: true,
                            boundaryLinks: true,
                            directionLinks: true,
                            firstText: '<<',
                            previousText: '<',
                            nextText: '>',
                            lastText: '>>'
                            /*
                            firstText: '&lt;&lt;',
                            previousText: '&lt;',
                            nextText: '&gt;',
                            lastText: '&gt;&gt;'
                            */
                        };
                    };

                    // If the attribute is not present, add it
                    var setDefaultAttr = function(key, val, interpolate) {
                        var expr = elem.attr(key);
                        if(expr == null) {

                            var v = interpolate ? '{{' + val + '}}' : val;
                            elem.attr(key, v);
                        }
                    };


                    var base = attrs.pagingStyle;
                    if(base == null) {
                        base = 'pagingStyle';
                        scope.pagingStyle = {};
                    }

                    elem.removeAttr('paging-style');

                    setDefaultAttr('max-size', base + '.maxSize', true);
                    setDefaultAttr('rotate', base + '.rotate', true);
                    setDefaultAttr('boundary-links', base + '.boundaryLinks', true);
                    setDefaultAttr('first-text', base + '.firstText', true);
                    setDefaultAttr('previous-text', base + '.previousText', true);
                    setDefaultAttr('next-text', base + '.nextText', true);
                    setDefaultAttr('last-text', base + '.lastText', true);
                    setDefaultAttr('direction-links', base + '.directionLinks', true);

                    var defs = createDefaults();

                    var exprStr = attrs.pagingStyle;
                    var modelGetter = $parse(exprStr);

                    var initModel = function(obj) {
                        obj = obj || modelGetter(scope);
                        if(obj != null) {
                            _.defaults(obj, defs);
                        }
                    };

                    scope.$watch(function() {
                        var r = modelGetter(scope);
                        return r;
                    }, function(obj) {
                        initModel(obj);
                    }, true);

                    initModel();

                    $compile(elem)(scope);
                }
            };
        }
    };
}])

;
