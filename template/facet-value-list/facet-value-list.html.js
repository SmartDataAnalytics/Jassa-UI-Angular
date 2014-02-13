angular.module("template/facet-value-list/facet-value-list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facet-value-list/facet-value-list.html",
    "<div class=\"frame\">\n" +
    "	<form ng-submit=\"filterTable(filterText)\">\n" +
    "	    <input type=\"text\" ng-model=\"filterText\" />\n" +
    "		<input class=\"btn-primary\" type=\"submit\" value=\"Filter\" />\n" +
    "	</form>\n" +
    "	<table>\n" +
    "              <tr><th>Value</th><th>Constrained</th></tr>\n" +
    "<!-- <th>Count</th> -->\n" +
    "	    <tr ng-repeat=\"item in facetValues\">\n" +
    "                  <td>{{item.displayLabel}}</td>\n" +
    "<!--                    <td>todo</td> -->\n" +
    "                  <td><input type=\"checkbox\" ng-model=\"item.tags.isConstrainedEqual\" ng-change=\"toggleConstraint(item)\" /></td>\n" +
    "              </tr>\n" +
    "      	</table>\n" +
    "  		<pagination class=\"pagination-small\" total-items=\"pagination.totalItems\" page=\"pagination.currentPage\" max-size=\"pagination.maxSize\" boundary-links=\"true\" rotate=\"false\" num-pages=\"pagination.numPages\"></pagination>\n" +
    "</div>\n" +
    "");
}]);
