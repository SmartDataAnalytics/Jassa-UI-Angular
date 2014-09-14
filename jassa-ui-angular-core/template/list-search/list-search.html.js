angular.module("template/list-search/list-search.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/list-search/list-search.html",
    "<form role=\"form\" ng-submit=\"onSubmit()\" novalidate>\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"input-group\">\n" +
    "            <input\n" +
    "                ng-model=\"ngModel\"\n" +
    "                type=\"text\"\n" +
    "                class=\"form-control\"\n" +
    "                placeholder=\"Find ...\">\n" +
    "\n" +
    "            <div class=\"input-group-btn\">\n" +
    "                <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">{{activeSearchMode.label}} <span class=\"caret\"></span></button>\n" +
    "                <ul class=\"dropdown-menu dropdown-menu-right\" role=\"menu\">\n" +
    "                    <li ng-repeat=\"searchMode in searchModes\"><a ng-click=\"setActiveSearchMode(searchMode)\" href=\"#\"><span bind-html-unsafe=\"searchMode.label\"></span></a></li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "\n" +
    "            <span class=\"input-group-btn\">\n" +
    "                <button type=\"submit\" class=\"btn btn-default\" type=\"button\"><span class=\"glyphicon glyphicon-search\"></span></button>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "");
}]);
