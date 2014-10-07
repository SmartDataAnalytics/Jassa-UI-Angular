angular.module("template/facet-tree/facet-dir-ctrl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facet-tree/facet-dir-ctrl.html",
    "<div style=\"width: 100%; background-color: #eeeeff;\">\n" +
    "    <div style=\"padding-right: 16px; padding-left: 16px\">\n" +
    "\n" +
    "        <form class=\"form-inline\" role=\"form\" ng-submit=\"doFilter(dirset.pathHead, dirset.listFilter.concept)\">\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"input-group\">\n" +
    "                    <input type=\"text\" class=\"form-control input-sm\" placeholder=\"Filter\" ng-model=\"dirset.listFilter.concept\" ng-change=\"doFilter(dirset.pathHead, dirset.listFilter.concept)\"/>\n" +
    "                    <span class=\"input-group-btn\">\n" +
    "                        <button type=\"submit\" class=\"btn btn-default input-sm\">Filter</button>\n" +
    "                    </span>\n" +
    "                    <span class=\"input-group-btn\">\n" +
    "                        <select class=\"btn btn-default input-sm\" ng-model=\"dirset.listFilter.limit\" ng-options=\"item for item in itemsPerPage\"></select>\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "<!--                 <div class=\"input-group\"> -->\n" +
    "<!--                     <select class=\"form-control input-sm\" ng-model=\"dirset.limit\" ng-options=\"item for item in itemsPerPage\"></select> -->\n" +
    "<!--                 </div> -->\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);
