angular.module("template/facet-tree/facet-tree-root.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facet-tree/facet-tree-root.html",
    "<div>\n" +
    "	<span ng-show=\"loading.data\">\n" +
    "		Loading... \n" +
    "	    <span ng-show=\"loading.data\">(data)</span>\n" +
    "	</span>\n" +
    "\n" +
    "    <ng-include src=\"'template/facet-tree/facet-tree-item.html'\"></ng-include>\n" +
    "</div>\n" +
    "");
}]);
