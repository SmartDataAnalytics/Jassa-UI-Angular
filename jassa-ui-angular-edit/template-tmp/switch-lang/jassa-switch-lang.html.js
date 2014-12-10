angular.module("template/switch-lang/jassa-switch-lang.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/switch-lang/jassa-switch-lang.html",
    "<div class=\"input-group-btn\">\n" +
    "  <!--button type=\"button\" class=\"btn btn-default no-border-radius\" tabindex=\"-1\">{{language.length === 0 ? \"No Language\" : language}}</button-->\n" +
    "  <button type=\"button\" class=\"btn btn-default dropdown-toggle no-border-radius margin-left-1\" data-toggle=\"dropdown\" tabindex=\"-1\">\n" +
    "    <span>{{language.length === 0 ? \"No Language\" : language}}</span>\n" +
    "    <span class=\"caret\"></span>\n" +
    "    <span class=\"sr-only\">Toggle Dropdown</span>\n" +
    "  </button>\n" +
    "  <ul class=\"dropdown-menu dropdown-menu-left\" role=\"menu\">\n" +
    "    <li><a ng-click=\"setLanguage()\" href=\"#\">none</a></li>\n" +
    "    <li ng-repeat=\"tag in languageTags\"><a ng-click=\"setLanguage(tag)\" href=\"#\">{{tag}}</a></li>\n" +
    "  </ul>\n" +
    "</div>");
}]);
