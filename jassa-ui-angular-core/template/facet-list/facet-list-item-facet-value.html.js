angular.module("template/facet-list/facet-list-item-facet-value.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facet-list/facet-list-item-facet-value.html",
    "<div style=\"width: 100%\">\n" +
    "    <button ng-class=\"item.isConstrainedEqual ? 'btn-primary' : 'btn-default'\" style=\"text-align: left; width: 100%\" class=\"btn btn-label facet-list-item-btn\" type=\"button\" ng-click=\"toggleConstraint(item.node)\">\n" +
    "        <span class=\"glyphicon glyphicon glyphicon-record facet-value\"></span>\n" +
    "        {{item.labelInfo.displayLabel || NodeUtils.toPrettyString(item.node)}}\n" +
    "        <span class=\"counter\"> {{item.countInfo.hasMoreItems ? '...' : '' + item.countInfo.count}}</span>\n" +
    "    </button>\n" +
    "</div>\n" +
    "");
}]);
