angular.module("template/facet-list/facet-list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facet-list/facet-list.html",
    "<div>\n" +
    "<!--     <H2>Facets</H2> -->\n" +
    "\n" +
    "    <breadcrumb sparql-service=\"sparqlService\" ng-model=\"breadcrumb\"></breadcrumb>\n" +
    "\n" +
    "    <!-- <div class=\"input-group\">\n" +
    "        <button type=\"submit\" class=\"btn btn-default\" type=\"button\"><span class=\"glyphicon glyphicon-search\"></span></button>\n" +
    "    </div> -->\n" +
    "\n" +
    "<!--     <div class=\"alert alert-success\" role=\"alert\" style=\"margin: 0px; padding: 0 0 5px 0px\"> -->\n" +
    "\n" +
    "<div>\n" +
    "        <form role=\"form\" ng-submit=\"filterString=filterModel; listFilter.offset=0\" novalidate>\n" +
    "            <div class=\"input-group\">\n" +
    "                <input ng-model=\"filterModel\" type=\"text\" class=\"form-control facet-filter\" placeholder=\"Find ...\">\n" +
    "                <span class=\"input-group-btn facet-filter-submit\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-default\" type=\"button\"><span class=\"glyphicon glyphicon-search\"></span></button>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "\n" +
    "        <div ng-show=\"filterString.length > 0\" style=\"margin: 5px 0 0 10px; color: #aaa;\"><span ng-show=\"loading.data || loading.pageCount\">Filtering by</span><span ng-hide=\"loading.data || loading.pageCount\">Filtered by </span> '{{filterString}}'</div>\n" +
    "</div>\n" +
    "<!--     </div> -->\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <div style=\"width: 100%\">\n" +
    "        <button ng-show=\"!showConstraints && facetValuePath\" class=\"btn btn-default facet-list-item-btn pull-left\" role=\"button\" ng-click=\"breadcrumb.property = null\"><span class=\"glyphicon glyphicon-chevron-left\"></span> Back</button>\n" +
    "        <button ng-show=\"!showConstraints && !facetValuePath && !breadcrumb.pathHead.getPath().isEmpty()\" class=\"btn btn-default facet-list-item-btn pull-left\" role=\"button\" ng-click=\"breadcrumb.pathHead = breadcrumb.pathHead.up()\"><span class=\"glyphicon glyphicon-chevron-left\"></span> Up</button>\n" +
    "\n" +
    "        <button ng-show=\"!showConstraints\" class=\"btn btn-default facet-list-item-btn pull-right\" href=\"#\" ng-click=\"showConstraints=!showConstraints\">Constraints <span class=\"glyphicon glyphicon-align-justify\"></span></button>\n" +
    "        <button ng-show=\"showConstraints\" class=\"btn btn-default facet-list-item-btn pull-right\" href=\"#\" ng-click=\"showConstraints=!showConstraints\">Facets <span class=\"glyphicon glyphicon-th-large\"></span></button>\n" +
    "\n" +
    "        <div class=\"clearfix\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "<!--     <div ng-show=\"!showConstraints\" class=\"facets alert alert-info\" role=\"alert\" style=\"margin: 0px; padding: 0px\"> -->\n" +
    "\n" +
    "        <jassa-list ng-show=\"!showConstraints\" list-service=\"listService\" list-filter=\"listFilter\" list-class=\"'list-group facet-list'\" loading=\"loading\" pagination-options=\"paginationOptions\">\n" +
    "            <li ng-show=\"!items.length\" class=\"list-group-item facet-list-item\" style=\"text-align: center\">\n" +
    "                <button class=\"btn btn-default btn-label facet-list-item-btn disabled\" type=\"button\">\n" +
    "                    No results\n" +
    "                </button>\n" +
    "            </li>\n" +
    "            <li ng-repeat=\"item in items\" class=\"list-group-item facet-list-item\" ng-class=\"$parent.$parent.facetValuePath==null?'facet':'facet-value'\">\n" +
    "\n" +
    "<!--                 <template-list style=\"list-style:none; display: inline; padding-left: 0px;\" templates=\"plugins\" data=\"facet\" context=\"pluginContext\"></template-list> -->\n" +
    "                Plugins: {{plugins}}\n" +
    "                <ul ng-show=\"plugins.length > 0\">\n" +
    "                    <li style=\"display: inline;\" ng-repeat=\"plugin in plugins\">\n" +
    "                        <div compile=\"plugin\"></div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "\n" +
    "                <div ng-show=\"$parent.$parent.facetValuePath==null\">\n" +
    "                    <button style=\"text-align: left;\" class=\"btn btn-default btn-label facet-list-item-btn\" type=\"button\" ng-click=\"$parent.$parent.breadcrumb.property = item.property.getUri()\">\n" +
    "                        <span class=\"glyphicon glyphicon glyphicon-record\"></span>\n" +
    "                        {{item.labelInfo.displayLabel || $parent.$parent.NodeUtils.toPrettyString(item.property)}}\n" +
    "                        <span class=\"counter\"> {{item.valueCountInfo.hasMoreItems ? '...' : '' + item.valueCountInfo.count}}</span>\n" +
    "                    </button>\n" +
    "                    <button class=\"btn btn-default facet-list-item-btn pull-right\" type=\"button\" ng-click=\"$parent.$parent.descendFacet(item.property)\">\n" +
    "                        <span class=\"glyphicon glyphicon-chevron-down\"></span>\n" +
    "                    </button>\n" +
    "                    <div class=\"clearfix\"></div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div ng-show=\"$parent.$parent.facetValuePath!=null\">\n" +
    "                    <button ng-class=\"item.isConstrainedEqual ? 'btn-primary' : 'btn-default'\" style=\"margin-bottom: -1px; text-align: left;\" class=\"btn btn-label facet-list-item-btn\" type=\"button\" ng-click=\"$parent.$parent.toggleConstraint(item.node)\">\n" +
    "                        <span class=\"glyphicon glyphicon glyphicon-record facet-value\"></span>\n" +
    "                        {{$parent.$parent.NodeUtils.toPrettyString(item.node)}}\n" +
    "                        <span class=\"counter\"> {{item.countInfo.hasMoreItems ? '...' : '' + item.countInfo.count}}</span>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "\n" +
    "            </li>\n" +
    "        </jassa-list>\n" +
    "\n" +
    "    <div class=\"constraints\">\n" +
    "        <constraint-list\n" +
    "            ng-show=\"showConstraints\"\n" +
    "            sparql-service=\"sparqlService\"\n" +
    "            facet-tree-config=\"facetTreeConfig\"\n" +
    "        ></constraint-list>\n" +
    "    </div>\n" +
    "\n" +
    "</div>");
}]);
