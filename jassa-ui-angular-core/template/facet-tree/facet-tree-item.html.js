angular.module("template/facet-tree/facet-tree-item.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facet-tree/facet-tree-item.html",
    "<div ng-class=\"{'frame': facet.isExpanded}\">\n" +
    "\n" +
    "<div style=\"width: 100%\" ng-controller=\"FacetNodeCtrl\">\n" +
    "    <div class=\"facet-row visible-on-hover-parent\" ng-class=\"{'highlite': facet.isExpanded}\">\n" +
    "        <a ng-class=\"facet.isExpanded ? '' : 'visible-on-hover-child'\" href=\"\" ng-click=\"toggleCollapsed(facet.path)\"><span class=\"glyphicon\" ng-class=\"facet.isExpanded ? 'glyphicon-chevron-down' : 'glyphicon-chevron-right'\"></span></a>\n" +
    "\n" +
    "        <a href=\"\" title=\"Showing incoming facets. Click to show outgoing facets.\" ng-if=\"facet.isExpanded && facet.incoming\" ng-click=\"selectOutgoing(facet.path)\"><span class=\"glyphicon glyphicon-arrow-left\"></span></a>\n" +
    "        <a href=\"\" title=\"Showing outgoing facets. Click to show incoming facets.\" ng-if=\"facet.isExpanded && facet.outgoing\" ng-click=\"selectIncoming(facet.path)\"><span class=\"glyphicon glyphicon-arrow-right\"></span></a>\n" +
    "\n" +
    "\n" +
    "        <a title=\"{{facet.property.getUri()}}\" href=\"\" ng-click=\"onSelect({path: facet.path})\">{{facet.labelInfo.displayLabel || facet.property.getUri()}}</a>\n" +
    "\n" +
    "        <small><span style=\"color: gray;\" ng-bind-html=\"(!facet.valueCountInfo || facet.valueCountInfo.hasMoreItems) ? '&#8230;' : ('' + facet.valueCountInfo.count)\"></span></small>\n" +
    "\n" +
    "        <a style=\"margin-left: 5px; margin-right: 5px;\" ng-class=\"!facet.isExpanded ? 'hide' : { 'visible-on-hover-child': !facet.tags.showControls }\" href=\"\" ng-click=\"toggleControls(facet.path)\"><span class=\"glyphicon glyphicon-cog\"></span></a>\n" +
    "\n" +
    "        <a style=\"margin-left: 5px; margin-right: 5px;\" ng-class=\"{ 'visible-on-hover-child': !isEqual(facet.path, startPath) }\" href=\"\" ng-click=\"setStartPath(facet.path)\"><span class=\"glyphicon glyphicon-pushpin\"></span></a>\n" +
    "\n" +
    "\n" +
    "        <template-list style=\"list-style:none; display: inline; padding-left: 0px;\" templates=\"plugins\" data=\"facet\" context=\"pluginContext\"></template-list>\n" +
    "\n" +
    "        <div style=\"display: inline\" ng-if=\"dirset.pageCount > 1\" style=\"background-color: #eeeeff\">\n" +
    "            <pagination\n" +
    "                style=\"padding-left: 16px\"\n" +
    "                class=\"pagination-tiny pagination-inline\"\n" +
    "                max-size=\"7\"\n" +
    "                total-items=\"dirset.childCountInfo.count\"\n" +
    "                page=\"dirset.currentPage\"\n" +
    "                boundary-links=\"true\"\n" +
    "                rotate=\"false\"\n" +
    "                on-select-page=\"selectPage(dirset.pathHead, page)\"\n" +
    "                first-text=\"<<\"\n" +
    "                previous-text=\"<\"\n" +
    "                next-text=\">\"\n" +
    "                last-text=\">>\"\n" +
    "            ></pagination>\n" +
    "        </div>\n" +
    "\n" +
    "<!--         <span style=\"float: right\" class=\"badge\" ng-bind-html=\"(!facet.valueCountInfo || facet.valueCountInfo.hasMoreItems) ? '&#8230;' : ('' + facet.valueCountInfo.count)\"></span> -->\n" +
    "\n" +
    "        <div ng-if=\"facet.isExpanded && facet.tags.showControls && facet.incoming\" style=\"width:100%\" ng-repeat=\"dirset in [facet.incoming] track by dirset.pathHead\" ng-include=\"'template/facet-tree/facet-dir-ctrl.html'\"></div>\n" +
    "        <div ng-if=\"facet.isExpanded && facet.tags.showControls && facet.outgoing\" style=\"width:100%\" ng-repeat=\"dirset in [facet.outgoing] track by dirset.pathHead\" ng-include=\"'template/facet-tree/facet-dir-ctrl.html'\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"facet.isExpanded\" style=\"width:100%\">\n" +
    "\n" +
    "<!--         <div ng-if=\"facet.isExpanded && facet.incoming\" ng-repeat=\"dirset in [facet.incoming]\" ng-include=\"'template/facet-tree/facet-dir-content.html'\"></div> -->\n" +
    "<!--         <div ng-if=\"facet.isExpanded && facet.outgoing\" ng-repeat=\"dirset in [facet.outgoing]\" ng-include=\"'template/facet-tree/facet-dir-content.html'\"></div> -->\n" +
    "\n" +
    "        <div ng-if=\"facet.isExpanded && facet.incoming\" ng-include=\"'template/facet-tree/facet-dir-content.html'\"></div>\n" +
    "        <div ng-if=\"facet.isExpanded && facet.outgoing\" ng-include=\"'template/facet-tree/facet-dir-content.html'\"></div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "</div>\n" +
    "");
}]);
