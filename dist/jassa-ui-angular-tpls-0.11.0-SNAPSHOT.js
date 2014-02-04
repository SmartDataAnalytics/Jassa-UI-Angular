/*
 * jassa-ui-angular
 * https://github.com/GeoKnow/Jassa-UI-Angular

 * Version: 0.11.0-SNAPSHOT - 2014-02-04
 * License: MIT
 */
angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.facettree"]);
angular.module("ui.bootstrap.tpls", ["template/facettree/facet-dir-content.html","template/facettree/facet-tree-item.html"]);
angular.module('ui.jassa', [])
    
.controller('FacetTreeCtrl', ['$rootScope', '$scope', '$q', function($rootScope, $scope, $q) {
        
    var self = this;
      
      
    var updateFacetTreeService = function() {
        var isConfigured = $scope.sparqlService && $scope.facetTreeConfig;
        //debugger;
        $scope.facetTreeService = isConfigured ? ns.FaceteUtils.createFacetTreeService($scope.sparqlService, $scope.facetTreeConfig, labelMap) : null;
    };
    
    var update = function() {
        updateFacetTreeService();
        //controller.refresh();
        self.refresh();
    };
    
    $scope.$watch('sparqlService', function() {
    //console.log('args', $scope.sparqlService);
        update();
    });
    
    $scope.$watch('facetTreeConfig.hashCode()', function() {
        update();
    }, true);
              
      
    $scope.doFilter = function(path, filterString) {
        $scope.facetTreeConfig.getPathToFilterString().put(path, filterString);
        self.refresh();
    };
    
    self.refresh = function() {
                  
        var facet = $scope.facet;
        var startPath = facet ? facet.item.getPath() : new facete.Path();
    
        if($scope.facetTreeService) {
          
            var facetTreeTagger = ns.FaceteUtils.createFacetTreeTagger($scope.facetTreeConfig.getPathToFilterString());
    
            //console.log('scopefacets', $scope.facet);             
            var promise = $scope.facetTreeService.fetchFacetTree(startPath);
              
            sponate.angular.bridgePromise(promise, $q.defer(), $rootScope).then(function(data) {
                facetTreeTagger.applyTags(data);
                $scope.facet = data;
            });
    
        } else {
            $scope.facet = null;
        }
    };
              
    $scope.toggleCollapsed = function(path) {
        util.CollectionUtils.toggleItem($scope.facetTreeConfig.getExpansionSet(), path);
          
        var val = $scope.facetTreeConfig.getExpansionMap().get(path);
        if(val == null) {
            $scope.facetTreeConfig.getExpansionMap().put(path, 1);
        }
          
        self.refresh();
    };
      
    $scope.selectIncoming = function(path) {
        console.log('Incoming selected at path ' + path);
        if($scope.facetTreeConfig) {
            var val = $scope.facetTreeConfig.getExpansionMap().get(path);
            if(val != 2) {
                $scope.facetTreeConfig.getExpansionMap().put(path, 2);
                self.refresh();
            }
        }
    };
      
    $scope.selectOutgoing = function(path) {
        console.log('Outgoing selected at path ' + path);
        if($scope.facetTreeConfig) {
            var val = $scope.facetTreeConfig.getExpansionMap().get(path);
            if(val != 1) {
                $scope.facetTreeConfig.getExpansionMap().put(path, 1);
                self.refresh();
            }
        }
    };
      
      
    $scope.selectFacetPage = function(page, facet) {
        var path = facet.item.getPath();
        var state = $scope.facetTreeConfig.getFacetStateProvider().getFacetState(path);
        var resultRange = state.getResultRange();
          
        console.log('Facet state for path ' + path + ': ' + state);
            var limit = resultRange.getLimit() || 0;
              
            var newOffset = limit ? (page - 1) * limit : null;
              
            resultRange.setOffset(newOffset);
            
            self.refresh();
        };
          
        $scope.toggleSelected = function(path) {
            $scope.onSelect({path: path});
        };
  
        $scope.toggleTableLink = function(path) {
            //$scope.emit('facete:toggleTableLink');
        tableMod.togglePath(path);
      
        //$scope.$emit('')
        // alert('yay' + JSON.stringify(tableMod.getPaths()));
      
        $scope.$emit('facete:refresh');
      
//        var columnDefs = tableMod.getColumnDefs();
//        _(columnDefs).each(function(columnDef) {
          
//        });
      
//        tableMod.addColumnDef(null, new ns.ColumnDefPath(path));
      //alert('yay ' + path);
        };
      
  //  $scope.$on('facete:refresh', function() {
//        $scope.refresh();
  //  });
}])

/**
 * The actual dependencies are:
 * - sparqlServiceFactory
 * - facetTreeConfig
 * - labelMap (maybe this should be part of the facetTreeConfig) 
 */
.directive('facetTree', function($parse) {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'resources/partials/facet-tree-item.html',
        transclude: false,
        require: 'facetTree',
        scope: {
            sparqlService: '=',
            facetTreeConfig: '=',
            onSelect: '&select'
        },
        controller: 'FacetTreeCtrl',
        compile: function(elm, attrs) {
            return function link(scope, elm, attrs, controller) {
            };
        }
    };
})

;

angular.module("template/facettree/facet-dir-content.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facettree/facet-dir-content.html",
    "\n" +
    "<!-- ng-show=\"dirset.pageCount > 1 || dirset.children.length > 5\" -->\n" +
    "\n" +
    "<div style=\"width: 100%; background-color: #eeeeff;\">\n" +
    "	<div style=\"padding-right: 16px; padding-left: {{16* (dirset.item.path.getLength()+ 1)\">\n" +
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
    "					style=\"padding-left: {{16 * (dirset.item.getPath().getLength() + 1)}}px\"\n" +
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
    "<!--     		         		<pagination style=\"padding-left: {{16 * (dirset.item.getPath().getLength() + 1)}}px\" class=\"pagination-tiny\" max-size=\"7\" total-items=\"dirset.childFacetCount\" page=\"dirset.pageIndex\" boundary-links=\"true\" rotate=\"false\" on-select-page=\"selectFacetPage(page, facet)\" first-text=\"<<\" previous-text=\"<\" next-text=\">\" last-text=\">>\"></pagination> -->\n" +
    "<!--                 		</div> -->\n" +
    "\n" +
    "<span ng-show=\"dirset.children.length == 0\"\n" +
    "	style=\"color: #aaaaaa; padding-left: {{16* (dirset.path.getLength()+ 1)\">(no\n" +
    "	entries)</span>\n" +
    "\n" +
    "<div style=\"padding-left: {{16* (dirset.path.getLength()+ 1)\"\n" +
    "	ng-repeat=\"facet in dirset.children\"\n" +
    "	ng-include=\"'resources/partials/facet-tree-item.html'\" ></div>\n" +
    "");
}]);

angular.module("template/facettree/facet-tree-item.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facettree/facet-tree-item.html",
    "<div ng-class=\"{'frame': facet.isExpanded}\">\n" +
    "	<div class=\"facet-row\" ng-class=\"{'highlite': facet.isExpanded}\" ng-mouseover=\"facet.isHovered=true\" ng-mouseleave=\"facet.isHovered=false\">\n" +
    "		<a ng-show=\"facet.isExpanded\" href=\"\" ng-click=\"toggleCollapsed(facet.item.getPath())\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a>\n" +
    "		<a ng-show=\"!facet.isExpanded\" href=\"\" ng-click=\"toggleCollapsed(facet.item.getPath())\"><span class=\"glyphicon glyphicon-chevron-right\"></span></a>\n" +
    "		<a data-rdf-term=\"{{facet.item.getNode().toString()}}\" title=\"{{facet.item.getNode().getUri()}}\" href=\"\" ng-click=\"toggleSelected(facet.item.getPath())\">{{facet.item.getNode().getUri()}}</a>\n" +
    "\n" +
    "\n" +
    "		<a ng-visible=\"facet.isHovered || facet.table.isContained\" href=\"\" ng-click=\"toggleTableLink(facet.item.getPath())\"><span class=\"glyphicon glyphicon-list-alt\"></span></a>\n" +
    "\n" +
    "\n" +
    "		<span style=\"float: right\" class=\"badge\">{{facet.item.getDistinctValueCount()}}</span>	\n" +
    "	</div>\n" +
    "	<div ng-if=\"facet.isExpanded\" style=\"width:100%\"> \n" +
    "\n" +
    "\n" +
    "		<tabset class=\"tabset-small\">\n" +
    "			<tab heading=\"Incoming Facets\" active=\"{{facet.isIncomingActive === true}}\" select=\"selectIncoming(facet.item.getPath())\">\n" +
    "				<div ng-repeat=\"dirset in [facet.incoming]\" ng-include=\"'resources/partials/facet-dir-content.html'\"></div>\n" +
    "			</tab>\n" +
    "			<tab heading=\"Outgoing Facets\" active=\"{{facet.isOutgoingActive === true}}\" select=\"selectOutgoing(facet.item.getPath())\">					\n" +
    "				<div ng-repeat=\"dirset in [facet.outgoing]\" ng-include=\"'resources/partials/facet-dir-content.html'\"></div>\n" +
    "			</tab>\n" +
    "		</tabset>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);
