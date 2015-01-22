angular.module("template/dataset-browser/dataset-browser.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/dataset-browser/dataset-browser.html",
    "<div>\n" +
    "<jassa-list-browser\n" +
    "    list-service=\"listService\"\n" +
    "    offset=\"offset\"\n" +
    "    limit=\"limit\"\n" +
    "    filter=\"filter\"\n" +
    "    do-filter=\"doFilter\"\n" +
    "    total-items=\"totalItems\"\n" +
    "    items=\"items\"\n" +
    "    langs=\"langs\"\n" +
    "    availableLangs=\"availableLangs\"\n" +
    "    search-modes=\"searchModes\"\n" +
    "    active-search-mode=\"activeSearchMode\"\n" +
    "    context=\"context\"\n" +
    "    item-template=\"itemTemplate\"\n" +
    "></jassa-list-browser>\n" +
    "</div>\n" +
    "");
}]);
