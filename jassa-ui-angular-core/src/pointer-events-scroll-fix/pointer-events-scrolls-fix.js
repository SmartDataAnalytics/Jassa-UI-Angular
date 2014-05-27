angular.module('ui.jassa.pointer-events-scroll-fix', [])

/**
 * Scrollbars on overflow divs with pointer-events: none are not clickable on chrome/chromium.
 * This directive sets pointer-events to auto when scrollbars are needed and thus assumed to be visible.
 *
 */
.directive('pointerEventsScrollFix', function() {
    return {
        restrict: 'A',
        //scope: 
        compile: function() {
            return {
                post: function(scope, elem, attrs) {

                    // TODO Registering (jQuery) plugins in a directive is actually an anti-pattern - either get rid of this or move the plugin to a common location
                    if(!jQuery.fn.hasScrollBar) {
                        jQuery.fn.hasScrollBar = function() {
                            var el = this.get(0);
                            if(!el) {
                                console.log('Should not happen');
                                return false;
                            }

                            var result = el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
                            //console.log('Checked scrollbar state: ', result);
                            return result;
                        };
                    }
                    
                    var backup = null;
                    
                    scope.$watch(
                        function () { return jQuery(elem).hasScrollBar(); },
                        function (hasScrollBar) {
                            console.log('Scrollbar state: ', hasScrollBar, backup);
                            if(hasScrollBar) {
                                if(!backup) {
                                    backup = elem.css('pointer-events');
                                    elem.css('pointer-events', 'auto');
                                }
                            } else if(backup) {
                                elem.css('pointer-events', backup);
                                backup = null;
                            }
                        }
                    );
                }
            };
        }
    };
})

;

