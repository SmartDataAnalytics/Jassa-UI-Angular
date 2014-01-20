// Create all modules and define dependencies to make sure they exist
// and are loaded in the correct order to satisfy dependency injection
// before all nested files are concatenated by Grunt

// Config
angular.module('jassa-ui-angular.config', [])
    .value('jassa-ui-angular.config', {
        debug: true
    });

// Modules
angular.module('jassa-ui-angular.directives', []);
angular.module('jassa-ui-angular.filters', []);
angular.module('jassa-ui-angular.services', []);
angular.module('jassa-ui-angular',
    [
        'jassa-ui-angular.config',
        'jassa-ui-angular.directives',
        'jassa-ui-angular.filters',
        'jassa-ui-angular.services',
        'ngResource',
        'ngCookies',
        'ngSanitize'
    ]);
