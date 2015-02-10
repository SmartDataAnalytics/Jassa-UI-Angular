angular.module('ui.jassa.geometry-input', [])

  .directive('geometryInput', ['$http', '$q', function($http, $q) {

    var uniqueId = 1;

    return {
      restrict: 'EA',
      priority: 4,
      require: ['^ngModel'],
      templateUrl: 'template/geometry-input/geometry-input.html',
      replace: true,
      scope: {
        bindModel: '=ngModel',
        ngModelOptions: '=?'
      },
      controller: ['$scope', function($scope) {
        $scope.ngModelOptions = $scope.ngModelOptions || {};
        $scope.geometry = 'point';
        $scope.isLoading = false;

        $scope.getGeocodingInformation = function(searchString, successCallback) {

          var url = 'http://nominatim.openstreetmap.org/search/?q='+searchString+'&format=json&polygon_text=1';

          var responsePromise = $http({
            'method': 'GET',
            'url': url,
            'cache': true,
            'headers' : {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });

          responsePromise.success(function(data, status, headers, config) {
            if(angular.isFunction(successCallback)) {
              successCallback(data, responsePromise);
            }

          });
          responsePromise.error(function(data, status, headers, config) {
            alert('AJAX failed!');
          });
        };

        var createSparqlService = function(url, graphUris) {
          var result = jassa.service.SparqlServiceBuilder.http(url, graphUris, {type: 'POST'})
            .cache().virtFix().paginate(1000).pageExpand(100).create();

          return result;
        };

        $scope.fetchResultsForRestService = function(restServiceConfig, searchString) {
          return $http({
            'method': 'GET',
            'url': restServiceConfig.endpoint+searchString,
            'cache': true,
            'headers' : {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
        };

        $scope.fetchResultsForSparqlService = function(sparqlServiceConfig, searchString) {

          var sparqlService = createSparqlService(sparqlServiceConfig.endpoint, sparqlServiceConfig.graph);

          var store = new jassa.sponate.StoreFacade(sparqlService, _(sparqlServiceConfig.prefix)
            .defaults(jassa.vocab.InitialContext));

          store.addMap({
            name: 'sparqlService',
            template: [{
              id: '?s',
              label: '?l', // kann man dann noch besser machen - aber fürs erste passts
              wkt: '?g',
              group: '' + sparqlServiceConfig.name
            }],
            from: sparqlServiceConfig.query
          });

          return store.sparqlService.getListService().fetchItems(null, 10);
        };

        $scope.fetchResults = function(searchString) {
          // Geocoding APIs
          var sources = {
            restService: [
              {
                name: 'Nominatim',
                endpoint: 'http://nominatim.openstreetmap.org/search/?format=json&polygon_text=1&q='
              },
              {
                name: 'Nokia HERE',
                endpoint: 'http://geocoder.cit.api.here.com/6.2/geocode.json?app_id=DemoAppId01082013GAL&app_code=AJKnXv84fjrb0KIHawS0Tg&additionaldata=IncludeShapeLevel,default&mode=retrieveAddresses&searchtext='
              }
            ],
            sparqlService: [
              {
                'name' : 'LinkedGeoData (Natural Earth)',
                'endpoint' : 'http://linkedgeodata.org/vsparql',
                'graph' : 'http://linkedgeodata.org/ne/',
                'type' : 'http://linkedgeodata.org/ne/ontology/Country',
                'active' : false,
                'facets' : false,
                'prefix' : {
                  ogc: 'http://www.opengis.net/ont/geosparql#',
                  geom: 'http://geovocab.org/geometry#'
                },
                'query' : '{'
                  +' Graph <http://linkedgeodata.org/ne/> {'
                  +' ?s a <http://linkedgeodata.org/ne/ontology/Country> ;'
                  +' rdfs:label ?l ;'
                  +' geom:geometry ['
                  +'  ogc:asWKT ?g'
                  +' ] '
                  +' FILTER regex(?l, "'+ searchString +'", "i") '
                  +' } '
                  +'}'
              }
            ]
          };

          // stores promises for each geocoding api
          var promises = [];
          for (var serviceType in sources) {
            if (serviceType === 'restService') {
              for(var r in sources.restService) {
                var restService = sources.restService[r];
                  promises.push($scope.fetchResultsForRestService(restService, searchString));
              }
            }

            if (serviceType === 'sparqlService') {
              for(var s in sources.sparqlService) {
                var sparqlService = sources.sparqlService[s];
                promises.push($scope.fetchResultsForSparqlService(sparqlService, searchString));
              }
            }

          }

          // after getting the response then process the response promise
          var resultPromise = $q.all(promises).then(function(responses){

            var results = [];

            for (var i in responses) {
              // used to grab the hostname a.href = url -> a.hostname
              var a = document.createElement('a');

              for (var j in responses[i].data) {
                // Nominatim
                if(i==='0') {
                  a.href = responses[i].config.url;
                  if (responses[i].data[j].hasOwnProperty('geotext')) {
                    results.push({
                      'firstInGroup': false,
                      'wkt': responses[i].data[j].geotext,
                      'label': responses[i].data[j].display_name,
                      'group': sources.restService[i].name || a.hostname
                    });
                  }
                }

                // Nokia HERE Maps Sample
                if(i==='1') {
                  a.href = responses[i].config.url;
                  if (responses[i].data[j].View.length > 0) {
                    for(var k in responses[i].data[j].View[0].Result) {
                      if(responses[i].data[j].View[0].Result[k].Location.hasOwnProperty('Shape')) {
                        results.push({
                          'firstInGroup': false,
                          'wkt': responses[i].data[j].View[0].Result[k].Location.Shape.Value,
                          'label': responses[i].data[j].View[0].Result[k].Location.Address.Label,
                          'group': sources.restService[i].name || a.hostname
                        });
                      }
                    }
                  }
                }
              }

              // LinkedGeoData
              if(i==='2') {
                if (responses[i].length > 0) {
                  for(var l in responses[i]) {
                    results.push({
                      'firstInGroup': false,
                      'wkt': responses[i][l].val.wkt,
                      'label': responses[i][l].val.label,
                      'group': responses[i][l].val.group
                    });
                  }
                }
              }
            }

            // mark the first of each group for headlines
            results = _(results).groupBy('group');
            results = _(results).map(function(g) {
              g[0].firstInGroup = true;
              return g;
            });
            results = _(results).flatten();
            results = _(results).value();

            //console.log('results', results);

            return results;
          });

          return resultPromise;
        };

        $scope.onSelectGeocode = function(item) {
          console.log('onselect', item);
          $scope.bindModel = item.wkt;
        };
      }],
      compile: function(ele, attrs) {
        return {
          pre: function (scope, ele, attrs) {
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

            /** Disabled
            scope.$watch(function () {
              return scope.searchString;
            }, function (newValue) {
              console.log('searchString', newValue);
              if (newValue.length > 3) {
                scope.getGeocodingInformation(newValue, function(data) {
                  console.log('getGeocodingInformation', data);
                  for (var i in data) {
                    if(data[i].geotext != null) {
                      parseWKT(data[i].geotext);
                    }
                  }
                });
              }
              //scope.searchResults = scope.fetchGeocodingResults(newValue);
            });
            */

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
              scope.$apply();
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
