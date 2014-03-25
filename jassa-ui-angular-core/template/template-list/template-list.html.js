angular.module("template/template-list/template-list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/template-list/template-list.html",
    "<ul ng-show=\"templates.length > 0\">\n" +
    "</ul>");
}]);
