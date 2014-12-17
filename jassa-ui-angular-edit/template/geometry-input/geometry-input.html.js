angular.module("template/geometry-input/geometry-input.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/geometry-input/geometry-input.html",
    "<div class=\"geometry-input\" style=\"height:375px;\">\n" +
    "  <div>\n" +
    "    <input type=\"radio\" value=\"point\" name=\"geometry\" ng-model=\"geometry\" /><label>Point</label>\n" +
    "    <input type=\"radio\" value=\"line\" name=\"geometry\" ng-model=\"geometry\" /><label>Line</label>\n" +
    "    <input type=\"radio\" value=\"polygon\" name=\"geometry\" ng-model=\"geometry\" /><label>Polygon</label>\n" +
    "    <input type=\"radio\" value=\"box\" name=\"geometry\" ng-model=\"geometry\" /><label>Box</label>\n" +
    "  </div>\n" +
    "  <input ng-model=\"searchString\" class=\"form-control\" type=\"text\" placeholder=\"Search for a place\"/>\n" +
    "  <div class=\"map\" style=\"width: 100%; height: 300px;\"></div>\n" +
    "</div>");
}]);
