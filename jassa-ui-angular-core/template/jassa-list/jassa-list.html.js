angular.module("template/jassa-list/jassa-list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/jassa-list/jassa-list.html",
    "<div>\n" +
    "    <ul ng-show=\"loading.data\" class=\"list-group\">\n" +
    "        <li class=\"list-group-item\" style=\"text-align: center;\">\n" +
    "            <span class=\"glyphicon glyphicon-refresh\"></span>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <ul ng-show=\"!loading.data\" ng-class=\"listClass\" style=\"width: 100%;\">\n" +
    "        <ng-transclude></ng-transclude>\n" +
    "    </ul>\n" +
    "\n" +
    "\n" +
    "    <div style=\"width: 100%; text-align: center\">\n" +
    "        <span ng-show=\"loading.pageCount\" class=\"glyphicon glyphicon-refresh\"></span>\n" +
    "\n" +
    "<!--         <script id=\"template/pagination/pagination.html\" type=\"text/ng-template\"> -->\n" +
    "\n" +
    "        <pagination\n" +
    "            ng-hide=\"loading.pageCount || numPages() <= 1\"\n" +
    "            ng-model=\"currentPage\"\n" +
    "            page=\"currentPage\"\n" +
    "            items-per-page=\"listFilter.limit\"\n" +
    "            total-items=\"totalItems\"\n" +
    "\n" +
    "            class=\"pagination\"\n" +
    "            ng-class=\"paginationOptions.cssClass\"\n" +
    "            max-size=\"4\"\n" +
    "            boundary-links=\"paginationOptions.boundaryLinks\"\n" +
    "            rotate=\"paginationOptions.rotate\"\n" +
    "			direction-links=\"false\"\n" +
    "        ></pagination>\n" +
    "\n" +
    "<!--         </script> -->\n" +
    "<!--             first-text=\"paginationOptions.firstText\" -->\n" +
    "<!--             previous-text=\"paginationOptions.previousText\" -->\n" +
    "<!--             next-text=\"paginationOptions.nextText\" -->\n" +
    "<!--             last-text=\"paginationOptions.lastText\" -->\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);
