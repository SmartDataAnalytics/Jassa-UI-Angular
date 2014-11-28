angular.module("template/rdf-term-input/rdf-term-input.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/rdf-term-input/rdf-term-input.html",
    "<div class=\"input-group\">\n" +
    "\n" +
    "    <!-- First input addon -->\n" +
    "    <!-- TODO Make content configurable -->\n" +
    "<!--     <span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-link\"></span></span> -->\n" +
    "    <span class=\"input-group-addon\" ng-bind-html=\"logo\"></span>\n" +
    "\n" +
    "    <!-- Term type selector -->\n" +
    "    <div class=\"input-group-addon\">\n" +
    "        <select ng-model=\"state.type\" ng-model-options=\"ngModelOptions\" ng-options=\"item.id as item.displayLabel for item in termTypes\" ng-change=\"ensureValidity()\"></select>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Datatype selector -->\n" +
    "    <span ng-show=\"state.type===vocab.typedLiteral\" class=\"input-group-addon\">\n" +
    "        <select ng-model=\"state.datatype\" ng-model-options=\"ngModelOptions\" ng-options=\"item.id as item.displayLabel for item in datatypes\"></select>\n" +
    "    </span>\n" +
    "\n" +
    "    <!-- Language selector -->\n" +
    "    <span ng-show=\"state.type===vocab.plainLiteral\" class=\"input-group-addon\">\n" +
    "        <select ng-model=\"state.lang\" ng-model-options=\"ngModelOptions\" ng-options=\"item.id as item.displayLabel for item in langs\"></select>\n" +
    "    </span>\n" +
    "\n" +
    "    <input type=\"text\" class=\"form-control margin-left-1\" ng-model=\"state.value\" ng-model-options=\"ngModelOptions\">\n" +
    "</div>\n" +
    "\n" +
    "");
}]);
