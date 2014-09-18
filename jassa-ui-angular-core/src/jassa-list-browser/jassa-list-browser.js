angular.module('ui.jassa.jassa-list-browser', [])

//.controller('JassaListBrowserCtrl', ['$scope', function($scope) {
//
//}])

.directive('jassaListBrowser', function() {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            listService: '=',
            filter: '=',
            limit: '=',
            offset: '=',
            totalItems: '=',
            items: '=',
            maxSize: '=',
            langs: '=', // Extra attribute that is deep watched on changes for triggering refreshs
            availableLangs: '=',
            doFilter: '=',
            searchModes: '=',
            activeSearchMode: '=',
            context: '=' // Extra data that can be passed in // TODO I would prefer access to the parent scope
        },
        templateUrl: 'template/jassa-list-browser/jassa-list-browser.html',
        //controller: 'JassaListBrowserCtrl'
    };
})

;
