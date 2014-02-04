angular.module("template/facettree/facet-tree-item.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facettree/facet-tree-item.html",
    "<div ng-class=\"{'frame': facet.isExpanded}\">\n" +
    "	<div class=\"facet-row\" ng-class=\"{'highlite': facet.isExpanded}\" ng-mouseover=\"facet.isHovered=true\" ng-mouseleave=\"facet.isHovered=false\">\n" +
    "		<a ng-show=\"facet.isExpanded\" href=\"\" ng-click=\"toggleCollapsed(facet.item.getPath())\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a>\n" +
    "		<a ng-show=\"!facet.isExpanded\" href=\"\" ng-click=\"toggleCollapsed(facet.item.getPath())\"><span class=\"glyphicon glyphicon-chevron-right\"></span></a>\n" +
    "		<a data-rdf-term=\"{{facet.item.getNode().toString()}}\" title=\"{{facet.item.getNode().getUri()}}\" href=\"\" ng-click=\"toggleSelected(facet.item.getPath())\">{{facet.item.getNode().getUri()}}</a>\n" +
    "\n" +
    "\n" +
    "		<a ng-visible=\"facet.isHovered || facet.table.isContained\" href=\"\" ng-click=\"toggleTableLink(facet.item.getPath())\"><span class=\"glyphicon glyphicon-list-alt\"></span></a>\n" +
    "\n" +
    "\n" +
    "		<span style=\"float: right\" class=\"badge\">{{facet.item.getDistinctValueCount()}}</span>	\n" +
    "	</div>\n" +
    "	<div ng-if=\"facet.isExpanded\" style=\"width:100%\"> \n" +
    "\n" +
    "\n" +
    "		<tabset class=\"tabset-small\">\n" +
    "			<tab heading=\"Incoming Facets\" active=\"{{facet.isIncomingActive === true}}\" select=\"selectIncoming(facet.item.getPath())\">\n" +
    "				<div ng-repeat=\"dirset in [facet.incoming]\" ng-include=\"'resources/partials/facet-dir-content.html'\"></div>\n" +
    "			</tab>\n" +
    "			<tab heading=\"Outgoing Facets\" active=\"{{facet.isOutgoingActive === true}}\" select=\"selectOutgoing(facet.item.getPath())\">					\n" +
    "				<div ng-repeat=\"dirset in [facet.outgoing]\" ng-include=\"'resources/partials/facet-dir-content.html'\"></div>\n" +
    "			</tab>\n" +
    "		</tabset>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);
