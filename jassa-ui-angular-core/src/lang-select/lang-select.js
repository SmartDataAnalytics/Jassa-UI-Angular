angular.module('ui.jassa.lang-select', ['ui.sortable', 'ngSanitize'])

.controller('LangSelectCtrl', ['$scope', function($scope) {
    $scope.newLang = '';
    $scope.showLangInput = false;

    var removeIntent = false;

    $scope.sortConfig = {
        placeholder: 'lang-sortable-placeholder',
        receive: function(e, ui) { removeIntent = false; },
        over: function(e, ui) { removeIntent = false; },
        out: function(e, ui) { removeIntent = true; },
        beforeStop: function(e, ui) {
            if (removeIntent === true) {
                var lang = ui.item.context.textContent;
                if(lang) {
                    lang = lang.trim();
                    var i = $scope.langs.indexOf(lang);
                    $scope.langs.splice(i, 1);
                    ui.item.remove();
                }
            }
        },
        stop: function() {
            if(!$scope.$$phase) {
                $scope.$apply();
            }
        }
    };

    $scope.getLangSuggestions = function() {
        var obj = $scope.availableLangs;

        var result;
        if(!obj) {
            result = [];
        }
        else if(Array.isArray(obj)) {
            result = obj;
        }
        else if(obj instanceof Function) {
            result = obj();
        }
        else {
            result = [];
        }

        return result;
    };

    $scope.confirmAddLang = function(lang) {

        var i = $scope.langs.indexOf(lang);
        if(i < 0) {
            $scope.langs.push(lang);
        }
        $scope.showLangInput = false;
        $scope.newLang = '';
    };
}])

.directive('langSelect', function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'template/lang-select/lang-select.html',
        scope: {
            langs: '=',
            availableLangs: '='
        },
        controller: 'LangSelectCtrl',
    };
})

;

