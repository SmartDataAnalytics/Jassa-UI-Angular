angular.module("template/lang-select/lang-select.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/lang-select/lang-select.html",
    "<ul class=\"list-inline\">\n" +
    "    <li>\n" +
    "        <ul ui-sortable=\"sortConfig\" ng-model=\"langs\" class=\"list-inline\">\n" +
    "            <li class=\"lang-item\" ng-repeat=\"lang in langs\"><span class=\"label label-success preserve-whitespace\">{{lang.length ? lang : '  '}}</span></li>\n" +
    "        </ul>\n" +
    "    </li>\n" +
    "    <li ng-show=\"showLangInput\">\n" +
    "        <form ng-submit=\"confirmAddLang(newLang)\" ui-keydown=\"{esc: 'showLangInput=false'}\">\n" +
    "            <input auto-focus=\"focusLangInput\" size=\"4\" ng-model=\"newLang\" type=\"text\" class=\"lang-borderless\" typeahead=\"lang for lang in getLangSuggestions() | filter:$viewValue | limitTo:8\">\n" +
    "            <button type=\"submit\" style=\"cursor: pointer;\" class=\"btn label label-info\"\"><span class=\"glyphicon glyphicon-ok\"></span></button>\n" +
    "            <button type=\"reset\" style=\"cursor: pointer;\" class=\"btn label label-warning\" ng-click=\"showLangInput=false\"><span class=\"glyphicon glyphicon-remove\"></span></button>\n" +
    "        </form>\n" +
    "    </li>\n" +
    "    <li>\n" +
    "        <button type=\"button\" ng-show=\"!showLangInput\" style=\"cursor: pointer;\" class=\"btn label label-primary\" ng-click=\"showLangInput=true; focusLangInput=true\"><span class=\"glyphicon glyphicon-plus\"></span></button>\n" +
    "    </li>\n" +
    "<ul>\n" +
    "\n" +
    "");
}]);
