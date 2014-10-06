angular.module("template/facet-tree/facet-dir-ctrl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facet-tree/facet-dir-ctrl.html",
    "<div style=\"width: 100%; background-color: #eeeeff;\">\n" +
    "    {{pageCount}} {{currentPage}}\n" +
    "    <div style=\"padding-right: 16px; padding-left: 16px\">\n" +
    "\n" +
    "        <form class=\"form-inline\" role=\"form\" ng-submit=\"doFilter(dirset.pathHead, dirset.filterString)\">\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"text\" class=\"form-control input-sm\" placeholder=\"Filter\" ng-model=\"dirset.filterString\" />\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <button type=\"submit\" class=\"btn btn-default input-sm\">Filter</button>\n" +
    "            </div>\n" +
    "\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);
