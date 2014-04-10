angular.module("template/facet-tree/facet-dir-content.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facet-tree/facet-dir-content.html",
    "\n" +
    "<!-- ng-show=\"dirset.pageCount > 1 || dirset.children.length > 5\" -->\n" +
    "\n" +
    "\n" +
    "<!--                 		<div ng-show=\"dirset.pageCount != 1\" style=\"width:100%; background-color: #eeeeff\"> -->\n" +
    "<!--     		         		<pagination style=\"padding-left: {{16 * (dirset.path.getLength() + 1)}}px\" class=\"pagination-tiny\" max-size=\"7\" total-items=\"dirset.childFacetCount\" page=\"dirset.pageIndex\" boundary-links=\"true\" rotate=\"false\" on-select-page=\"selectFacetPage(page, facet)\" first-text=\"<<\" previous-text=\"<\" next-text=\">\" last-text=\">>\"></pagination> -->\n" +
    "<!--                 		</div> -->\n" +
    "\n" +
    "<span ng-show=\"dirset.children.length == 0\"\n" +
    "	style=\"color: #aaaaaa; padding-left: {{16*(dirset.path.getLength()+1)}}px\">(no\n" +
    "	entries)</span>\n" +
    "\n" +
    "<div style=\"padding-left: {{16*(dirset.path.getLength()+1)}}px\"\n" +
    "	ng-repeat=\"facet in dirset.children\"\n" +
    "	ng-include=\"'template/facet-tree/facet-tree-item.html'\" ></div>\n" +
    "\n" +
    "\n" +
    "");
}]);
