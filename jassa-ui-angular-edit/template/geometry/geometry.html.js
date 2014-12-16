angular.module("template/geometry/geometry.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/geometry/geometry.html",
    "<div id=\"jassa-edit-map\" style=\"height:375px;\">\n" +
    "  <input type=\"radio\" value=\"point\" name=\"geometry\" ng-model=\"geometry\" /><label>Point</label>\n" +
    "  <input type=\"radio\" value=\"line\" name=\"geometry\" ng-model=\"geometry\" /><label>Line</label>\n" +
    "  <input type=\"radio\" value=\"polygon\" name=\"geometry\" ng-model=\"geometry\" /><label>Polygon</label>\n" +
    "  <input type=\"radio\" value=\"box\" name=\"geometry\" ng-model=\"geometry\" /><label>Box</label>\n" +
    "  <!--input type=\"text\" class=\"form-control\" ng-model=\"wkt\" /-->\n" +
    "  <div id=\"openlayers-map\" style=\"width: 100%; height: 300px;\"></div>\n" +
    "</div>");
}]);
