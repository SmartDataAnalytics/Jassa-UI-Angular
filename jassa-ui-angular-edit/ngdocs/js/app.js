var jassa = new Jassa(Promise, $.ajax);

angular.module(
  'jassa.ui.edit.demo.widgets',
  ['dddi', 'ngSanitize', 'ui.jassa', 'ui.bootstrap', 'ui.select', 'ui.jassa.edit', 'ui.jassa.rex', 'ui.codemirror', 'ngAnimate'])

  // This is deprecated
  //     .config(['$parseProvider', function($parseProvider) {
  //         $parseProvider.unwrapPromises(true);
  //     }])

  .config(function(GeocodingLookupProvider) {
    /*
     GeocodingLookupProvider.setConfiguration({
     service: ['LinkedGeoData', 'Nominatim'],
     defaultService: true
     });
     */
    // set NOKIA service
    GeocodingLookupProvider.setService({
      label: 'Nokia HERE',
      serviceType: 'rest',
      url: 'http://geocoder.cit.api.here.com/6.2/geocode.json',
      data: {
        app_id: 'DemoAppId01082013GAL',
        app_code: 'AJKnXv84fjrb0KIHawS0Tg',
        additionaldata: 'IncludeShapeLevel,default',
        mode: 'retrieveAddresses',
        searchtext: '%KEYWORD%'
      },
      fnSuccess: function(response) {
        var data = response.data.Response.View.length > 0 ? response.data.Response.View[0].Result : [];
        var resultSet = [];
        for(var i in data) {
          if(data[i].Location.hasOwnProperty('Shape')) {
            resultSet.push({
              'firstInGroup': false,
              'wkt': data[i].Location.Shape.Value,
              'label': data[i].Location.Address.Label,
              'group': 'Nokia HERE'
            });
          }
        }
        return resultSet;
      }
    });

    // set LINKEDGEODATA service
    GeocodingLookupProvider.setService({
      label: 'LinkedGeoData (User Config)',
      serviceType: 'sparql',
      endpoint: 'http://linkedgeodata.org/vsparql',
      graph: 'http://linkedgeodata.org/ne/',
      prefix: {
        ogc: 'http://www.opengis.net/ont/geosparql#',
        geom: 'http://geovocab.org/geometry#'
      },
      query: '{'
        +' Graph <http://linkedgeodata.org/ne/> {'
        +' ?s a <http://linkedgeodata.org/ne/ontology/Country> ;'
        +' rdfs:label ?l ;'
        +' geom:geometry ['
        +'  ogc:asWKT ?g'
        +' ] '
        +' FILTER regex(?l, "%KEYWORD%", "i") '
        +' } '
        +'}',
      sponateTemplate: [{
        id: '?s',
        label: '?l',
        wkt: '?g'
      }],
      limit: 5,
      fnSuccess: function(response) {
        var data = response;
        var resultSet = [];
        if (data.length > 0) {
          for(var i in data) {
            resultSet.push({
              'firstInGroup': false,
              'wkt': data[i].val.wkt,
              'label': data[i].val.label,
              'group': 'LinkedGeoData (User Config)'
            });
          }
        }
        return resultSet;
      }
    });
  })

  .controller('AppCtrl', ['$scope', '$dddi', '$location', '$anchorScroll', '$timeout', '$http', '$q',
    function($scope, $dddi, $location, $anchorScroll, $timeout, $http, $q) {

      var dddi = $dddi($scope);

      $scope.JSON = JSON;

      // Begin of REX Setup

      $scope.defaultNgModelOptions = {
        //updateOn: 'default blur',
        debounce: {
          'default': 300,
          'blur': 0
        }
      };

      $scope.editCounter = 0;

      $scope.datasetSparqlService = jassa.service.SparqlServiceBuilder
        .http('http://localhost:8870/sparql', ['http://datasets.org/'], {type: 'POST'})
        .create();





      dddi.register('sparqlService', ['editCounter', function() {
        var r = jassa.service.SparqlServiceBuilder
          //.http('http://dbpedia.org/sparql', ['http://dbpedia.org'], {type: 'POST'})
          .http('http://akswnc3.informatik.uni-leipzig.de/data/jassa/sparql', ['http://dbpedia.org'], {type: 'POST'})
          //.http('http://localhost/data/pokedex/sparql', ['http://pokedex.org/'], {type: 'POST'})
          .virtFix().paginate(50000).pageExpand(100).create();

        return r;
      }]);


      // TODO Somehow update .cache() on update

      var updateService = new jassa.service.SparqlUpdateHttp('http://akswnc3.informatik.uni-leipzig.de/data/jassa/sparql', ['http://dbpedia.org']);

      $scope.UpdateUtils = jassa.service.UpdateUtils;

      console.log('UpdateUtils: ', $scope.UpdateUtils);


      $scope.performUpdate = function(rexContext, prefixMapping, form) {
        //var updateService = $scope.active.service.updateService;

        var x = jassa.service.UpdateUtils.performUpdate(updateService, rexContext.diff, prefixMapping)
          .then(function() {
            form.$setPristine();
            var r = rexContext.reset();
            return r;
          });

        // Note: Only when the update is successful do we reset the form to pristine
        // This will retain edits in case of failure
        $q.when(x).then(function() {
          ++$scope.editCounter;
          //alert('Update successful');
        }, function(e) {
          ++$scope.editCounter;
          //alert('Update failed with reason: ' + e.responseText);
        });
      };

      /*
       $scope.performUpdate = function(diff, prefixMapping) {
       var str;
       str = $scope.createDeleteRequest(diff.removed, prefixMapping);
       var p1 = updateService.createUpdateExecution(str).execUpdate();

       str = $scope.createInsertRequest(diff.added, prefixMapping);
       var p2 = updateService.createUpdateExecution(str).execUpdate();

       Promise.all([p1, p2]).then(function() {
       alert('Success - I will now refresh - ya, will make that nicer soon');
       location.reload();
       }, function() {
       alert('Failed');
       });

       /*
       var request = $http({
       method: 'post',
       url: "api/index.cfm",
       params: {
       action: "get"
       }
       });* /

       //$http

       };

       $scope.createInsertRequest = function(graph, prefixMapping) {
       var result;
       if(graph) {
       var quads = jassa.sparql.QuadUtils.triplesToQuads(graph);
       result = '' + new jassa.sparql.UpdateDataInsert(quads);
       } else {
       result = '';
       }
       return result;
       };

       $scope.createDeleteRequest = function(graph, prefixMapping) {
       var result;
       if(graph) {
       var quads = jassa.sparql.QuadUtils.triplesToQuads(graph);
       result = '' + new jassa.sparql.UpdateDataDelete(quads);
       } else {
       result = '';
       }
       return result;
       };
       */

      $scope.lookupFn = function(node) {
        var result = jassa.service.ServiceUtils.execDescribeViaSelect(sparqlService, [node]);
        return result;
      };

      $scope.newGraph = function() {
        return new jassa.rdf.GraphImpl();
      };


      $scope.graphToTurtle = function(graph, prefixMapping) {
        var talis = graph ? jassa.io.TalisRdfJsonUtils.triplesToTalisRdfJson(graph) : null;
        var r = talis ? jassa.io.TalisRdfJsonUtils.talisRdfJsonToTurtle(talis, prefixMapping) : '';
        return r;
      }
      // End of REX Setup

      // Some Utils for geo stuff
      $scope.PointUtils = jassa.geo.PointUtils;


      // Helper for date parsing / serialization
      // !!! Does not actually produce date strings as demanded by xsd date(Time) !!!
      // !!! Its just a proof of concept !!!
      // TODO integrate moment.js
      // Native Javascript Date features seem to be insanely useless when it comes to RDF :/
      $scope.dateToString = function(x) {
        var r = !x ? null : moment(x).toISOString();
        //var r = !x ? null : x.toUTCString();
        return r;
      };

      $scope.parseDate = function(x) {
        var r = !x ? null : moment(x).toDate();
        //var r = !x ? null : new Date(x);
        return r;
      };


      // Helper to keep an input field at the top of the page
      $scope.scrollTo = function(target) {
        $timeout(function() {
          $location.hash(target);
          $anchorScroll();
        }, 50);
      };

      // Code mirror setup
      $scope.editorOptions = {
        ttl: {
          lineWrapping : true,
          lineNumbers: true,
          tabMode: 'indent',
          matchBrackets: true,
          mode: 'text/turtle',
          readOnly: true
        }
      };

      // Angular UI date picker set up
      $scope.dp = {};

      $scope.clear = function () {
        $scope.dt = null;
      };

      // Disable weekend selection
      $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      };

      $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
      };
      $scope.toggleMin();

      $scope.dp.opened = false;
      $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.dp.opened = true;
      };

      $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1
      };

      $scope.copy = angular.copy;

      //showAngularStats();
    }]);