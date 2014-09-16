angular.module("template/jassa-media-list/jassa-media-list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/jassa-media-list/jassa-media-list.html",
    "<div style=\"width: 100%\">\n" +
    "\n" +
    "    <div style=\"width: 100%; text-align: center\">\n" +
    "        <pagination\n" +
    "            ng-show=\"items.length\"\n" +
    "            class=\"pagination\"\n" +
    "            ng-model=\"currentPage\"\n" +
    "            page=\"currentPage\"\n" +
    "            items-per-page=\"limit\"\n" +
    "            total-items=\"totalItems\"\n" +
    "            max-size=\"maxSize\"\n" +
    "            boundary-links=\"true\"\n" +
    "            rotate=\"false\"\n" +
    "            first-text=\"&lt;&lt;\"\n" +
    "            previous-text=\"&lt;\"\n" +
    "            next-text=\"&gt;\"\n" +
    "            last-text=\"&gt;&gt;\"\n" +
    "        ></pagination>\n" +
    "    </div>\n" +
    "\n" +
    "    <ul class=\"media-list\" style=\"width: 100%;\">\n" +
    "        <ng-transclude></ng-transclude>\n" +
    "    </ul>\n" +
    "\n" +
    "    <div style=\"width: 100%; text-align: center\">\n" +
    "        <pagination\n" +
    "            ng-show=\"items.length\"\n" +
    "            class=\"pagination\"\n" +
    "            ng-model=\"currentPage\"\n" +
    "            page=\"currentPage\"\n" +
    "            items-per-page=\"limit\"\n" +
    "            total-items=\"totalItems\"\n" +
    "            max-size=\"maxSize\"\n" +
    "            boundary-links=\"true\"\n" +
    "            rotate=\"false\"\n" +
    "            first-text=\"&lt;&lt;\"\n" +
    "            previous-text=\"&lt;\"\n" +
    "            next-text=\"&gt;\"\n" +
    "            last-text=\"&gt;&gt;\"\n" +
    "        ></pagination>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);
