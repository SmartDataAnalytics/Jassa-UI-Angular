angular.module("template/facettree/facet-dir-content.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facettree/facet-dir-content.html",
    "\n" +
    "<!-- ng-show=\"dirset.pageCount > 1 || dirset.children.length > 5\" -->\n" +
    "\n" +
    "<div style=\"width: 100%; background-color: #eeeeff;\">\n" +
    "	<div style=\"padding-right: 16px; padding-left: {{16*(dirset.path.getLength()+1)}}px\">\n" +
    "\n" +
    "		<form class=\"form-inline\" role=\"form\" ng-submit=\"doFilter(dirset.path, dirset.filter.filterString)\">\n" +
    "\n" +
    "			<div class=\"form-group\">\n" +
    "				<input type=\"text\" class=\"form-control input-sm\" placeholder=\"Filter\" ng-model=\"dirset.filter.filterString\" value=\"{{dirset.filter.filterString}}\" />\n" +
    "			</div>\n" +
    "			<div class=\"form-group\">\n" +
    "				<button type=\"submit\" class=\"btn btn-default input-sm\">Filter</button>\n" +
    "			</div>\n" +
    "			<div class=\"form-group\" ng-if=\"dirset.pageCount > 1\" style=\"background-color: #eeeeff\">\n" +
    "				<pagination\n" +
    "					style=\"padding-left: {{16*(dirset.path.getLength()+1)}}px\"\n" +
    "					class=\"pagination-tiny\" max-size=\"7\"\n" +
    "					total-items=\"dirset.childFacetCount\" page=\"dirset.pageIndex\"\n" +
    "					boundary-links=\"true\" rotate=\"false\"\n" +
    "					on-select-page=\"selectFacetPage(page, facet)\" first-text=\"<<\"\n" +
    "					previous-text=\"<\" next-text=\">\" last-text=\">>\" />\n" +
    "			</div>\n" +
    "\n" +
    "		</form>\n" +
    "	</div>\n" +
    "</div>\n" +
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
    "	ng-include=\"'template/facettree/facet-tree-item.html'\" ></div>\n" +
    "\n" +
    "\n" +
    "");
}]);
