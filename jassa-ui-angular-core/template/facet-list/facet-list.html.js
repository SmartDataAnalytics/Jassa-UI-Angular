angular.module("template/facet-list/facet-list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facet-list/facet-list.html",
    "<div>\n" +
    "\n" +
    "    <!-- Notification when service is missing -->\n" +
    "    <div ng-if=\"!ls.ctrl.listService\" class=\"alert alert-info\">\n" +
    "        <span class=\"glyphicon glyphicon-exclamation-sign\"></span>\n" +
    "        No service configured (yet).\n" +
    "    </div>\n" +
    "\n" +
    "<!-- Loading - data: {{ls.loading.data}} - pages: {{ls.loading.pageCount}} -->\n" +
    "\n" +
    "    <!-- Breadcrumb -->\n" +
    "<!--     <breadcrumb sparql-service=\"sparqlService\" ng-model=\"breadcrumb\"></breadcrumb> -->\n" +
    "    <breadcrumb ng-show=\"!showConstraints\" lookup-service=\"lookupServiceNodeLabels\" ng-model=\"breadcrumb\"></breadcrumb>\n" +
    "\n" +
    "\n" +
    "    <!-- Filter and Limit -->\n" +
    "    <form role=\"form\" class=\"form-inline\" ng-submit=\"ls.ctrl.filter.concept=filterModel; listFilter.offset=0\" novalidate>\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"col-sm-7\">\n" +
    "                <div class=\"input-group\">\n" +
    "                    <input ng-model=\"filterModel\" type=\"text\" class=\"form-control facet-filter\" placeholder=\"Find ...\">\n" +
    "                    <span ng-if=\"ls.ctrl.filter.concept\" class=\"input-group-btn facet-filter-submit\">\n" +
    "                        <button class=\"btn btn-default\" type=\"button\" ng-click=\"ls.ctrl.filter.concept=''\"><span class=\"glyphicon glyphicon glyphicon-remove-circle\"></span></button>\n" +
    "                    </span>\n" +
    "                    <span class=\"input-group-btn facet-filter-submit\">\n" +
    "                        <button type=\"submit\" class=\"btn btn-default\" type=\"button\"><span class=\"glyphicon glyphicon-search\"></span></button>\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col-sm-5\">\n" +
    "                <div class=\"input-group\" ng-init=\"showOptions=[{value: 10, label: '10'}, {value: 25, label: '25'}, {value: 50, label: '50'}, {value: 100, label: '100'}]\">\n" +
    "                    <span class=\"input-group-addon\">Show </span>\n" +
    "                    <select class=\"form-control\" type=\"text\" ng-model=\"ls.ctrl.filter.limit\"  ng-model-options=\"showOptions\" ng-options=\"option.value as option.label for option in showOptions\"></select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </form>\n" +
    "\n" +
    "    <div ng-show=\"ls.ctrl.filter.concept.length > 0\" style=\"margin: 5px 0 0 10px; color: #aaa;\">\n" +
    "        <span ng-show=\"ls.loading.data || ls.loading.pageCount\">Filtering by</span><span ng-hide=\"ls.loading.data || ls.loading.pageCount\">Filtered by </span> '{{ls.ctrl.filter.concept}}'\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Navigation buttons -->\n" +
    "    <div style=\"width: 100%\">\n" +
    "        <button ng-show=\"!showConstraints && mode.type.facetValue\" class=\"btn btn-default facet-list-item-btn pull-left\" role=\"button\" ng-click=\"breadcrumb.property = null\"><span class=\"glyphicon glyphicon-chevron-left\"></span> Back</button>\n" +
    "        <button ng-show=\"!showConstraints && !mode.type.facetValue && !breadcrumb.pathHead.getPath().isEmpty()\" class=\"btn btn-default facet-list-item-btn pull-left\" role=\"button\" ng-click=\"breadcrumb.pathHead = breadcrumb.pathHead.up()\"><span class=\"glyphicon glyphicon-chevron-left\"></span> Up</button>\n" +
    "\n" +
    "        <button ng-show=\"!showConstraints\" class=\"btn btn-default facet-list-item-btn pull-right\" href=\"\" ng-click=\"showConstraints=!showConstraints\">Constraints <span class=\"counter\">{{totalConstraints == null ? '?' : totalConstraints}}</span> <span class=\"glyphicon glyphicon-align-justify\"></span></button>\n" +
    "        <button ng-show=\"showConstraints\" class=\"btn btn-default facet-list-item-btn pull-right\" href=\"\" ng-click=\"showConstraints=!showConstraints\">Facets <span class=\"glyphicon glyphicon-th-large\"></span></button>\n" +
    "\n" +
    "        <div class=\"clearfix\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- TODO Loading data icon -->\n" +
    "    <!-- Paginator -->\n" +
    "    <div style=\"width: 100%; text-align: center\">\n" +
    "        <span ng-show=\"ls.loading.pageCount\" class=\"glyphicon glyphicon-refresh\"></span>\n" +
    "\n" +
    "        <pagination ng-show=\"!ls.loading.pageCount && ls.state.paging.numPages > 1\" class=\"pagination pagination-sm\" paging-model=\"ls\" paging-style=\"pagingStyle\"></pagination>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Pagination status -->\n" +
    "    <span ng-show=\"!ls.loading.pageCount\" style=\"margin: 5px 0 0 10px; color: #aaa;\">\n" +
    "    Showing {{ls.state.items.length}} entries in the positions {{(ls.state.paging.currentPage - 1) * ls.state.filter.limit + (ls.state.items.length ? 1 : 0)}} - {{(ls.state.paging.currentPage - 1) * ls.state.filter.limit + ls.state.items.length}} out of {{ls.state.paging.totalItems}} items in total.\n" +
    "    </span>\n" +
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
    "    <ul ng-show=\"!ls.loading.data\" class=\"list-group facet-list\">\n" +
    "        <li ng-repeat=\"item in ls.state.items\" class=\"list-group-item facet-list-item visible-on-hover-parent\" ng-class=\"facetValuePath==null?'facet':'facet-value'\">\n" +
    "            <div ng-include=\"mode.itemTemplate\"></div>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <ul ng-show=\"ls.loading.data\" class=\"list-group facet-list\">\n" +
    "        <li class=\"list-group-item facet-list-item\" style=\"text-align: center\">\n" +
    "            <span class=\"glyphicon glyphicon-refresh\"></span>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "\n" +
    "\n" +
    "    <div ng-show=\"showConstraints\" style=\"width: 100%\">\n" +
    "        <button style=\"text-align: left; width: 100%\" ng-class=\"constraintManager.getConstraints().length ? '' : 'disabled'\" class=\"btn btn-warning\" type=\"button\" ng-click=\"constraintManager.clear()\">\n" +
    "            <span class=\"glyphicon glyphicon-remove-circle\"></span> Clear Filters\n" +
    "        </button>\n" +
    "    </div>\n" +
    "\n" +
    "</div>");
}]);
