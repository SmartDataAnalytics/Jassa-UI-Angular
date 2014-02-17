'use strict';

// Set the jasmine fixture path
// jasmine.getFixtures().fixturesPath = 'base/';

describe('jassa-ui-angular', function() {

    var module;
    var dependencies;
    dependencies = [];

    var hasModule = function(module) {
        return dependencies.indexOf(module) >= 0;
    };

    beforeEach(function() {

        // Get module
        module = angular.module('jassa-ui-angular');
        dependencies = module.requires;
    });

    it('should load config module', function() {
        expect(hasModule('jassa-ui-angular.config')).toBeTruthy();
    });

    
    it('should load filters module', function() {
        expect(hasModule('jassa-ui-angular.filters')).toBeTruthy();
    });
    

    
    it('should load directives module', function() {
        expect(hasModule('jassa-ui-angular.directives')).toBeTruthy();
    });
    

    
    it('should load services module', function() {
        expect(hasModule('jassa-ui-angular.services')).toBeTruthy();
    });
    

});
