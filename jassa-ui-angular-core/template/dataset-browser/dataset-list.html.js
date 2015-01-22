angular.module("template/dataset-browser/dataset-list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/dataset-browser/dataset-list.html",
    "<!-- <ul class=\"media-list\"> -->\n" +
    "    <li class=\"media\" ng-repeat=\"item in items\">\n" +
    "        <a class=\"pull-left\" href=\"#\">\n" +
    "            <div class=\"thumbnail thumbnail-center\" style=\"width: 100px; height: 100px;\">\n" +
    "                <div class=\"thumbnail-wrapper\">\n" +
    "                    <img ng-src=\"{{item.depiction}}\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </a>\n" +
    "\n" +
    "        <div class=\"media-body\">\n" +
    "\n" +
    "            <b>{{item.label || 'Sorry, there is no title available in your preferred languages'}}</b> <a href=\"{{item.id}}\" target=\"_blank\"><span class=\"glyphicon glyphicon-new-window\"></span></a>\n" +
    "            <br />\n" +
    "            <span bind-html-unsafe=\"item.comment || 'Sorry, there is no description available in your preferred languages' | typeaheadHighlight:searchString\"></span>\n" +
    "            <hr />\n" +
    "            <ul class=\"list-inline\">\n" +
    "                <li ng-repeat=\"resource in item.resources\" ng-show=\"resource.items.length\">\n" +
    "                    <a href=\"\" ng-click=\"item.showTab=(item.showTab===$index ? -1 : $index)\"><span class=\"label\" ng-class=\"item.showTab===$index ? 'label-success' : 'label-default'\">{{resource.items.length}} {{resource.label}}</span></a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "\n" +
    "            <div style=\"margin-top: 5px\">\n" +
    "                <div ng-repeat=\"resource in item.resources\">\n" +
    "                    <div class=\"panel panel-default\" ng-show=\"$index===item.showTab\" ng-init=\"dists=resource.items\">\n" +
    "                        <div class=\"panel-heading\">{{resource.label}}</div>\n" +
    "                        <div class=\"panel-body\">\n" +
    "                            <div ng-include=\"resource.template\"></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </li>\n" +
    "    <li ng-show=\"!items.length\" class=\"alert alert-danger\" style=\"text-align: center\" role=\"alert\">No results</li>\n" +
    "<!-- </ul> -->\n" +
    "");
}]);
