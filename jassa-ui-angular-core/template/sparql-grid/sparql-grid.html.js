angular.module("template/sparql-grid/sparql-grid.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/sparql-grid/sparql-grid.html",
    "<div>\n" +
    "<div ng-grid=\"gridOptions\"></div>\n" +
    "</div>\n" +
    "");
}]);
