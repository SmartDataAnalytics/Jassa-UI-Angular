angular.module("template/sparql-table/sparql-table.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/sparql-table/sparql-table.html",
    "<div>\n" +
    "<div ng-grid=\"gridOptions\"></div>\n" +
    "</div>\n" +
    "");
}]);
