angular.module('jassa.ui.edit.demo.widgets.text', ['ui.bootstrap', 'ui.jassa'])
  .directive('jassaEditText', function() {
    return {
      restrict: 'EA',
      replace: true,
      //templateUrl: 'template/constraint-list/constraint-list.html',
      templateUrl: 'components/jassa-edit-text.html',
      transclude: false,
      //require: 'constraintList',
      require: 'ngModel',
      scope: {
        'valueStore': '='
        //model: '=ngModel'
        //'ngModel': '='
      },
      //controller: 'JassaEditTextCtrl',
      link: function(scope, element, attrs, ngModel) {
        scope.$watch(function () {
          return ngModel.$modelValue;
        }, function(newValue) {
          console.log('model changed: ', newValue);
          scope.valueStore.setData(newValue);
        });

        scope.$watch(function() {
          return scope.valueStore.getData();
        }, function(newValue) {
          console.log('data reset: ', newValue);
          ngModel.$modelValue = newValue;
        });
      }
    };
  });