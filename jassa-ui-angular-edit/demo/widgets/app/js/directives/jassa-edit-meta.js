angular.module('jassa.ui.edit.demo.widgets.meta', ['ui.bootstrap', 'ui.jassa'])
  .directive('jassaEditMeta', function($compile) {
    return {
      restrict: 'EA',
      replace: true,
      //templateUrl: 'template/constraint-list/constraint-list.html',
      template: '',
      transclude: false,
      //require: 'constraintList',
      //require: 'ngModel',
      scope: {
        'valueStore': '='
        //model: '=ngModel'
        //'ngModel': '='
      },
      //controller: 'JassaEditTextCtrl',
      link: function(scope, element, attrs, ngModel) {
        console.log('Meta Widget Attribute', _.has(attrs, 'plain'));

        if(_.has(attrs, 'plain')) {
          $compile('<jassa-edit-plain value-store="valueStore"></jassa-edit-plain>')(scope, function(cloned, scope){
            element.append(cloned);
          });
        }

        if(_.has(attrs, 'typed')) {
          $compile('<jassa-edit-typed value-store="valueStore"></jassa-edit-typed>')(scope, function(cloned, scope){
            element.append(cloned);
          });
        }

        if(_.has(attrs, 'uri')) {
          $compile('<jassa-edit-uri value-store="valueStore"></jassa-edit-uri>')(scope, function(cloned, scope){
            element.append(cloned);
          });
        }


      }
    };
  });