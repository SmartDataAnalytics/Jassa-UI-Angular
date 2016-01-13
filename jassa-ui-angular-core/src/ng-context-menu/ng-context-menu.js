var ContextMenuUtils = {

    /**
     * Process options and update the scope object
     *
     * TODO Possibly separate validation
     * @param options
     * @param scope
     */
    initScope: function(options, scope) {
        scope.doClick = function(itemScope) {
            if(itemScope.callback) {
                itemScope.callback(itemScope);
            }
        };

        if(!options) {
            throw new Error('Context menu options have not been set, is: ' + options);
        }

        if(typeof(options) === 'function') {
            options = options(scope);
        }

        if (options instanceof Array) {
            scope.items = options;
        } else {
            throw new Error('"' + options + '" not an array');
        }
    },

    /*
    installCloseHandler: function() {
        var $body = $(document).find('body');

        $body.click(function() {

        });
    },
    */
    globalHandlerInitialized: false,
    openMenus: [],
    counter: 0,

    hideAll: function() {
        console.log('got event');
        ContextMenuUtils.openMenus.forEach(function(item) {
            try {
                item.destroy();
            } catch(e) {
                console.log('[ERROR] ', e);
            }
        });

        while(ContextMenuUtils.openMenus.length) {
            ContextMenuUtils.openMenus.pop();
        }
    },

    renderContextMenu: function(fetchContentFn, event) {
        this.hideAll();

        var jQueryApi = jQuery || $ || angular.element;
        var $ = jQueryApi;
//        if (!$) {
//            var $ = angular.element;
//        }

        //var selector = '*';
        //var selector = 'body';

        // TODO Allow customizing selectors
        var selector = 'body, .olMapViewport';
        var $els = $(document).find(selector);

        var ns = '.ngcontextmenu';

        ContextMenuUtils.renderContextMenuCore(fetchContentFn, event).then(function($content) {
            $(event.target).addClass('context');
            var c = ContextMenuUtils.counter++;
            var eventName = 'click' + ns + c;

            var destroy = function() {
                $els.off(eventName);
                $content.remove();
                $(event.target).removeClass('context');
            };

            //console.log('Enabled event on ' + $els.length + ' elements');
            $els.on(eventName, function() {
                destroy();
            });

            var $body = $(document).find('body');
            $body.append($content);
            ContextMenuUtils.openMenus.push({
                event: event,
                $content: $content,
                destroy: destroy
            });


        });
    },

    renderContextMenuCore: function(fetchContentFn, event) {
        return fetchContentFn()
            .then(function($content) {

                $content.css({
                    display: 'block',
                    position: 'absolute',
                    left: event.pageX + 'px',
                    top: event.pageY + 'px'
                });

                return $content;
            }, function (err) {
                console.log('Cannot load template: ' + contentUrl);
        });
    }
};



angular.module('ui.jassa.ng-context-menu', [])

.factory('ngContextMenuFactory', ['$compile', '$templateCache', '$http', function($compile, $templateCache, $http) {
    var createContentPromise = function(options) {
        var r;
        if(options == null) {
            throw new Error('No options provided');
        }
        else if(options instanceof Array) {
            var contentUrl = 'directives/ng-context-menu.html';
            r = $http.get(contentUrl, {cache: $templateCache}).then(function(x) {
                return x.data;
            });
        }
        else if(options.template) {
            r = $q.when(options.template);
        }
        else if(options.templateUrl) {
            r = $http.get(options.templateUrl, {cache: $templateCache});
        }
        else {
            throw new Error('No content for context menu provided');
        }
        return r;
    };

    var fetchContent = function(options, scope) {
        return createContentPromise(options).then(function(contentStr) {
            var r = $compile(contentStr)(scope);
            return r;
        });
    };

    var createFetchContentFn = function(options, scope) {
        return function() {
            return fetchContent(options, scope);
        };
    };

    return function(options, scope, event, suppressStopPropagation) {
        // If event propagation continues, it may lead to immediate hiding of
        // just rendered menus
        if(!suppressStopPropagation) {
            event.stopPropagation();
        }


        if(typeof(options) === 'function') {
            options = options(scope);
        }

        ContextMenuUtils.initScope(options, scope);
        var fetchContentFn = createFetchContentFn(options, scope);
        ContextMenuUtils.renderContextMenu(fetchContentFn, event);
    };
}])

.directive('ngContextMenu', ['ngContextMenuFactory', function(ngContextMenuFactory) {

//    var renderContextMenu = function(fetchContentFn, event) {
//        renderContextMenu(fetchContentFn), event.target, event.pageX, event.pageY
//    }

    return {
        restrict: 'EA',
        //scope: true,
        compile: function() {
            return {
                pre: function (scope, element, attrs) {

                    var showContextMenu = function(event) {
                        scope.$apply(function () {
                            event.preventDefault();

                            var options = scope.$eval(attrs.ngContextMenu);
                            //ContextMenuUtils.initScope(options, scope);
                            ngContextMenuFactory(options, scope, event);
                        });
                    };


                    element.on('click', showContextMenu);
                }
            };
        }
    };
}])

;


// Other approaches which did not work properly
///**
// * Kept for reference, but the overlay approach turned out to be limiting
// * @param fetchContentFn
// * @param event
// * @returns
// */
//renderContextMenuWithOverlay: function(fetchContentFn, event) {
//    return fetchContentFn()
//        .then(function($content) {
//
//            var $overlay = $('<div></div>');
//            $overlay.addClass('dropdown clearfix');
//            $overlay.css({
//                width: '100%',
//                height: '100%',
//                position: 'absolute',
//                top: 0,
//                left: 0,
//                zIndex: 9999
//            });
//
//            $content.css({
//                display: 'block',
//                position: 'absolute',
//                left: event.pageX + 'px',
//                top: event.pageY + 'px'
//            });
//            $overlay.append($content);
//
//            $overlay
//                .on('click', function (e) {
//                    $(event.target).removeClass('context');
//                    $overlay.remove();
//                })
//                .on('contextmenu', function (event) {
//                    $(event.target).removeClass('context');
//                    //event.preventDefault();
//                    $overlay.remove();
//                });
//
//            return $overlay;
//        }, function (err) {
//            console.log('Cannot load template: ' + contentUrl);
//        });
//}
//
//renderContextMenuBuggy: function(fetchContentFn, event) {
//    if (!$) {
//        var $ = angular.element;
//    }
//
//    this.hideAll();
//
//    var $document = $(document);
//    var $body = $(document).find('body');
//    $(event.target).addClass('context');
//
//    if(!ContextMenuUtils.globalHandlerInitialized) {
//        var ns = '.ngcontextmenu';
//
//        console.log('enabled event');
//        $document.on('click' + ns, this.hideAll);
//        $document.on('contextmenu' + ns, this.hideAll);
//
//
//        ContextMenuUtils.globalHandlerInitialized = true;
//    }
//
//    ContextMenuUtils.renderContextMenuCore(fetchContentFn, event).then(function($content) {
//        $body.append($content);
//        ContextMenuUtils.openMenus.push({
//            event: event,
//            $content: $content
//        });
//
//    });
//}
