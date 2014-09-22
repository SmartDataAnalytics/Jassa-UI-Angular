angular.module("template/jassa-list-browser/jassa-list-browser.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/jassa-list-browser/jassa-list-browser.html",
    "<div class=\"container\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "\n" +
    "            <div class=\"alert alert-success\" role=\"alert\">\n" +
    "\n" +
    "                <list-search ng-model=\"searchString\" submit=\"doFilter(searchString)\" search-modes=\"searchModes\" active-search-mode=\"activeSearchMode\"></list-search>\n" +
    "                <div>\n" +
    "                    <ul class=\"list-inline\">\n" +
    "                        <li><span>Language Settings: </span></li>\n" +
    "                        <li><lang-select langs=\"langs\" available-langs=\"availableLangs\"></lang-select></li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "\n" +
    "                <div>\n" +
    "                    <strong>Found <span class=\"badge\">{{totalItems}}</span> items</strong>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "\n" +
    "        <div class=\"col-md-12\">\n" +
    "\n" +
    "            <jassa-media-list list-service=\"listService\" offset=\"offset\" limit=\"limit\" maxSize=\"maxSize\" filter=\"filter\" total-items=\"totalItems\" items=\"items\" refresh=\"langs\" context=\"context\">\n" +
    "                <ng-include src=\"context.itemTemplate\"></ng-include>\n" +
    "            </jassa-media-list>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);
