//var jassa = jassa || {};
//jassa.angular = jassa.angular || {};
//jassa.angular.
var ListServiceWatcher = Jassa.ext.Class.create({
    initialize: function($scope, $q) {
        this.$scope = $scope;
        this.$q = $q;
    },


    // Returns an object that is actively watched by angular
    watch: function(rawListServiceExpr, defaults, result) {

        var $scope = this.$scope;
        var $q = this.$q;


        var tryCatch = function(fn, def) {
            var r;
            try {
                r = fn();
            } catch(e) {
                r = def || null;
            }

            return r;
        };

        // Set up the result object and apply defaults
        result = result || {};

//        var defaultsDeep = function(target, source) {
//            _.forEach(source, function(v, k) {
//            });
//        }

        // TODO We should use a recursive defaults method

        var defs = ListServiceWatcher.getDefaults();
        _.defaults(result, defs);

        _.defaults(result.state, defs.state);
        //_.defaults(result.state.entries, defs.state.entries);
        _.defaults(result.state.listService, defs.state.listService);
        _.defaults(result.state.filter, defs.state.filter);
        _.defaults(result.state.paging, defs.state.paging);

        _.defaults(result.loading, defs.loading);

        _.defaults(result.ctrl, defs.ctrl);
        _.defaults(result.ctrl.listService, defs.ctrl.listService);
        _.defaults(result.ctrl.filter, defs.ctrl.filter);
        _.defaults(result.ctrl.paging, defs.ctrl.paging);


        _.defaults(result.paginationOptions, defs.paginationOptions);


        // Util method
        var calcNumPages = function() {
            var limit = tryCatch(function() { return result.state.filter.limit; });
            var totalItems = tryCatch(function() { return result.state.paging.totalItems; }, 0);

            var r = (limit == null ? 1 : Math.ceil(totalItems / limit));

            r = Math.max(r, 1);
            return r;
        };


        //result.ctrl.listService = rawListServiceExpr;

        result.doRefresh = function() {
            var p1 = result.doRefreshCount();
            var p2 = result.doRefreshData();

            var r = jassa.util.PromiseUtils.all([p1, p2]);
            return r;
        };

        result.doRefreshData = function() {
            result.loading.data = true;

            var filter = result.ctrl.filter;
            var listService = result.state.listService;

            var r;
            if(listService != null) {
                r = Promise.resolve(listService).then(function(listService) {
                    $q.when(listService.fetchItems(filter.concept, filter.limit, filter.offset)).then(function(entries) {

                        result.state.entries = entries;

                        result.state.items = entries.map(function(entry) {
                            return entry.val;
                        });

                        result.loading.data = false;

                        result.state.filter.limit = result.ctrl.filter.limit;
                        result.state.filter.offset = result.ctrl.filter.offset;
                        //result.state.listService = result.ctrl.listService;
                    });
                }, function() {
                    result.loading.data = false;
                });
            } else {
                r = Promise.resolve({});
            }

            return r;
        };

        result.doRefreshCount = function() {

            var filter = result.ctrl.filter;
            var listService = result.state.listService;

            var r;
            if(listService != null) {
                result.loading.pageCount = true;

                r = Promise.resolve(listService).then(function(listService) {
                    $q.when(listService.fetchCount(filter.concept)).then(function(countInfo) {
                          //$scope.totalItems = countInfo.count;
                        result.state.paging.totalItems = countInfo.count;

                        result.state.paging.numPages = calcNumPages();


                        result.loading.pageCount = false;
                    }, function() {
                        result.loading.pageCount = false;
                    });
                });
            } else {
                r = Promise.resolve({});
            }

            return r;
        };


        result.unwatch = function() {
            result.watchers.forEach(function(watcher) {
               watcher();
            });

            jassa.util.ArrayUtils.clear(result.watchers);
        };

        result.cancelAll = function() {
            var ls = result.state.listService;
            if(ls) {
                ls.cancelAll();
            }
        };


        // Keep track of all watchers, so we can unregister them all if desired
        result.watchers = result.watchers || [];
        var addWatch = function() {
            var r = $scope.$watch.apply($scope, arguments);
            result.watchers.push(r);
            return r;
        };
        var addWatchCollection = function() {
            var r = $scope.$watchCollection.apply($scope, arguments);
            result.watchers.push(r);
            return r;
        };

        addWatch(rawListServiceExpr, function(lse) {
            result.ctrl.listService = lse;
        });


        addWatch(function() {
            return result.ctrl.listService;
        }, function(listService) {
            if(result.cancelAll) {
                result.cancelAll();
            }

            //result.state.listService = jassa.util.PromiseUtils.lastRequestify(rawListService);
            jassa.util.PromiseUtils.replaceService(result.state, 'listService', listService);
        });

        addWatch(function() {
            return result.ctrl.paging.currentPage;
        }, function(currentPage) {
            var limit = result.ctrl.filter.limit;
            result.ctrl.filter.offset = (currentPage - 1) * limit;
        });

        addWatch(function() {
            return result.ctrl.filter.offset;
        }, function(offset) {
            var limit = result.ctrl.filter.limit;
            result.state.paging.currentPage = Math.max(Math.floor(offset / limit) + 1, 1);
        });

        var arr = [null, null, null, null];

        var getState = function() {

            arr[0] = result.ctrl.listService;
            arr[1] = result.ctrl.filter.concept;
            arr[2] = result.ctrl.filter.limit;
            arr[3] = result.ctrl.filter.offset;

            return arr;
        };

        addWatchCollection(getState, function(n, o) {
            // If the service and/or the filter changed, we need to refresh everything
            // otherwise only the data (totalItem count is unaffected)
            if (n[0] != o[1] || n[1] != o[1]) {
                result.doRefresh();
            } else {
                result.doRefreshData();
            }
        });



//
//        var newScope = $scope.$new();
//        newScope.result = result;
//
//        dddi = $dddi(newScope);
//
//
//        dddi.register('result.ctrl.paging.currentPage', ['?result.ctrl.filter.limit', 'result.ctrl.filter.offset',
//            function(limit, offset) {
//                var r = limit ? Math.max(Math.floor(offset / limit) + 1, 1) : 1;
//            }]);
//
//        dddi.register('result.ctrl.filter.offset', ['result.ctrl.paging.currentPage', '?result.ctrl.filter.limit',
//            function(currentPage, limit) {
//                var r = limit ? (currentPage - 1) * limit : null;
//                return r;
//            }]);
//
//        dddi.register('result.ctrl.listService', [rawListServiceExpr,
//            function(rawListService) {
//                var r = jassa.util.PromiseUtils.lastRequestify(rawListService);
//                return r;
//            }]);
//
//
//        dddi.register('result.state.listService', ['?result.ctrl.listService',
//            function(listService) {
//                if(result.cancelAll) {
//                    result.cancelAll();
//                }
//
//                var oldService = result.ctrl.listService;
//                if(oldService && oldService.cancelAll) {
//                    oldService.cancelAll();
//                }
//
//                var r = listService == null ? null : PromiseUtils.lastRequestify(listService);
//                return r;
//            }]);
//
//        dddi.register('result.state.paging.totalItems', [ 'result.ctrl.listService', 'result.ctrl.filter.concept,'
//            function(listService, concept) {
//
//            newScope.result.loading.pageCount = true;
//
//            var r = listService.fetchCount(concept).then(function(countInfo) {
//                newScope.result.loading.pageCount = false;
//                return countInfo.count;
//            });
//
//            return r;
//        }]);
//
//        dddi.register('result.state.paging.numPages', [ 'result.state.paging.totalItems', 'result.ctrl.filter.limit'
//            function(totalItems, limit) {
//                var r = (limit == null ? 1 : Math.ceil(totalItems / limit));
//
//                r = Math.max(r, 1);
//
//                return r;
//            }]);
//
//
//        //
//
//
//        dddi.register('result.state.entries', ['result.ctrl.listService', 'result.ctrl.filter.concept', 'result.ctrl.filter.offset', 'result.ctrl.filter.limit',
//            function(listService, concept, limit, offset) {
//                var r = listService.fetchItems(concept, limit, offset);
//                return r;
//            });
//        }]);
//
//        dddi.register('result.state.paging.currentPage');
//        dddi.register('result.state.paging.currentPage');
//
//        dddi.register('result.state.items', ['result.state.entries',
//            function(entries) {
//                var r = entries.map(function(entry) {
//                    return entry.val;
//                });
//                return r;
//            }]);
//

//        addWatch(function() {
//            return $scope.rawListService;
//        }, function(rawListService) {
//           jassa.util.PromiseUtils.replaceService($scope, 'listService', rawListService);
//        });

//        addWatch('[filter, refresh]', $scope.doRefresh, true);
//        addWatch('listService', $scope.doRefresh);

        return result;
    }
});


ListServiceWatcher.getDefaults = function() {
    var result = {
        state: {
            items: [],
            entries: [],
            filter: { // The filter that applies to the current list of items
                concept: null,
                limit: 10,
                offset: 0
            },
            listService: null,
            paging: {
                currentPage: 1,
                numPages: 1,
                totalItems: 0
            }
        },
        loading: {
            data: false,
            pageCount: false
        },
        ctrl: { // Control attributes; changing these will modify the state
            listService: null,
            filter: { // The filter to execute
                concept: null,
                limit: 10,
                offset: 0
            },
            paging: {
                currentPage: 1
                //numPages: 1,
                //totalItems: 0
            }
        },
        watchers: []
    };

    return result;
};
