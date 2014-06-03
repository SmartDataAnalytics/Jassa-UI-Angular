angular.module('ui.jassa.facet-value-list', [])

/**
 * Controller for the SPARQL based FacetTree
 * Supports nested incoming and outgoing properties
 *
 */
.controller('FacetValueListCtrl', ['$rootScope', '$scope', '$q', function($rootScope, $scope, $q) {

    $scope.filterText = '';

    $scope.pagination = {
        totalItems: 0,
        currentPage: 1,
        maxSize: 5
    };
    
    //$scope.path = null;
    

    var facetValueService = null;
    
    var self = this;


    var updateFacetTreeService = function() {
        var isConfigured = $scope.sparqlService && $scope.facetTreeConfig && $scope.path;

        facetValueService = isConfigured ? new Jassa.facete.FacetValueService($scope.sparqlService, $scope.facetTreeConfig) : null;
    };
    
    var update = function() {
        updateFacetTreeService();
        self.refresh();
    };

    $scope.ObjectUtils = Jassa.util.ObjectUtils;

    var watchList = '[ObjectUtils.hashCode(facetTreeConfig), "" + path, pagination.currentPage]';
    $scope.$watch(watchList, function() {
        update();
    }, true);
    
    $scope.$watch('sparqlService', function() {
        update();
    });
    


    $scope.toggleConstraint = function(item) {
        var constraintManager = facetValueService.getFacetTreeConfig().getFacetConfig().getConstraintManager();
        
        var constraint = new Jassa.facete.ConstraintEquals(item.path, item.node);

        // TODO Integrate a toggle constraint method into the filterManager
        constraintManager.toggleConstraint(constraint);
    };
    
    
    
    self.refresh = function() {
        var path = $scope.path;
        
        if(!facetValueService || !path) {
            $scope.totalItems = 0;
            $scope.facetValues = [];
            return;
        }
        
        var fetcher = facetValueService.createFacetValueFetcher($scope.path, $scope.filterText);

        var countPromise = fetcher.fetchCount();
        
        var pageSize = 10;
        var offset = ($scope.pagination.currentPage - 1) * pageSize;
        
        var dataPromise = fetcher.fetchData(offset, pageSize);

        Jassa.sponate.angular.bridgePromise(countPromise, $q.defer(), $scope.$root, function(count) {
            $scope.pagination.totalItems = count;
        });
        
        Jassa.sponate.angular.bridgePromise(dataPromise, $q.defer(), $scope.$root, function(items) {
            $scope.facetValues = items;
        });

    };

    $scope.filterTable = function(filterText) {
        $scope.filterText = filterText;
        update();
    };

    
    /*
    $scope.$on('facete:facetSelected', function(ev, path) {

        $scope.currentPage = 1;
        $scope.path = path;
        
        updateItems();
    });
    
    $scope.$on('facete:constraintsChanged', function() {
        updateItems(); 
    });
    */
//  $scope.firstText = '<<';
//  $scope.previousText = '<';
//  $scope.nextText = '>';
//  $scope.lastText = '>>';

}])

/**
 * The actual dependencies are:
 * - sparqlServiceFactory
 * - facetTreeConfig
 * - labelMap (maybe this should be part of the facetTreeConfig) 
 */
.directive('facetValueList', function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'template/facet-value-list/facet-value-list.html',
        transclude: false,
        require: 'facetValueList',
        scope: {
            sparqlService: '=',
            facetTreeConfig: '=',
            path: '=',
            onSelect: '&select'
        },
        controller: 'FacetValueListCtrl'
//        compile: function(elm, attrs) {
//            return function link(scope, elm, attrs, controller) {
//            };
//        }
    };
})

;
