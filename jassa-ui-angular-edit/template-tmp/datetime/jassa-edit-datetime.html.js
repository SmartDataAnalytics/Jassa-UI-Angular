angular.module("template/datetime/jassa-edit-datetime.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/datetime/jassa-edit-datetime.html",
    "<div class=\"input-group\">\n" +
    "  <!--div class=\"input-group-btn\">\n" +
    "          <button type=\"button\" class=\"btn btn-default\" tabindex=\"-1\">Date</button>\n" +
    "  <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" tabindex=\"-1\">\n" +
    "          <span class=\"caret\"></span>\n" +
    "  <span class=\"sr-only\">Toggle Dropdown</span>\n" +
    "  </button>\n" +
    "  <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "          <li><a href=\"#\">Date</a></li>\n" +
    "  <li><a href=\"#\">Time</a></li>\n" +
    "  <li><a href=\"#\">Date & Time</a></li>\n" +
    "  </ul>\n" +
    "  </div-->\n" +
    "  <span class=\"input-group-addon\"><i class=\"icon fa\"></i></span>\n" +
    "  <div class=\"input-group-btn\">\n" +
    "    <!--button type=\"button\" class=\"btn btn-default no-border-radius\" tabindex=\"-1\">{{datatype.length === 0 ? \"No Datatype\" : datatype}}</button-->\n" +
    "    <button type=\"button\" class=\"btn btn-default dropdown-toggle no-border-radius\" data-toggle=\"dropdown\" tabindex=\"-1\">\n" +
    "      <span>{{datatype.length === 0 ? \"No Datatype\" : datatype}}</span>\n" +
    "      <span class=\"caret\"></span>\n" +
    "      <span class=\"sr-only\">Toggle Dropdown</span>\n" +
    "    </button>\n" +
    "    <ul class=\"dropdown-menu dropdown-menu-left\" role=\"menu\">\n" +
    "      <!--li><a ng-click=\"setDatatype()\" href=\"#\">none</a></li-->\n" +
    "      <li ng-repeat=\"(key,value) in datatypeTags\"><a ng-click=\"setDatatype(key)\" href=\"#\">{{value}}</a></li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "  <input type=\"text\" class=\"form-control margin-left-1\" ng-model=\"typedValue\"></input>\n" +
    "</div>");
}]);
