angular.module("template/rdf-term-input/rdf-term-input.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/rdf-term-input/rdf-term-input.html",
    "<div>\n" +
    "  <div class=\"input-group\">\n" +
    "\n" +
    "    <!-- First input addon -->\n" +
    "    <!-- TODO Make content configurable -->\n" +
    "    <!--     <span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-link\"></span></span> -->\n" +
    "    <span class=\"input-group-addon\" ng-bind-html=\"logo\"></span>\n" +
    "\n" +
    "<!--     <div class=\"input-group-addon\"> -->\n" +
    "<!--         <select ng-model=\"state.type\"  ng-options=\"item.id as item.displayLabel for item in termTypes\" ng-change=\"ensureValidity()\"></select> -->\n" +
    "<!--     </div> -->\n" +
    "\n" +
    "    <!-- Term type selector -->\n" +
    "    <div class=\"input-group-addon\">\n" +
    "        <ui-select ng-model=\"state.type\" ng-model-options=\"ngModelOptions\" ng-disabled=\"disabled\" theme=\"selectize\"  reset-search-input=\"false\" style=\"width: 100px;\" >\n" +
    "          <ui-select-match placeholder=\"Termtype\">{{$select.selected.displayLabel}}</ui-select-match>\n" +
    "          <ui-select-choices repeat=\"item.id as item in termTypes | filter: $select.search\">\n" +
    "            <span ng-bind-html=\"item.displayLabel | highlight: $select.search\"></span>\n" +
    "          </ui-select-choices>\n" +
    "        </ui-select>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Datatype selector -->\n" +
    "<!--     <span ng-show=\"state.type===vocab.typedLiteral\" class=\"input-group-addon\"> -->\n" +
    "<!--         <select ng-model=\"state.datatype\" ng-model-options=\"ngModelOptions\" ng-options=\"item.id as item.displayLabel for item in datatypes\"></select> -->\n" +
    "<!--     </span> -->\n" +
    "\n" +
    "    <div ng-show=\"state.type===vocab.typedLiteral\" class=\"input-group-addon\" style=\"border-left: 0px;\">\n" +
    "      <ui-select ng-model=\"state.datatype\" ng-model-options=\"ngModelOptions\" ng-disabled=\"disabled\" theme=\"selectize\"  reset-search-input=\"false\" style=\"width: 100px;\" >\n" +
    "        <ui-select-match placeholder=\"Datatype\">{{$select.selected.displayLabel}}</ui-select-match>\n" +
    "        <!--ui-select-choices repeat=\"item in datatypes | filter: $select.search\" refresh=\"refreshDatatype($select.search)\" refresh-delay=\"100\"-->\n" +
    "        <ui-select-choices repeat=\"item.id as item in datatypes | filter: $select.search\">\n" +
    "          <span ng-bind-html=\"item.displayLabel | highlight: $select.search\"></span>\n" +
    "        </ui-select-choices>\n" +
    "      </ui-select>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <!-- Language selector -->\n" +
    "<!--     <span ng-show=\"state.type===vocab.plainLiteral\" class=\"input-group-addon\"> -->\n" +
    "<!--         <select ng-model=\"state.lang\" ng-model-options=\"ngModelOptions\" ng-options=\"item.id as item.displayLabel for item in langs\"></select> -->\n" +
    "<!--     </span> -->\n" +
    "\n" +
    "    <div ng-show=\"state.type===vocab.plainLiteral\" class=\"input-group-addon\" style=\"border-left: 0px;\">\n" +
    "      <ui-select ng-model=\"state.lang\" ng-model-options=\"ngModelOptions\" ng-disabled=\"disabled\" theme=\"selectize\"  reset-search-input=\"false\" style=\"width: 100px;\" >\n" +
    "        <ui-select-match placeholder=\"Language\">{{$select.selected.displayLabel}}</ui-select-match>\n" +
    "        <ui-select-choices repeat=\"item.id as item in langs | filter: $select.search\">\n" +
    "          <span ng-bind-html=\"item.displayLabel | highlight: $select.search\"></span>\n" +
    "        </ui-select-choices>\n" +
    "      </ui-select>\n" +
    "    </div>\n" +
    "\n" +
    "    <!--div class=\"input-group-addon\">\n" +
    "\n" +
    "    </div-->\n" +
    "    <input type=\"text\" class=\"form-control margin-left-1\" style=\"height:52px; margin-left: -1px !important;\" ng-model=\"state.value\" ng-model-options=\"ngModelOptions\">\n" +
    "    <span ng-show=\"rightButton\" class=\"input-group-btn\">\n" +
    "      <button class=\"btn btn-default\" type=\"button\">Map</button>\n" +
    "    </span>\n" +
    "  </div>\n" +
    "  <div ng-transclude></div>\n" +
    "</div>\n" +
    "");
}]);
