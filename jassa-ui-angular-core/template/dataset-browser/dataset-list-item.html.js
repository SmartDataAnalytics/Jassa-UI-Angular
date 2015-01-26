angular.module("template/dataset-browser/dataset-list-item.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/dataset-browser/dataset-list-item.html",
    "<!-- <ul class=\"media-list\"> -->\n" +
    "    <li class=\"media\" ng-repeat=\"item in items\">\n" +
    "        <ng-include src=\"'template/dataset-browser/dataset-item.html'\"></ng-include>\n" +
    "    </li>\n" +
    "    <li ng-show=\"!items.length\" class=\"alert alert-danger\" style=\"text-align: center\" role=\"alert\">No results</li>\n" +
    "<!-- </ul> -->\n" +
    "");
}]);
