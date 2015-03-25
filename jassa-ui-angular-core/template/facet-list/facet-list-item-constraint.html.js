angular.module("template/facet-list/facet-list-item-constraint.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facet-list/facet-list-item-constraint.html",
    "<div style=\"width: 100%\">\n" +
    "    <button style=\"text-align: left; width: 100%\" class=\"btn btn-label facet-list-item-btn\" type=\"button\" ng-click=\"constraintManager.removeConstraint(item.constraint)\">\n" +
    "        <span class=\"glyphicon glyphicon glyphicon-record facet-value\"></span>\n" +
    "        {{item.displayLabel}}\n" +
    "    </button>\n" +
    "</div>\n" +
    "");
}]);
