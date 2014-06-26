angular.module('ui.jassa.sparql-grid', [])

.controller('SparqlGridCtrl', ['$scope', '$rootScope', '$q', function($scope, $rootScope, $q) {

    var rdf = jassa.rdf;
    var sparql = jassa.sparql;
    var service = jassa.service;
    var util = jassa.util;
    var sponate = jassa.sponate;
    var facete = jassas.facete;
    
    var syncTableMod = function(sortInfo, tableMod) {
        
        var newSortConditions = [];
        for(var i = 0; i < sortInfo.fields.length; ++i) {
            var columnId = sortInfo.fields[i];
            var dir = sortInfo.directions[i];
            
            var d = 0;
            if(dir === 'asc') {
                d = 1;
            }
            else if(dir === 'desc') {
                d = -1;
            }
            
            if(d !== 0) {
                var sortCondition = new facete.SortCondition(columnId, d);
                newSortConditions.push(sortCondition);
            }
        }

        var oldSortConditions = tableMod.getSortConditions();
        
        var isTheSame = _(newSortConditions).isEqual(oldSortConditions);
        if(!isTheSame) {
            util.ArrayUtils.replace(oldSortConditions, newSortConditions);
        }

    };

    
    var createTableService = function() {
        var config = $scope.config;
        
        var sparqlService = $scope.sparqlService;
        var queryFactory = config ? config.queryFactory : null;
        
        var query = queryFactory ? queryFactory.createQuery() : null;
        
        var result = new service.SparqlTableService(sparqlService, query);
        
        return result;
    };


    
    $scope.$watch('gridOptions.sortInfo', function(sortInfo) {
        var config = $scope.config;

        var tableMod = config ? config.tableMod : null;

        if(tableMod != null) {
            syncTableMod(sortInfo, tableMod);
        }
        
        $scope.refreshData();
    }, true);


    $scope.$watch('[pagingOptions, filterOptions]', function (newVal, oldVal) {
        $scope.refreshData();
    }, true);
    
    var update = function() {
        $scope.refresh();
    };
    
    
    $scope.ObjectUtils = util.ObjectUtils;
    
    $scope.$watch('[ObjectUtils.hashCode(config), disableRequests]', function (newVal, oldVal) {
        update();
    }, true);
    
    $scope.$watch('sparqlService', function() {
        update();
    });
    
    
    $scope.totalServerItems = 0;
        
    $scope.pagingOptions = {
        pageSizes: [10, 50, 100],
        pageSize: 10,
        currentPage: 1
    };

    $scope.refresh = function() {
        var tableService = createTableService();

        if($scope.disableRequests) {
            util.ArrayUtils.clear($scope.myData);
            return;
        }
        

        $scope.refreshSchema(tableService);
        $scope.refreshPageCount(tableService);
        $scope.refreshData(tableService);
    };

    $scope.refreshSchema = function(tableService) {
        tableService = tableService || createTableService();

        var oldSchema = $scope.colDefs;
        var newSchema = tableService.getSchema();
        
        var isTheSame = _(newSchema).isEqual(oldSchema);
        if(!isTheSame) {
            $scope.colDefs = newSchema;
        }
    };

    $scope.refreshPageCount = function(tableService) {
        tableService = tableService || createTableService();
        
        var promise = tableService.fetchCount();

        jassa.sponate.angular.bridgePromise(promise, $q.defer(), $scope, function(countInfo) {
            // Note: There is also countInfo.hasMoreItems and countInfo.limit (limit where the count was cut off)
            $scope.totalServerItems = countInfo.count;
        });
    };
    
    $scope.refreshData = function(tableService) {
        tableService = tableService || createTableService();

        var page = $scope.pagingOptions.currentPage;
        var pageSize = $scope.pagingOptions.pageSize;
        
        var offset = (page - 1) * pageSize;

        
        var promise = tableService.fetchData(pageSize, offset);

        jassa.sponate.angular.bridgePromise(promise, $q.defer(), $scope, function(data) {
            var isTheSame = _(data).isEqual($scope.myData);
            if(!isTheSame) {
                $scope.myData = data;
            }
            //util.ArrayUtils.replace($scope.myData, data);
            
            // Using equals gives digest iterations exceeded errors; could be https://github.com/angular-ui/ng-grid/issues/873
            //$scope.myData = data;
        });
    };

        
    var plugins = [];
    
    if(ngGridFlexibleHeightPlugin) {
        // js-hint will complain on lower case ctor call
        var PluginCtor = ngGridFlexibleHeightPlugin;
        
        plugins.push(new PluginCtor(30));
    }
    
    $scope.myData = [];
    
    $scope.gridOptions = {
        data: 'myData',
        enablePaging: true,
        useExternalSorting: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        enableHighlighting: true,
        sortInfo: {
            fields: [],
            directions: [],
            columns: []
        },
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        plugins: plugins,
        columnDefs: 'colDefs'
    };

    

    //$scope.refresh();
}])


/**
 * 
 * 
 * config: {
 *     queryFactory: qf,
 *     tableMod: tm
 * }
 * 
 */
.directive('sparqlGrid', ['$parse', function($parse) {
    return {
        restrict: 'EA', // says that this directive is only for html elements
        replace: true,
        //template: '<div></div>',
        templateUrl: 'template/sparql-grid/sparql-grid.html',
        controller: 'SparqlGridCtrl',
        scope: {
            sparqlService: '=',
            config: '=',
            disableRequests: '=',
            onSelect: '&select',
            onUnselect: '&unselect'
        },
        link: function (scope, element, attrs) {
            
        }
    };
}])

;
    
/*    
var createQueryCountQuery = function(query, outputVar) {
    //TODO Deterimine whether a sub query is needed
    var result = new sparql.Query();
    var e = new sparql.ElementSubQuery(query);
    result.getElements().push(e);
    result.getProjectVars().add(outputVar, new sparql.E_Count());
    
    return result;
};
*/
