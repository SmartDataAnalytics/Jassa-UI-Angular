angular.module("template/facet-value-list/facet-value-list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facet-value-list/facet-value-list.html",
    "<div class=\"frame\">\n" +
    "    <form ng-submit=\"filterTable(filterText)\">\n" +
    "        <input type=\"text\" ng-model=\"filterText\" />\n" +
    "        <input class=\"btn-primary\" type=\"submit\" value=\"Filter\" />\n" +
    "    </form>\n" +
    "\n" +
    "    <ul style=\"list-style: none;\">\n" +
    "        <li ng-repeat=\"item in facetValues\">\n" +
    "            <a href=\"\" ng-click=\"toggleConstraint(item)\">\n" +
    "                <span style=\"padding: 1px\" ng-style=\"item.tags.isConstrainedEqual && { 'background-color': '#428bca', 'color': 'white', 'border-radius': '.25em;' }\" title=\"{{item.node}}\">{{item.labelInfo.displayLabel || item.node}}</span>\n" +
    "            </a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "<!--     <table> -->\n" +
    "<!--               <tr><th>Value</th><th>Constrained</th></tr> -->\n" +
    "<!--         <tr ng-repeat=\"item in facetValues\"> -->\n" +
    "<!--                   <td><span title=\"{{item.node}}\">{{item.labelInfo.displayLabel || item.node}}</span></td> -->\n" +
    "<!--                   <td><input type=\"checkbox\" ng-model=\"item.tags.isConstrainedEqual\" ng-change=\"toggleConstraint(item)\" /></td> -->\n" +
    "<!--               </tr> -->\n" +
    "<!--           </table> -->\n" +
    "          <pagination class=\"pagination-small\" total-items=\"pagination.totalItems\" page=\"pagination.currentPage\" max-size=\"pagination.maxSize\" boundary-links=\"true\" rotate=\"false\" num-pages=\"pagination.numPages\" previous-text=\"&lsaquo;\" next-text=\"&rsaquo;\" first-text=\"&laquo;\" last-text=\"&raquo;\"></pagination>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);
