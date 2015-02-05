angular.module("template/facet-list/facet-list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facet-list/facet-list.html",
    "<div>\n" +
    "\n" +
    "    <div ng-if=\"!ls.ctrl.listService\" class=\"alert alert-info\">\n" +
    "        <span class=\"glyphicon glyphicon-exclamation-sign\"></span>\n" +
    "        No service configured for the facet list.\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Breadcrumb -->\n" +
    "    <breadcrumb sparql-service=\"sparqlService\" ng-model=\"breadcrumb\"></breadcrumb>\n" +
    "\n" +
    "    <!-- Filter text input field -->\n" +
    "    <div>\n" +
    "        <form role=\"form\" ng-submit=\"ls.ctrl.filter.concept=filterModel; listFilter.offset=0\" novalidate>\n" +
    "            <div class=\"input-group\">\n" +
    "                <input ng-model=\"filterModel\" type=\"text\" class=\"form-control facet-filter\" placeholder=\"Find ...\">\n" +
    "                <span class=\"input-group-btn facet-filter-submit\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-default\" type=\"button\"><span class=\"glyphicon glyphicon-search\"></span></button>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "\n" +
    "        <div ng-show=\"ls.ctrl.filter.concept.length > 0\" style=\"margin: 5px 0 0 10px; color: #aaa;\"><span ng-show=\"ls.loading.data || ls.loading.pageCount\">Filtering by</span><span ng-hide=\"ls.loading.data || ls.loading.pageCount\">Filtered by </span> '{{ls.ctrl.filter.concept}}'</div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Navigation buttons -->\n" +
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
    "    <!-- TODO Loading data icon -->\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"input-group\" ng-init=\"showOptions=[{value: 10, label: '10'}, {value: 25, label: '25'}, {value: 50, label: '50'}, {value: 100, label: '100'}]\">\n" +
    "            <span class=\"input-group-addon\">Show: </span>\n" +
    "            <select class=\"form-control\" ng-model=\"ls.ctrl.filter.limit\"  ng-model-options=\"showOptions\" ng-options=\"option.value as option.label for option in showOptions\"></select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Paginator -->\n" +
    "    <div style=\"width: 100%; text-align: center\">\n" +
    "        <span ng-show=\"ls.loading.pageCount\" class=\"glyphicon glyphicon-refresh\"></span>\n" +
    "\n" +
    "        <pagination ng-show=\"ls.state.paging.numPages > 1\" class=\"pagination pagination-sm\" paging-model=\"ls\" paging-style=\"pagingStyle\"></pagination>\n" +
    "    </div>\n" +
    "\n" +
    "    <ul ng-show=\"!ls.state.items.length\" class=\"list-group facet-list\">\n" +
    "        <li class=\"list-group-item facet-list-item\" style=\"text-align: center\">\n" +
    "            <button class=\"btn btn-default btn-label facet-list-item-btn disabled\" type=\"button\">\n" +
    "                No results\n" +
    "            </button>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <!-- Data list -->\n" +
    "    <ul ng-show=\"!showConstraints && !ls.loading.data\" class=\"list-group facet-list\">\n" +
    "        <li ng-repeat=\"item in ls.state.items\" class=\"list-group-item facet-list-item show-on-hover-parent\" ng-class=\"facetValuePath==null?'facet':'facet-value'\">\n" +
    "\n" +
    "<!--                 <template-list style=\"list-style:none; display: inline; padding-left: 0px;\" templates=\"plugins\" data=\"facet\" context=\"pluginContext\"></template-list> -->\n" +
    "\n" +
    "            <div ng-show=\"facetValuePath==null\">\n" +
    "                <button style=\"text-align: left;\" class=\"btn btn-default btn-label facet-list-item-btn\" type=\"button\" ng-click=\"breadcrumb.property = item.property.getUri()\">\n" +
    "                    <span class=\"glyphicon glyphicon glyphicon-record\"></span>\n" +
    "                    {{item.labelInfo.displayLabel || NodeUtils.toPrettyString(item.property)}}\n" +
    "                    <span class=\"counter\"> {{item.valueCountInfo.hasMoreItems ? '...' : '' + item.valueCountInfo.count}}</span>\n" +
    "                </button>\n" +
    "                <button class=\"btn btn-default facet-list-item-btn pull-right\" type=\"button\" ng-click=\"descendFacet(item.property)\">\n" +
    "                    <span class=\"glyphicon glyphicon-chevron-down\"></span>\n" +
    "                </button>\n" +
    "\n" +
    "            <ul ng-show=\"plugins.length > 0\">\n" +
    "                <li style=\"display: inline;\" ng-repeat=\"plugin in plugins\">\n" +
    "                    <div compile=\"plugin\"></div>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "\n" +
    "                <div class=\"clearfix\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-show=\"facetValuePath!=null\">\n" +
    "                <button ng-class=\"item.isConstrainedEqual ? 'btn-primary' : 'btn-default'\" style=\"margin-bottom: -1px; text-align: left;\" class=\"btn btn-label facet-list-item-btn\" type=\"button\" ng-click=\"toggleConstraint(item.node)\">\n" +
    "                    <span class=\"glyphicon glyphicon glyphicon-record facet-value\"></span>\n" +
    "                    {{NodeUtils.toPrettyString(item.node)}}\n" +
    "                    <span class=\"counter\"> {{item.countInfo.hasMoreItems ? '...' : '' + item.countInfo.count}}</span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <!-- Constraints -->\n" +
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
