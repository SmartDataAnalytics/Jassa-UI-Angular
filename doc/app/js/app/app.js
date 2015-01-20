angular.module(
    'jassa.demo',
    [
       'ui.router', 'ngSanitize', 'ui.bootstrap', 'ui.select', 'ui.jassa',
       'ui.jassa.openlayers', 'ui.jassa.edit', 'ui.codemirror', 'ngAnimate'
    ],
    [ '$rootScopeProvider', function($rootScopeProvider) {
       $rootScopeProvider.digestTtl(10);
    }]
)

.config([function() {
    // Setup drop down menu
    jQuery('.dropdown-toggle').dropdown();

    // Fix input element click problem
    jQuery('.dropdown input, .dropdown label').click(function(e) {
      e.stopPropagation();
    });
}])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");

    // Now set up the states
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'partials/home.html',
            //controller: 'SearcCtrl'
        })
        .state('sponate', {
            url: "/sponate",
            templateUrl: "partials/sponate.html",
            controller: 'SponateCtrl'
        })
        .state('edit', {
            url: "/edit",
            templateUrl: "partials/edit.html",
            controller: 'EditCtrl'
        })
        .state('geo', {
            url: "/geo",
            templateUrl: "partials/geo.html",
            controller: 'GeoCtrl'
        })
        .state('facete', {
            url: "/facete",
            templateUrl: "demos/facete/facete.html",
            //controller: 'Ctrl'
        })
        ;

}])

.controller('AppCtrl', ['$scope', '$q', '$templateCache', '$http', function($scope, $q, $templateCache, $http) {

    $scope.loadTemplate = function(path, scope, attr) {
        scope[attr] = '';
        $q.when($http.get(path)).then(function(response) {
            scope[attr] = response.data || '';

            //console.log('Data for [' + path + ']: ', scope[attr]);
        });

        return scope[attr];
    };


    $scope.syncTemplate = function(path, scope, attr, name) {
        $scope.loadTemplate(path, scope, attr);

        $scope.$watch(function() {
            return scope[attr];
        }, function(val) {
            $templateCache.put(name, val);
            console.log('set cache: ', name, val);
        }, true);
    };

    var doEvalCore = function(str, context) {
        var f = function(str) {
            console.log(str);
            str = 'try {' + str + ' } catch(e) { console.log("Inner", e, e.stack); }';
            //var r = eval('console.log("test");');
            var r = eval(str);
            return r;
        };

        var result = f.call(context, str);
        return result;
    };

    $scope.doEval = function(str, context) {
        //try {
            doEvalCore(str, context);
        //} catch (e) {
            //console.log('Outer:', e);
            //alert(JSON.stringify(e));
            //console.log('Error', e,lineNumber, e, e.stack);
        //}
    };


}])

;
