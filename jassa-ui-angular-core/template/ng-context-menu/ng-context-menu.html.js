angular.module("template/ng-context-menu/ng-context-menu.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/ng-context-menu/ng-context-menu.html",
    "<ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "    <li ng-repeat=\"item in items\" ng-class=\"item ? '' : 'divider'\">\n" +
    "        <a ng-if=\"item\" tabindex=\"!item ? '-1' : ''\" dyn-attrs=\"item.linkAttrs\" ng-click=\"doClick(item)\">\n" +
    "            {{item.text}}\n" +
    "        </a>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);
