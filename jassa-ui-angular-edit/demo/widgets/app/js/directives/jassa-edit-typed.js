angular.module('jassa.ui.edit.demo.widgets.typed', ['ui.bootstrap', 'ui.jassa'])
  .directive('jassaEditTyped', function() {
    return {
      restrict: 'EA',
      replace: true,
      //templateUrl: 'template/constraint-list/constraint-list.html',
      templateUrl: 'components/jassa-edit-typed.html',
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

        scope.datatypeTags = {
          'http://www.w3.org/2001/XMLSchema#int' : 'xsd:int',
          'http://www.w3.org/2001/XMLSchema#string' : 'xsd:string'
        }

        scope.datatype = scope.valueStore.dtype.getData().getUri();

        scope.typedValue = scope.valueStore.lex.getData();

        scope.setDatatype = function(tag) {
          scope.datatype = tag ? tag : '';
        }

        scope.$watch(function () {
          return scope.typedValue;
        }, function(newValue) {
          console.log('model changed: ', newValue);
          scope.valueStore.lex.setData(newValue);
        });

        scope.$watch(function() {
          return scope.valueStore.lex.getData();
        }, function(newValue) {
          console.log('data reset: ', newValue);
          scope.typedValue = newValue;
        });

        scope.$watch(function() {
          return scope.datatype;
        }, function(newValue) {
          if(newValue === 'none' || newValue === undefined) {
            scope.valueStore.dtype.setData('');
          } else {
            scope.valueStore.dtype.setData(newValue);
          }

        });

        scope.$watch(function() {
          return scope.valueStore.dtype.getData();
        }, function(newValue) {
          console.log('data reset: ', newValue.getUri());
          scope.datatype = newValue.getUri();
        });
      }
    };
  });