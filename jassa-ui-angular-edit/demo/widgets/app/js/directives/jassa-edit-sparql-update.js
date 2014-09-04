angular.module('jassa.ui.edit.demo.widgets.sparqlupdate', ['ui.bootstrap', 'ui.jassa'])
  .directive('jassaEditSparqlUpdate', function() {
    return {
      restrict: 'EA',
      replace: true,
      //templateUrl: 'template/constraint-list/constraint-list.html',
      templateUrl: 'components/jassa-edit-sparql-update.html',
      transclude: false,
      //require: 'constraintList',
      //require: 'ngModel',
      scope: {
        'graph': '=',
        'endpoint': '='
        //model: '=ngModel'
        //'ngModel': '='
      },
      //controller: 'JassaEditTextCtrl',
      link: function(scope, element, attrs) {

      }
    };
  });