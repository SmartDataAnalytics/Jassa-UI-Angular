angular.module("template/dataset-browser/distribution-list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/dataset-browser/distribution-list.html",
    "<ul class=\"list-inline\">\n" +
    "    <li ng-repeat=\"dist in dists\">\n" +
    "        <a class=\"btn btn-primary\" ng-init=\"href=context.buildAccessUrl(dist.accessUrl, dist.graphs)\" ng-href=\"{{href}}\" target=\"_blank\">\n" +
    "            {{dist.accessUrl}}\n" +
    "            <ul style=\"list-style-type: none;\">\n" +
    "                <li ng-repeat=\"graph in dist.graphs\">{{graph}}</li>\n" +
    "            </ul>\n" +
    "        </a>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);
