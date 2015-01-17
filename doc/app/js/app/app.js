angular.module(
    'jassa.demo',
    [
       'ui.router', 'ngSanitize', 'ui.bootstrap', 'ui.select', 'ui.jassa.edit',
       'ui.jassa.edit.tpls', 'ui.codemirror', 'ngAnimate'
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
        ;

}])

;
