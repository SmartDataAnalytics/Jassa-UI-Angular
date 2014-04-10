angular.module("template/facet-tree/facet-tree-item.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facet-tree/facet-tree-item.html",
    "<div ng-class=\"{'frame': facet.isExpanded}\">\n" +
    "\n" +
    "	<div class=\"facet-row\" ng-class=\"{'highlite': facet.isExpanded}\" ng-mouseover=\"setFacetHover(facet, true)\" ng-mouseleave=\"setFacetHover(facet, false)\">\n" +
    "		<a ng-show=\"facet.isExpanded\" href=\"\" ng-click=\"toggleCollapsed(facet.item.getPath())\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a>\n" +
    "		<a ng-show=\"!facet.isExpanded\" href=\"\" ng-click=\"toggleCollapsed(facet.item.getPath())\"><span class=\"glyphicon glyphicon-chevron-right\"></span></a>\n" +
    "\n" +
    "		<a href=\"\" title=\"Showing incoming facets. Click to show outgoing facets.\" ng-if=\"facet.isExpanded && facet.isIncomingActive === true\" ng-click=\"selectOutgoing(facet.item.getPath())\"><span class=\"glyphicon glyphicon-arrow-left\"></span></a>\n" +
    "		<a href=\"\" title=\"Showing outgoing facets. Click to show incoming facets.\" ng-if=\"facet.isExpanded && facet.isOutgoingActive === true\" ng-click=\"selectIncoming(facet.item.getPath())\"><span class=\"glyphicon glyphicon-arrow-right\"></span></a>\n" +
    "\n" +
    "\n" +
    "		<a data-rdf-term=\"{{facet.item.getNode().toString()}}\" title=\"{{facet.item.getNode().getUri()}}\" href=\"\" ng-click=\"toggleSelected(facet.item.getPath())\">{{facet.item.getDoc().displayLabel}}</a>\n" +
    "\n" +
    "		<template-list style=\"list-style:none; display: inline; padding-left: 0px;\" templates=\"plugins\" data=\"facet\" context=\"pluginContext\"></template-list>\n" +
    "\n" +
    "		<span style=\"float: right\" class=\"badge\" ng-bind-html=\"(facet.item.getDistinctValueCount() == null || facet.item.getDistinctValueCount() < 0) ? '&#8230;' : ('' + facet.item.getDistinctValueCount())\"></span>\n" +
    "		\n" +
    "		<div ng-if=\"facet.isExpanded && facet.isHovered && facet.isIncomingActive === true\" style=\"width:100%\" ng-repeat=\"dirset in [facet.incoming]\" ng-include=\"'template/facet-tree/facet-dir-ctrl.html'\"></div>\n" +
    "		<div ng-if=\"facet.isExpanded && facet.isHovered && facet.isOutgoingActive === true\" style=\"width:100%\" ng-repeat=\"dirset in [facet.outgoing]\" ng-include=\"'template/facet-tree/facet-dir-ctrl.html'\"></div>\n" +
    "	</div>\n" +
    "	<div ng-if=\"facet.isExpanded\" style=\"width:100%\"> \n" +
    "\n" +
    "\n" +
    "			<div ng-if=\"facet.isExpanded && facet.isIncomingActive === true\" ng-repeat=\"dirset in [facet.incoming]\" ng-include=\"'template/facet-tree/facet-dir-content.html'\"></div>\n" +
    "			<div ng-if=\"facet.isExpanded && facet.isOutgoingActive === true\" ng-repeat=\"dirset in [facet.outgoing]\" ng-include=\"'template/facet-tree/facet-dir-content.html'\"></div>\n" +
    "\n" +
    "\n" +
    "<!-- 		<tabset class=\"tabset-small\"> -->\n" +
    "<!-- 			<tab heading=\"Incoming Facets\" active=\"{{facet.isIncomingActive === true}}\" select=\"selectIncoming(facet.item.getPath())\"> -->\n" +
    "<!-- 				<div ng-repeat=\"dirset in [facet.incoming]\" ng-include=\"'template/facet-tree/facet-dir-content.html'\"></div> -->\n" +
    "<!-- 			</tab> -->\n" +
    "<!-- 			<tab heading=\"Outgoing Facets\" active=\"{{facet.isOutgoingActive === true}}\" select=\"selectOutgoing(facet.item.getPath())\">					 -->\n" +
    "<!-- 				<div ng-repeat=\"dirset in [facet.outgoing]\" ng-include=\"'template/facet-tree/facet-dir-content.html'\"></div> -->\n" +
    "<!-- 			</tab> -->\n" +
    "		</tabset>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);
