angular.module("template/rdf-term-input/rdf-term-input.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/rdf-term-input/rdf-term-input.html",
    "<div class=\"input-group\">\n" +
    "\n" +
    "  <!-- Note: On some occasions its useful to remove the parent element of this directive for layouting with bootstrap\n" +
    "       For this reason we can't use ng-form on the parent, and instead have to duplicate it for each input-group-addon :/\n" +
    "   -->\n" +
    "\n" +
    "  <!-- Term type selector -->\n" +
    "  <div ng-form=\"forms.type\" class=\"input-group-addon\" style=\"padding: 0px 0px !important;\">\n" +
    "    <ui-select name=\"value\" ng-model=\"state.type\" ng-model-options=\"ngModelOptions\" ng-disabled=\"disabled\" theme=\"selectize\"  reset-search-input=\"false\" style=\"width: 100px;line-height:0;\" >\n" +
    "      <ui-select-match placeholder=\"Termtype\">{{$select.selected.displayLabel}}</ui-select-match>\n" +
    "      <ui-select-choices style=\"z-index: 999;\" repeat=\"item.id as item in termTypes | filter: $select.search\">\n" +
    "        <span ng-bind-html=\"item.displayLabel | highlight: $select.search\"></span>\n" +
    "      </ui-select-choices>\n" +
    "    </ui-select>\n" +
    "  </div>\n" +
    "  <!-- Datatype selector -->\n" +
    "  <div ng-form=\"forms.datatype\" ng-show=\"state.type===vocab.typedLiteral\" class=\"input-group-addon\" style=\"border-left: 0px; padding: 0px 0px !important;\">\n" +
    "    <ui-select name=\"value\" ng-model=\"state.datatype\" ng-model-options=\"ngModelOptions\" ng-disabled=\"disabled\" theme=\"selectize\" tagging=\"addDatatype\" reset-search-input=\"false\" style=\"width: 100px;line-height:0;\" >\n" +
    "      <ui-select-match placeholder=\"Datatype\">{{$select.selected.displayLabel}}</ui-select-match>\n" +
    "      <!--ui-select-choices repeat=\"item in datatypes | filter: $select.search\" refresh=\"refreshDatatype($select.search)\" refresh-delay=\"100\"-->\n" +
    "      <ui-select-choices style=\"z-index: 999;\" repeat=\"item.id as item in datatypes | filter: $select.search\">\n" +
    "        <span ng-bind-html=\"item.displayLabel | highlight: $select.search\"></span>\n" +
    "      </ui-select-choices>\n" +
    "    </ui-select>\n" +
    "  </div>\n" +
    "  <!-- Language selector -->\n" +
    "  <div ng-form=\"forms.lang\" ng-show=\"state.type===vocab.plainLiteral\" class=\"input-group-addon\" style=\"border-left: 0px; padding: 0px 0px !important;\">\n" +
    "    <ui-select name=\"value\" ng-model=\"state.lang\" ng-model-options=\"ngModelOptions\" ng-disabled=\"disabled\" theme=\"selectize\" tagging=\"addLanguage\" reset-search-input=\"false\" style=\"width: 100px; line-height:0;\" >\n" +
    "      <ui-select-match placeholder=\"Language\">{{$select.selected.displayLabel}}</ui-select-match>\n" +
    "      <ui-select-choices style=\"z-index: 999;\" repeat=\"item.id as item in langs | filter: $select.search\">\n" +
    "        <span ng-bind-html=\"item.displayLabel | highlight: $select.search\"></span>\n" +
    "      </ui-select-choices>\n" +
    "    </ui-select>\n" +
    "  </div>\n" +
    "  <!-- Input -->\n" +
    "  <div ng-form=\"forms.value\" class=\"form-control margin-left-1\" style=\"height: 35px !important; padding: 0px; border: 0px; margin: 0px\">\n" +
    "    <input name=\"value\" type=\"text\" style=\"width: 100%; height: 100%;\" ng-model=\"state.value\" ng-model-options=\"ngModelOptions\">\n" +
    "  </div>\n" +
    "</div>");
}]);
