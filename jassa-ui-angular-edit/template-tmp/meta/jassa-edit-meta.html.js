angular.module("template/meta/jassa-edit-meta.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/meta/jassa-edit-meta.html",
    "<div class=\"input-group {{rdfTermId}}\">\n" +
    "  <span class=\"input-group-addon\">\n" +
    "    <i ng-if=\"isPlainTermType(rdfTermType)\" class=\"icon fa fa-file\"></i>\n" +
    "    <i ng-if=\"isTypedTermType(rdfTermType)\" class=\"icon fa fa-file\"></i>\n" +
    "    <i ng-if=\"isUriTermType(rdfTermType)\" class=\"icon fa fa-bookmark\"></i>\n" +
    "  </span>\n" +
    "  <div class=\"input-group-btn\">\n" +
    "    <button type=\"button\" class=\"btn btn-default dropdown-toggle no-border-radius\" data-toggle=\"dropdown\" tabindex=\"-1\">\n" +
    "      <span class=\"currentRdfTermTypeValue\">{{rdfTermTypeValue}}</span>\n" +
    "      <span class=\"caret\"></span>\n" +
    "      <span class=\"sr-only\">Toggle Dropdown</span>\n" +
    "    </button>\n" +
    "    <ul class=\"dropdown-menu dropdown-menu-left\" role=\"menu\">\n" +
    "      <li ng-repeat=\"(key,value) in rdfTermTypeTags\"><a ng-click=\"setRdfTermType(key)\" href=\"#\">{{value}}</a></li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "  <jassa-switch-lang ng-if=\"isPlainTermType(rdfTermType)\" ng-model=\"lang\" value-store=\"valueStore\"></jassa-switch-lang>\n" +
    "  <jassa-switch-type ng-if=\"isTypedTermType(rdfTermType)\" ng-model=\"type\" value-store=\"valueStore\"></jassa-switch-type>\n" +
    "  <input type=\"text\" class=\"form-control margin-left-1\" ng-model=\"termValue\" ></input>\n" +
    "</div>");
}]);
