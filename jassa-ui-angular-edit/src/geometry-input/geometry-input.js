
angular.module('ui.jassa.geometry-input', [])


  /**
   * @ngdoc interface
   * @name ui.jassa.geometry-input.provider:GeocodingLookup
   *
   * @description
   * This provider is usually used to set geocoding apis like NOKIA HERE,
   * which will be requested when typing a location into the
   * geocoding-input directive search input field.
   * Furthermore you can enable/disable pre-defined geocoding apis.
   *
   * @example
   <pre>
   // use the .config section to set up the GeocodingLookupProvider
   angular.module('mymodule', []).config(GeocodingLookupProvider) {
     GeocodingLookupProvider.setService(serviceConfig);
   };


   // Set GeocodingLookupProvider configurations
   GeocodingLookupProvider.setConfiguration({
     // use both pre-configured services
     service: ['LinkedGeoData', 'Nominatim'],
     // if own services are set, also the pre-configured services will be used
     defaultService: true
   });

   // Set up a rest service
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

   // Set up a sparql service
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
   </pre>
   */
  .provider('GeocodingLookup', function() {

    this.config = {
      service: ['Nominatim', 'LinkedGeoData'],
      defaultService: false
    };

    // a collection of pre-set service configs
    this.defaultServices = {
      Nominatim: {
        label: 'Nominatim',
        serviceType: 'rest',
        url: 'http://nominatim.openstreetmap.org/search/?format=json&polygon_text=1&q=',
        data: {
          format: 'json',
          polygon_text: '1',
          q: '%KEYWORD%'
        },
        fnSuccess: function(response) {
          var data = response.data;
          var resultSet = [];
          for (var i in data) {
            if (data[i].hasOwnProperty('geotext')) {
              resultSet.push({
                firstInGroup: false,
                wkt: data[i].geotext,
                label: data[i].display_name,
                group: 'Nominatim'
              });
            }
          }
          return resultSet;
        }
      },
      LinkedGeoData: {
        label: 'LinkedGeoData',
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
                'group': 'LinkedGeoData'
              });
            }
          }
          return resultSet;
        }
      }
    };

    // stores service configs which are set by the
    // GeocodingLookupProvider.setService function call
    this.userServices = {};

    this.$get = function() {
      // inject $http and $q
      var initInjector = angular.injector(['ng']);
      var $http = initInjector.get('$http');
      var $q = initInjector.get('$q');

      var promiseCache = {
        /** Meta Information
         * [{
         *   label: x,
         *   promiseID: y
         * }]
         */
        promisesMetaInformation: [],
        promises: []
      };

      // use default config of geocoding services when no services are set by user
      var useServiceConfig = {};

      for (var i in this.config.service) {
        var serviceLabel = this.config.service[i];
        useServiceConfig[serviceLabel] = this.defaultServices[serviceLabel];
      }

      if(!_(this.userServices).isEmpty()) {
        if (this.config.defaultService) {
          _(useServiceConfig).extend(this.userServices);
        } else {
          useServiceConfig = this.userServices;
        }
      }

      var setPromise = function(serviceLabel, promise) {
        // needed for identify a promise to a service
        // the first promise matches the first promiseMetaInformation
        var promiseID = promiseCache.promises.length;
        promiseCache.promisesMetaInformation.push({
          label: serviceLabel,
          promiseID: promiseID
        });
        promiseCache.promises.push(promise);
      };

      // returns the promiseCache
      var getPromises = function() {
        return promiseCache;
      };

      var clearPromiseCache = function() {
        promiseCache.promises = [];
        promiseCache.promisesMetaInformation = [];
      };

      var createSparqlService = function(url, graphUris) {
        var result = jassa.service.SparqlServiceBuilder.http(url, graphUris, {type: 'POST'})
          .cache().virtFix().paginate(1000).pageExpand(100).create();
        return result;
      };

      var requestGeocodingService = function(service, keyword) {
        if (service.serviceType === 'rest') {
          return restServiceRequest(service, keyword);
        }
        if (service.serviceType === 'sparql') {
          return sparqlServiceRequest(service, keyword);
        }
      };

      var restServiceRequest = function(service, keyword) {
        var queryString = queryData(service.data).replace(/%KEYWORD%/gi,keyword);
        return $http({
          'method': 'GET',
          'url': service.url+'?'+queryString,
          'cache': true,
          'headers' : {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
      };

      var sparqlServiceRequest = function(service, keyword) {

        var sparqlService = createSparqlService(service.endpoint, service.graph);

        var store = new jassa.sponate.StoreFacade(sparqlService, _(service.prefix)
          .defaults(jassa.vocab.InitialContext));

        var query = service.query.replace(/%KEYWORD%/gi,keyword);

        var limit = service.limit || 10;

        store.addMap({
          name: 'sparqlService',
          template: service.sponateTemplate,
          from: query
        });

        return store.sparqlService.getListService().fetchItems(null, limit);
      };

      var queryData = function(data) {
        var ret = [];
        for (var d in data) {
          ret.push(d + '=' + data[d]);
        }
        return ret.join('&');
      };

      var firstInGroupTrue = function(results) {
        results = _(results).flatten();
        // mark the first of each group for headlines
        results = _(results).groupBy('group');
        results = _(results).map(function(g) {
          g[0].firstInGroup = true;
          return g;
        });
        results = _(results).flatten();
        results = _(results).value();
        return results;
      };

      return {
        findByKeyword: function(keyword) {
          // clear promise cache for new requests
          clearPromiseCache();

          // start requesting the services and collect the promises
          for(var serviceLabel in useServiceConfig) {
            var service = useServiceConfig[serviceLabel];
            var promise = requestGeocodingService(service, keyword);
            setPromise(serviceLabel, promise);
          }

          // wait until all requests are done and return final resultSet
          var promiseCache = getPromises();
          var resultPromise = $q.all(promiseCache.promises).then(function(response) {
            var results = [];
            // iterate through all responses and insert the result into results
            for (var i in response) {
              var data = response[i];
              var serviceLabel = promiseCache.promisesMetaInformation[i].label;
              // insert the result of a response into the final results-array
              var result = useServiceConfig[serviceLabel].fnSuccess(data);
              results.push(result);
            }

            return firstInGroupTrue(results);
          });

          return resultPromise;
        }
      };
    };


    /**
     * @ngdoc method
     * @name ui.jassa.geometry-input.provider:GeocodingLookup#setService
     * @methodOf ui.jassa.geometry-input.provider:GeocodingLookup
     * @description Add a new geocoding service
     * @param {Object} serviceConfig A new serviceConfig
     */
    this.setService = function(serviceConfig) {
      this.userServices[serviceConfig.label] = serviceConfig;
    };



    /**
     * @ngdoc method
     * @name ui.jassa.geometry-input.provider:GeocodingLookup#setConfiguration
     * @methodOf ui.jassa.geometry-input.provider:GeocodingLookup
     * @description
     * Set configuration parameters. E.g. disable the
     * pre-definied geocoding services.
     *
     * @param {Object} userConfig Configuration which will overwrite the default config
     */
    this.setConfiguration = function(userConfig) {
      _(this.config).extend(userConfig);
    };

  })




  /**
   * @ngdoc directive
   * @name ui.jassa.geometry-input.directive:geometryInput
   * @element geometry-input
   * @function
   * @restrict EA
   *
   * @description
   * This directives creates a map for setting/displaying a location on a map.
   * Furthermore it is possible to draw/edit polygons, line, boxes and points.
   *
   * @example
   <example module="geometryInputExample">
   <file name="index.html">
   <div ng-controller="AppCtrl">
     <p>
       <span>current model value: {{term.value}}</span>
     </p>
     <p>
       <geometry-input ng-model="term.value"></geometry-input>
     </p>
   </div>
   </file>
   <file name="script.js">
   jassa = new Jassa(Promise, $.ajax);
   angular.module(
   'geometryInputExample',
   ['dddi', 'ngSanitize', 'ui.jassa', 'ui.bootstrap', 'ui.select', 'ui.jassa.edit', 'ui.jassa.rex', 'ui.codemirror', 'ngAnimate'])
   .controller('AppCtrl', ['$scope', '$dddi', '$location', '$anchorScroll', '$timeout', '$http', '$q',
   function($scope, $dddi, $location, $anchorScroll, $timeout, $http, $q) {

      $scope.term = {
        value: 'POLYGON((5.639629 55.426467,9.243144 47.164749,19.438457 51.559280,17.680644 57.887405,5.639629 55.426467))'
      };

      // Begin of REX Setup

      $scope.defaultNgModelOptions = {
          //updateOn: 'default blur',
          debounce: {
              'default': 300,
              'blur': 0
          }
      };
    }]);
   </file>
   </example>
   */
  .directive('geometryInput', ['$http', '$q', 'GeocodingLookup', function($http, $q, GeocodingLookup) {

    var uniqueId = 1;

    return {
      restrict: 'EA',
      priority: 4,
      require: '?ngModel',
      templateUrl: 'template/geometry-input/geometry-input.html',
      replace: true,
      scope: {
        bindModel: '=ngModel',
        ngModelOptions: '=?',
        geocodingServices: '=geocodingServices'
      },
      controller: ['$scope', function($scope) {

        $scope.ngModelOptions = $scope.ngModelOptions || {};
        $scope.geometry = 'point';
        $scope.isLoading = false;

        $scope.fetchResults = function(searchString) {
          return GeocodingLookup.findByKeyword(searchString);
        };

        $scope.onSelectGeocode = function(item) {
          console.log('onselect', item);
          $scope.bindModel = item.wkt;
        };
      }],
      compile: function(ele, attrs) {
        return {
          pre: function (scope, ele, attrs, ngModel) {
            ngModel.$name = scope.$eval(attrs.name);

            scope.searchString = '';

            var map, drawControls, polygonLayer, panel, wkt, vectors;

            scope.$watch(function () {
              return scope.bindModel;
            }, function (newValue, oldValue) {
              //console.log('old value of input', oldValue);
              // clear layer
              vectors.destroyFeatures();
              // set config data with changed input value ...
              scope.bindModel = newValue;
              // ... then call parseWKT to redraw the feature
              if (scope.bindModel != null) {
                parseWKT();
              }
            });

            scope.$watch(function () {
              return scope.geometry;
            }, function (newValue) {
              //console.log('radio', scope.geometry-input-input);
              //scope.geometry-input-input = newValue;
              toggleControl();
            });


            function init() {
              // generate custom map id
              var mapId = 'openlayers-map-' + uniqueId++;
              // set custom map id
              ele.find('.map').attr('id', mapId);
              // init openlayers map with custom map id
              map = new OpenLayers.Map(mapId);

              var wmsLayer = new OpenLayers.Layer.WMS('OpenLayers WMS',
                'http://vmap0.tiles.osgeo.org/wms/vmap0?', {layers: 'basic'});

              panel = new OpenLayers.Control.Panel({'displayClass': 'olControlEditingToolbar'});

              var snapVertex = {methods: ['vertex', 'edge'], layers: [vectors]};

              // allow testing of specific renderers via "?renderer=Canvas", etc
              var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
              renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

              vectors = new OpenLayers.Layer.Vector('Vector Layer', {
                renderers: renderer
              });

              map.addLayers([wmsLayer, vectors]);
              map.addControl(new OpenLayers.Control.LayerSwitcher());
              map.addControl(new OpenLayers.Control.MousePosition());

              vectors.events.on({
                sketchcomplete: GeometryWasDrawn
              });

              wkt = new OpenLayers.Format.WKT();

              drawControls = {
                point: new OpenLayers.Control.DrawFeature(vectors,
                  OpenLayers.Handler.Point, {
                    displayClass: 'olControlDrawFeaturePoint',
                    handlerOptions: snapVertex}),
                line: new OpenLayers.Control.DrawFeature(vectors,
                  OpenLayers.Handler.Path, {
                    displayClass: 'olControlDrawFeaturePath',
                    handlerOptions: snapVertex}),
                polygon: new OpenLayers.Control.DrawFeature(vectors,
                  OpenLayers.Handler.Polygon, {
                    displayClass: 'olControlDrawFeaturePolygon',
                    handlerOptions: snapVertex}),
                box: new OpenLayers.Control.DrawFeature(vectors,
                  OpenLayers.Handler.RegularPolygon, {
                    displayClass: 'olControlDrawFeatureBox',
                    handlerOptions: _.extend({
                      sides: 4,
                      irregular: true
                    }, snapVertex)
                  }),
                modify: new OpenLayers.Control.ModifyFeature(vectors, {
                  snappingOptions: snapVertex,
                  onModificationStart: onModificationStart,
                  onModification: onModification,
                  onModificationEnd: onModificationEnd
                })
              };

              panel.addControls(drawControls['modify']);
              map.addControl(panel);
              panel.activateControl(drawControls.modify);

              for (var key in drawControls) {
                map.addControl(drawControls[key]);
              }

              map.setCenter(new OpenLayers.LonLat(0, 0), 4);
            }

            function GeometryWasDrawn(drawnGeometry) {
              /*var ft = polygonLayer.features;
              for(var i=0; i< ft.length; i++){
                console.log(polygonLayer.features[i].geometry-input-input.getBounds());
                displayWKT(polygonLayer.features[i]);
              }*/
              var wktValue = generateWKT(drawnGeometry.feature);
              scope.bindModel = wktValue;
              scope.$apply();
            }

            function generateWKT(feature) {
              var str = wkt.write(feature);
              str = str.replace(/,/g, ', ');
              return str;
            }

            function parseWKT(pWktString) {
              var wktString = pWktString || scope.bindModel;
              //console.log('parseWKT', scope.bindModel);
              var features = wkt.read(wktString);
              var bounds;
              if (features) {
                if (features.constructor != Array) {
                  features = [features];
                }
                for (var i = 0; i < features.length; ++i) {
                  if (!bounds) {
                    bounds = features[i].geometry.getBounds();
                  } else {
                    bounds.extend(features[i].geometry.getBounds());
                  }

                }
                vectors.addFeatures(features);
                map.zoomToExtent(bounds);
                var plural = (features.length > 1) ? 's' : '';
                //console.log('Added WKT-String. Feature' + plural + ' added');
              } else {
                console.log('Bad WKT');
              }
            }

            function toggleControl() {
              //console.log('toggleControl', scope.geometry-input-input);
              var control = drawControls[scope.geometry];
              for (var key in drawControls) {
                control = drawControls[key];
                if (scope.geometry == key) {
                  control.activate();
                } else {
                  control.deactivate();
                }
              }
            }

            function onModificationStart(feature) {
              //console.log(feature.id + ' is ready to be modified');
              drawControls[scope.geometry].deactivate();
            }

            function onModification(feature) {
              //console.log(feature.id + ' has been modified');
              var wktValue = generateWKT(feature);
              scope.bindModel = wktValue;

              // A modification makes this control dirty
              ngModel.$setDirty();

              if(scope.$$phase) {
                  scope.$apply();
              }
            }

            function onModificationEnd(feature) {
              //console.log(feature.id + ' is finished to be modified');
              drawControls[scope.geometry].activate();
            }

            // init openlayers
            init();

            // set geometry-input-input
            var control = drawControls[scope.geometry];
            control.activate();
          }
        };
      }
    };
  }]);
