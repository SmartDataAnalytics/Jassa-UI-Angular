angular.module("template/map/jassa-edit-map.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/map/jassa-edit-map.html",
    "<div id=\"jassa-edit-map\" style=\"height:375px;\">\n" +
    "  <input type=\"radio\" value=\"point\" name=\"geometry\" ng-model=\"chooseGeometry\" /><label>Point</label>\n" +
    "  <input type=\"radio\" value=\"line\" name=\"geometry\" ng-model=\"chooseGeometry\" /><label>Line</label>\n" +
    "  <input type=\"radio\" value=\"polygon\" name=\"geometry\" ng-model=\"chooseGeometry\" /><label>Polygon</label>\n" +
    "  <input type=\"radio\" value=\"box\" name=\"geometry\" ng-model=\"chooseGeometry\" /><label>Box</label><input type=\"text\" class=\"form-control\" ng-model=\"wkt\" />\n" +
    "  <div id=\"openlayers-map\" style=\"width: 100%; height: 300px;\"></div>\n" +
    "</div>\n" +
    "");
}]);
