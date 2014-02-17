angular.module("template/constraint-list/constraint-list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/constraint-list/constraint-list.html",
    "<ul>\n" +
    "  	<li ng-show=\"constraints.length == 0\" style=\"color: #aaaaaa;\">(no constraints)</li>\n" +
    "   	<li ng-repeat=\"constraint in constraints\"><a href=\"\" ng-click=\"removeConstraint(constraint)\">{{constraint.label}}</a></li>\n" +
    "</ul>\n" +
    "");
}]);
