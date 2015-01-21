angular.module("template/geometry-input/geometry-input-typeahead.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/geometry-input/geometry-input-typeahead.html",
    "<div class=\"typeahead-group-header\" ng-if=\"match.model.firstInGroup\">Source: {{match.model.group}}</div>\n" +
    "<a>\n" +
    "  <span ng-bind-html=\"match.label | typeaheadHighlight:query\"></span>\n" +
    "</a>");
}]);
