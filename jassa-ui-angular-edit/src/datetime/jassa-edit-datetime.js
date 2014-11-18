angular.module('jassa.ui.edit.datetime', ['ui.bootstrap', 'ui.jassa'])
  .directive('jassaEditDatetime', function($compile) {

    var uniqueId = 1;
    var registeredObjectRefs = [];

    function loadSuitableWidget(fnCurrDtype, fnDatepickerId) {
      for (var i in registeredObjectRefs) {
        var currObjectElement = registeredObjectRefs[i];

        if (currObjectElement.find('input').hasClass(fnDatepickerId)) {
          // reset input
          currObjectElement.find('.' + fnDatepickerId).datepicker('destroy');
          currObjectElement.find('.' + fnDatepickerId).removeClass('hasDatepicker');

          if (fnCurrDtype === "http://www.w3.org/2001/XMLSchema#date") {
            currObjectElement.find('.' + fnDatepickerId).datepicker({
              dateFormat: $.datepicker.ISO_8601,
              // showOn: 'both',
              firstDay: 1,
              beforeShow: function() {
                setTimeout(function(){
                  jQuery('.ui-datepicker').css('z-index', 99999999999999);
                }, 0);
              }
            });
            currObjectElement.find('.icon').addClass('fa-calendar').removeClass('fa-clock-o');
          }

          if (fnCurrDtype === "http://www.w3.org/2001/XMLSchema#dateTime") {
            currObjectElement.find('.' + fnDatepickerId).datetimepicker({
              separator: 'T',
              dateFormat: $.datepicker.ISO_8601,
              showSecond: true,
              timeFormat: 'HH:mm:ssZ',
              showTimezone: true,
              timezone: "+00:00",
              firstDay: 1,
              beforeShow: function() {
                setTimeout(function(){
                  jQuery('.ui-datepicker').css('z-index', 99999999999999);
                }, 0);
              }
            });
            currObjectElement.find('.icon').addClass('fa-calendar').removeClass('fa-clock-o');
          }

          if (fnCurrDtype === "http://www.w3.org/2001/XMLSchema#time") {
            currObjectElement.find('.' + fnDatepickerId).timepicker({
              showSecond: true,
              timeFormat: 'HH:mm:ssZ',
              showTimezone: true,
              timezone: "+00:00",
              beforeShow: function() {
                setTimeout(function(){
                  jQuery('.ui-datepicker').css('z-index', 99999999999999);
                }, 0);
              }
            });
            currObjectElement.find('.icon').addClass('fa-clock-o').removeClass('fa-calendar');
          }
        }
      }
    }


    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'template/datetime/jassa-edit-datetime.html',
      transclude: false,
      scope: {
        'valueStore': '='
        //model: '=ngModel'
        //'ngModel': '='
      },
      //controller: 'JassaEditTextCtrl',
      link: function(scope, element, attrs) {
        //var datepickerId = 'datepicker-' + uniqueId++;
        var datepickerId = 'datepicker-' + scope.valueStore.lex.getObjectRef().toString().replace(/[^\w\s]|http|\s/gi, '');
        element.find('input').addClass(datepickerId);

        registeredObjectRefs.push(element);

        scope.datatypeTags = {
          'http://www.w3.org/2001/XMLSchema#date': 'xsd:date',
          'http://www.w3.org/2001/XMLSchema#dateTime': 'xsd:dateTime',
          'http://www.w3.org/2001/XMLSchema#time': 'xsd:time'
        };

        scope.datatype = scope.valueStore.dtype.getData().getUri();
        scope.typedValue = scope.valueStore.lex.getData();


        scope.setDatatype = function(tag) {
          scope.datatype = tag ? tag : '';
        };

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
          loadSuitableWidget(scope.datatype, datepickerId);
        });
      }
    };
  });
