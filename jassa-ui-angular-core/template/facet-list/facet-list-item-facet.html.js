angular.module("template/facet-list/facet-list-item-facet.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facet-list/facet-list-item-facet.html",
    "<div class=\"input-group\">\n" +
    "\n" +
    "    <button style=\"text-align: left; width: 100%\" class=\"btn btn-default btn-label facet-list-item-btn\" type=\"button\" ng-click=\"breadcrumb.property = item.property.getUri()\">\n" +
    "        <span class=\"glyphicon glyphicon glyphicon-record\"></span>\n" +
    "        {{item.labelInfo.displayLabel || NodeUtils.toPrettyString(item.property)}}\n" +
    "        <span class=\"counter\"> {{item.valueCountInfo.hasMoreItems ? '...' : '' + item.valueCountInfo.count}}</span>\n" +
    "    </button>\n" +
    "\n" +
    "    <div class=\"input-group-btn\">\n" +
    "        <ul class=\"list-inline\">\n" +
    "            <li ng-repeat=\"facetPlugin in facetPlugins\" compile=\"facetPlugin\">\n" +
    "    <!--                             <ng-include src=\"plugin\"></ng-include> -->\n" +
    "            </li>\n" +
    "            <li>\n" +
    "                <button class=\"btn btn-default facet-list-item-btn visible-on-hover-child\" type=\"button\" ng-click=\"descendFacet(item.property)\">\n" +
    "                    <span class=\"glyphicon glyphicon-chevron-right\"></span>\n" +
    "                </button>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);
