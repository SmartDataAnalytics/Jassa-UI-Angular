angular.module('jassa.ui.edit.demo.widgets.plain', ['ui.bootstrap', 'ui.jassa'])
  .directive('jassaEditPlain', function() {
    return {
      restrict: 'EA',
      replace: true,
      //templateUrl: 'template/constraint-list/constraint-list.html',
      templateUrl: 'components/jassa-edit-plain.html',
      transclude: false,
      //require: 'constraintList',
      //require: 'ngModel',
      scope: {
        'valueStore': '='
        //model: '=ngModel'
        //'ngModel': '='
      },
      //controller: 'JassaEditTextCtrl',
      link: function(scope, element, attrs) {

        scope.languageTags = ['de', 'en'];

        scope.language = scope.valueStore.lang.getData();

        scope.plainValue = scope.valueStore.lex.getData();

        scope.setLanguage = function(tag) {
          scope.language = tag ? tag : '';
        };

        scope.$watch(function () {
          return scope.plainValue;
        }, function(newValue) {
          console.log('model changed: ', newValue);
          scope.valueStore.lex.setData(newValue);
        });

        scope.$watch(function() {
          return scope.valueStore.lex.getData();
        }, function(newValue) {
          console.log('data reset: ', newValue);
          scope.plainValue = newValue;
        });

        scope.$watch(function() {
          return scope.language;
        }, function(newValue) {
          if(newValue === 'none'  || newValue === undefined) {
            scope.valueStore.lang.setData('');
          } else {
            scope.valueStore.lang.setData(newValue);
          }
        });

        scope.$watch(function() {
          return scope.valueStore.lang.getData();
        }, function(newValue) {
          console.log('data reset: ', newValue);
          scope.language = newValue;
        });

      }
    };
  });