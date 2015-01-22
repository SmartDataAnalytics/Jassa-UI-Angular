angular.module("template/breadcrumb/breadcrumb.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/breadcrumb/breadcrumb.html",
    "<ol class=\"breadcrumb facet-breadcrumb\" scroll-glue-right>\n" +
    "    <!-- If the path is empty, show the instance list button  -->\n" +
    "    <li ng-show=\"path.isEmpty()\">\n" +
    "        <button class=\"btn btn-default\" ng-disabled=\"path.isEmpty()\" ng-click=\"setPath(-1)\">\n" +
    "            <span class=\"glyphicon glyphicon glyphicon-menu-hamburger\"></span>\n" +
    "        </button>\n" +
    "    </li>\n" +
    "\n" +
    "    <li>\n" +
    "        <button class=\"btn btn-default\" ng-disabled=\"path.isEmpty()\" ng-click=\"setPath(0)\">\n" +
    "            <span class=\"glyphicon glyphicon-home\"></span>\n" +
    "        </button>\n" +
    "    </li>\n" +
    "\n" +
    "<!--     <li ng-if=\"offset != 0\"> -->\n" +
    "<!--         ... -->\n" +
    "<!--     </li> -->\n" +
    "\n" +
    "<!-- .slice(-offset) -->\n" +
    "    <li ng-repeat=\"slot in state.slots\">\n" +
    "        <button class=\"btn btn-default\" ng-disabled=\"$last && !model.property\" ng-click=\"setPath($index + 1)\">\n" +
    "            {{slot.labelInfo.displayLabel || slot.property.getUri()}} {{slot.isInverse ? '-1' : ''}}\n" +
    "        </button>\n" +
    "    </li>\n" +
    "\n" +
    "    <li ng-show=\"state.value == null\">\n" +
    "        <button class=\"btn btn-default\" ng-click=\"invert()\">\n" +
    "            {{model.pathHead.isInverse() ? '&lt;' : '&gt;'}}\n" +
    "        </button>\n" +
    "    </li>\n" +
    "\n" +
    "    <li ng-show=\"state.value != null\">\n" +
    "        <button class=\"btn btn-default\" ng-click=\"model.property = null\">\n" +
    "            {{state.value.labelInfo.displayLabel}} {{model.pathHead.isInverse() ? '-1' : ''}}\n" +
    "        </button>\n" +
    "    </li>\n" +
    "\n" +
    "\n" +
    "</ol>\n" +
    "");
}]);
