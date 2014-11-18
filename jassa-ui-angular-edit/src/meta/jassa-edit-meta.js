/**
 * <jassa-edit-meta rdf-term-type="plain|lang|uri" value-store="valueStoreConfig" />
 *
 * valueStoreConfig
 * ----------------
 *
 * $scope.myValueStoreGeneralConfig = {
 *   lex: new foo.ValueStoreLex(graphInserter, objectRef),
 *   lang: new foo.ValueStoreLang(graphInserter, objectRef),
 *   dtype: new foo.ValueStoreDatatype(graphInserter, objectRef)
 * };
 */

angular.module('jassa.ui.edit.meta', ['ui.bootstrap', 'ui.jassa'])
  .directive('jassaSwitchLang', function() {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'template/switch-lang/jassa-switch-lang.html',
      transclude: false,
      scope: {
        'valueStore': '=',
        //model: '=ngModel'
        'ngModel': '='
      },
      //controller: 'JassaEditTextCtrl',
      link: function (scope, element, attrs) {

        scope.languageTags = ['de', 'en'];

        console.log('scope.lang', scope.ngModel);
        scope.language = scope.ngModel;


        scope.setLanguage = function(tag) {
          scope.language = tag ? tag : '';
        };

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
          console.log('data reset lang switch: ', newValue);
          scope.language = newValue;
        });
      }
    };
  }).directive('jassaSwitchType', function() {
    return {
      restrict: 'EA',
      replace: true,
      //templateUrl: 'template/constraint-list/constraint-list.html',
      templateUrl: 'template/switch-type/jassa-switch-type.html',
      transclude: false,
      //require: 'constraintList',
      //require: 'ngModel',
      scope: {
        'valueStore': '=',
        //model: '=ngModel'
        'ngModel': '='
      },
      //controller: 'JassaEditTextCtrl',
      link: function (scope, element, attrs) {

        scope.datatypeTags = {
          'http://www.w3.org/2001/XMLSchema#int' : 'xsd:int',
          'http://www.w3.org/2001/XMLSchema#string' : 'xsd:string'
        };

        scope.datatype = scope.ngModel;

        scope.setDatatype = function(tag) {
          scope.datatype = tag ? tag : '';
        };

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
  }).directive('jassaEditMeta', function($compile) {

    var scopeCache = {};

    return {
      restrict: 'EA',
      replace: false,
      templateUrl: 'template/meta/jassa-edit-meta.html',
      transclude: false,
      //require: 'constraintList',
      //require: 'ngModel',
      scope: {
        'valueStore': '=',
        'initTermType': '@rdfTermType'
        //model: '=ngModel'
        //'ngModel': '='
      },
      controller: function($scope) {

      },
      link: function(scope, element, attrs, ngModel) {

        // checks if the current rdfTerm was already initialized (with certain valueStore)
        function initMeta() {
          // iterate through cached scope elements to check if a valueStore was already used
          var equal = false;
          var uniqueId = _.uniqueId('rdfTerm_');
          for (var key in scopeCache) {
            // if it is already used add the current scope to other cached scope element
            if(scopeCache[key][0].valueStore == scope.valueStore) {
              equal = true;
              scope.rdfTermId = key;
              scopeCache[key].push(scope);
              break;
            }
          }

          // if the current valueStore (whole scope) is not used already, add them to the cache with a new unique id
          if (!equal) {
            scopeCache[uniqueId] = [scope];
            scope.rdfTermId = uniqueId;
            console.log('Length', _.size(scopeCache));
            scope.rdfTermType = scope.initTermType;
          } else {
            // use the current rdfTermType state
            scope.rdfTermType = scopeCache[scope.rdfTermId][0].rdfTermType;
          }
        }

        // each switch of rdf term type resets the values for lang and dtype
        function resetPlainTypedValues() {
          scope.valueStore.lang.setData('');
          scope.valueStore.dtype.setData('');
          scope.lang = '';
          scope.type = '';
        }

        initMeta();

        scope.rdfTermTypeTags = {
          plain : 'Plain',
          typed : 'Typed',
          uri : 'URI'
        };

        scope.termValue = scope.valueStore.lex.getData();

        console.log('rdfTermType', scope.initTermType);


        if(scope.rdfTermType === 'plain') { scope.lang = scope.valueStore.lang.getData(); }
        if(scope.rdfTermType === 'typed') { scope.type = scope.valueStore.dtype.getData().getUri(); }

        scope.$watch(function(){
          return scope.rdfTermType;
        }, function(newVal){
          scope.rdfTermType = newVal;
          scope.rdfTermTypeValue = scope.rdfTermTypeTags[newVal];
          console.log('new rdfTermType', newVal);
          if (scope.rdfTermType === 'uri') {
            resetPlainTypedValues();
            /*var uri = '<' + scope.termValue + '>';
            scope.valueStore.lex.setData(uri);*/
            scope.valueStore.lex.setData(scope.termValue, scope.rdfTermType);
          }
        });

        console.log('type meta', scope.rdfTermType);

        scope.isTypedTermType = function (type) {
          return type === 'typed' ? true: false;
        };

        scope.isPlainTermType = function (type) {
          return type === 'plain' ? true : false;
        };

        scope.isUriTermType = function (type) {
          return type === 'uri' ? true : false;
        };

        scope.setRdfTermType = function (type) {
          console.log('selected type', type);
          //scope.rdfTermType = type;
          for (var scopeEle in scopeCache[scope.rdfTermId]) {
            scopeCache[scope.rdfTermId][scopeEle].rdfTermType = type;
          }
        };

        scope.$watch(function() {
          return element.attr('rdf-term-type');
        }, function(newValue){
          element.attr('rdf-term-type', newValue);
        });

        scope.$watch(function () {
          return scope.termValue;
        }, function(newValue) {
          console.log('model changed: ', newValue);
          /*if (scope.rdfTermType === 'uri') {
            newValue = '<' + newValue + '>';
            scope.valueStore.lex.setData(newValue);
          } else {
            scope.valueStore.lex.setData(newValue);
          }*/
          scope.valueStore.lex.setData(newValue, scope.rdfTermType);
        });

        scope.$watch(function() {
          return scope.valueStore.lex.getData();
        }, function(newValue) {
          console.log('data reset: ', newValue);
          if (scope.rdfTermType === 'uri') {
            scope.termValue = newValue.replace(/<|>/gi,'');
          } else {
            scope.termValue = newValue;
          }
        });

      }
    };
  });
