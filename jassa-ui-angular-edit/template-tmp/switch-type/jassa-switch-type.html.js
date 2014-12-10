angular.module("template/switch-type/jassa-switch-type.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/switch-type/jassa-switch-type.html",
    "<div class=\"input-group-btn\">\n" +
    "  <!--button type=\"button\" class=\"btn btn-default no-border-radius\" tabindex=\"-1\">{{datatype.length === 0 ? \"No Datatype\" : datatype}}</button-->\n" +
    "  <button type=\"button\" class=\"btn btn-default dropdown-toggle no-border-radius margin-left-1\" data-toggle=\"dropdown\" tabindex=\"-1\">\n" +
    "    <span>{{datatype.length === 0 ? \"No Datatype\" : datatype}}</span>\n" +
    "    <span class=\"caret\"></span>\n" +
    "    <span class=\"sr-only\">Toggle Dropdown</span>\n" +
    "  </button>\n" +
    "  <ul class=\"dropdown-menu dropdown-menu-left\" role=\"menu\">\n" +
    "    <li><a ng-click=\"setDatatype()\" href=\"#\">none</a></li>\n" +
    "    <li ng-repeat=\"(key,value) in datatypeTags\"><a ng-click=\"setDatatype(key)\" href=\"#\">{{value}}</a></li>\n" +
    "  </ul>\n" +
    "</div>");
}]);
