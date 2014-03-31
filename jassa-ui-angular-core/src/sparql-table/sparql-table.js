angular.module('ui.jassa.sparql-table', [])

.controller('SparqlTableCtrl', ['$scope', '$rootScope', '$q', function($scope, $rootScope, $q) {

    var rdf = Jassa.rdf;
    var sparql = Jassa.sparql;
    var service = Jassa.service;
    var util = Jassa.util;
    
    var sponate = Jassa.sponate;

    
    var syncTableMod = function(sortInfo, tableMod) {
        util.ArrayUtils.clear(tableMod.getSortConditions());
        
        
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
                tableMod.getSortConditions().push(sortCondition);
            }
        }
    };

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

    var createNgGridOptionsFromQuery = function(query) {
        if(!query) {
            return [];
        }
        
        var projectVarList = query.getProjectVars().getVarList();
        var projectVarNameList = sparql.VarUtils.getVarNames(projectVarList);

        var result = _(projectVarNameList).map(function(varName) {
            var col = {
                field: varName,
                displayName: varName
            };
                
            return col;
        });
        
        return result;
    };
    

    

    service.SparqlTableService = Class.create({
        /**
         * TODO Possibly add primaryCountLimit - i.e. a limit that is never counted beyond, even if the backend might be fast enough
         */
        initialize: function(sparqlService, query, timeoutInMillis, secondaryCountLimit) {
            this.sparqlService = sparqlService;
            this.query = query;
            this.timeoutInMillis = timeoutInMillis || 3000;
            this.secondaryCountLimit = secondaryCountLimit || 1000;
        },
        
        fetchCount: function() {
            if(!this.query) {
                var deferred = jQuery.Deferred();
                deferred.resolve(0);
                return deferred.promise();
            }
            
            var query = this.query.clone();

            query.setLimit(null);
            query.setOffset(null);
  
            var result = service.ServiceUtils.fetchCountQuery(this.sparqlService, this.query, this.timeoutInMillis, this.secondaryCountLimit);
          
/*
            var countVar = rdf.NodeFactory.createVar('_c_');
            var countQuery = createQueryCountQuery(query, countVar);
            var countQe = this.sparqlService.createQueryExecution(countQuery);
            var promise = service.ServiceUtils.fetchInt(countQe, countVar);
*/
            
            //console.log('Count Query: ' + countQuery);

            //return promise;
            return result;
        },
        
        fetchData: function(limit, offset) {
            if(!this.query) {
                var deferred = jQuery.Deferred();

                var itBinding = new util.IteratorArray([]);
                var varNames = [];
                var rs = new ns.ResultSetArrayIteratorBinding(itBinding, varNames);
               
                
                deferred.resolve(rs);
                return deferred.promise();
            }

            
            var query = this.query.clone();

            query.setLimit(limit);
            query.setOffset(offset);
            
            var qe = this.sparqlService.createQueryExecution(query);

            var result = qe.execSelect().pipe(function(rs) {
                var data = [];
                
                var projectVarList = query.getProjectVars().getVarList();
                
                var makeJson = function(varList, binding) {
                    var result = {};
                    
                    _(varList).each(function(v) {
                        var varName = v.getName();
                        result[varName] = '' + binding.get(v);
                    });

                    return result;
                };
                
                while(rs.hasNext()) {
                    var binding = rs.next();
                    
                    var o = makeJson(projectVarList, binding);
                    
                    data.push(o);
                }
                
                return data;
            });
            
            return result;
        },
        
        getSchema: function() {
            var query = this.query;

            //var projectVarList = query.getProjectVars().getVarList();
            //var projectVarNameList = sparql.VarUtils.getVarNames(projectVarList);

            var colDefs = createNgGridOptionsFromQuery(query);
            
            
            return colDefs;
        }
    });

    
    var createTableService = function() {
        var config = $scope.config;
        
        var sparqlService = $scope.sparqlService;
        var queryFactory = config ? config.queryFactory : null;
        
        var query = queryFactory ? queryFactory.createQuery() : null;
        
        var result = new service.SparqlTableService(sparqlService, query);
        
        return result;
    };


    
    $scope.$watch('gridOptions.sortInfo', function(sortInfo) {
        var tableMod = $scope.config.tableMod;

        syncTableMod(sortInfo, tableMod);
        
        $scope.refreshData();
    }, true);


    $scope.$watch('[pagingOptions, filterOptions]', function (newVal, oldVal) {
        $scope.refreshData();
    }, true);
        
    $scope.ObjectUtils = util.ObjectUtils;
    
    $scope.$watch('[ObjectUtils.hashCode(sparqlService), ObjectUtils.hashCode(config)]', function (newVal, oldVal) {
        $scope.refresh();
    }, true);

    
    $scope.totalServerItems = 0;
        
    $scope.pagingOptions = {
        pageSizes: [10, 50, 100],
        pageSize: 10,
        currentPage: 1
    };

    $scope.refresh = function() {
        var tableService = createTableService();
        
        $scope.refreshSchema(tableService);
        $scope.refreshPageCount(tableService);
        $scope.refreshData(tableService);
    };

    $scope.refreshSchema = function(tableService) {
        tableService = tableService || createTableService();

        $scope.colDefs = tableService.getSchema();
    };

    $scope.refreshPageCount = function(tableService) {
        tableService = tableService || createTableService();
        
        var promise = tableService.fetchCount();

//        $q.when(promise).then(function(countInfo) {
//            $scope.totalServerItems = countInfo.count;
//        });
        
//        promise.done(function(countInfo) {
//           $scope.totalServerItems = countInfo.count;
//            
//            if ($scope && !$scope.$root.$$phase) {
//                $scope.$root.$apply();
//            }
//        });
//
        

        Jassa.sponate.angular.bridgePromise(promise, $q.defer(), $scope, function(countInfo) {
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

//        promise.done(function(data) {
//            $scope.myData = data;
//            
//            if ($scope && !$scope.$root.$$phase) {
//                $scope.$root.$apply();
//            }
//        });

        /*
        $q.when(promise).then(function(data) {
            $scope.myData = data;
        });
        */

        Jassa.sponate.angular.bridgePromise(promise, $q.defer(), $scope, function(data) {
            $scope.myData = data;
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

    

    $scope.refresh();
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
.directive('sparqlTable', ['$parse', function($parse) {
    return {
        restrict: 'EA', // says that this directive is only for html elements
        replace: true,
        //template: '<div></div>',
        templateUrl: 'template/sparql-table/sparql-table.html',
        controller: 'SparqlTableCtrl',
        scope: {
            sparqlService: '=',
            config: '=',
            onSelect: '&select',
            onUnselect: '&unselect'
        },
        link: function (scope, element, attrs) {
            
        }
    };
}])

;
    