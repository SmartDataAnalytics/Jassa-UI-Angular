angular.module('ui.jassa.geometry', [])

  .directive('geometry', ['$parse', function($parse) {

    // Some vocab - later we could fetch labels on-demand based on the uris.
    var vocab = {
      iri: 'http://iri',
      plainLiteral: 'http://plainLiteral',
      typedLiteral: 'http://typedLiteral'
    };

    return {
      restrict: 'EA',
      priority: 4,
      require: '^ngModel',
      templateUrl: 'template/geometry/geometry.html',
      replace: true,
      //scope: true,
      scope: {
        //ngModel: '=',
        bindModel: '=ngModel',
        ngModelOptions: '=?',
        logo: '@?',
        langs: '=?', // suggestions of available languages
        datatypes: '=?', // suggestions of available datatypes,
        righButton: '=?'
      },
      controller: ['$scope', function($scope) {

        $scope.state = $scope.$state || {};
        $scope.ngModelOptions = $scope.ngModelOptions || {};
        console.log('rightButton', $scope.rightButton);

      }],
      compile: function(ele, attrs) {
        return {
          pre: function (scope, ele, attrs, ngModel) {

            var map, drawControls, polygonLayer, panel, wkt, vectors;
            //console.log('geometry', scope.geometry);
            //console.log('mapConfig', scope.config);
            //console.log('valueStoreMap', scope.valueStore);

            scope.wkt = scope.state.value || '';
            //scope.chooseGeometry = scope.geometry;
            scope.geometry = 'point';
            scope.chooseGeometry = 'point';


            scope.$watch(function () {
              return scope.wkt;
            }, function (newValue, oldValue) {
              console.log('old value of input', oldValue);
              // clear layer
              vectors.destroyFeatures();
              // set config data with changed input value ...
              scope.state.value = scope.wkt;
              // ... then call parseWKT to redraw the feature
              parseWKT();
            });

            scope.$watch(function () {
              return scope.state.value;
            }, function (newValue) {
              console.log('map data changed: ', newValue);
              //scope.valueStore.setData(newValue);
            });

            scope.$watch(function () {
              //return scope.valueStore.getData();
            }, function (newValue) {
              console.log('data reset for map value: ', newValue);
              scope.wkt = scope.state.value;
            });

            scope.$watch(function () {
              return scope.chooseGeometry;
            }, function (newValue) {
              console.log('radio', scope.chooseGeometry);
              scope.geometry = newValue;
              toggleControl();
            });


            function init() {
              map = new OpenLayers.Map('openlayers-map');

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
                console.log(polygonLayer.features[i].geometry.getBounds());
                displayWKT(polygonLayer.features[i]);
              }*/
              var wktValue = generateWKT(drawnGeometry.feature);
              scope.state.value = wktValue;
              scope.$apply();
            }

            function generateWKT(feature) {
              var str = wkt.write(feature);
              str = str.replace(/,/g, ', ');
              return str;
            }

            function parseWKT() {
              console.log('parseWKT', scope.state.value);
              var features = wkt.read(scope.state.value);
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
                console.log('Added WKT-String. Feature' + plural + ' added');
              } else {
                console.log('Bad WKT');
              }
            }

            function toggleControl() {
              console.log('toggleControl', scope.geometry);
              var control = drawControls[scope.geometry];
              for (var key in drawControls) {
                control = drawControls[key];
                if (scope.geometry == key && scope.chooseGeometry) {
                  control.activate();
                } else {
                  control.deactivate();
                }
              }
            }

            function onModificationStart(feature) {
              console.log(feature.id + ' is ready to be modified');
              drawControls[scope.geometry].deactivate();

            }

            function onModification(feature) {
              console.log(feature.id + ' has been modified');
              var wktValue = generateWKT(feature);
              scope.state.value = wktValue;
              scope.$apply();
            }

            function onModificationEnd(feature) {
              console.log(feature.id + ' is finished to be modified');
              drawControls[scope.geometry].activate();
            }


            // init openlayers
            init();

            // set geometry
            var control = drawControls[scope.geometry];
            control.activate();

            var getValidState = function() {
              var result;

              var state = scope.state;
              // {"type":{"id":"http://typedLiteral","displayLabel":"typed"},"value":"297.6","datatype":"http://dbpedia.org/datatype/squareKilometre"}
              var type = state.type;
              switch(type) {
                case vocab.iri:
                  result = {
                    type: 'uri',
                    value: state.value
                  };
                  break;
                case vocab.plainLiteral:
                  result = {
                    type: 'literal',
                    value: state.value,
                    lang: state.lang,
                    datatype: ''
                  };
                  break;
                case vocab.typedLiteral:
                  result = {
                    type: 'literal',
                    value: state.value,
                    datatype: state.datatype || jassa.vocab.xsd.xstring.getUri()
                  };
                  break;
              }

              return result;
            };

            var convertToState = function(talisJson) {
              // IMPORTANT: We cannot apply defaults here on the value taken from the model,
              // because otherwise
              // we would expose the state based on the defaults, which could
              // in turn update the model again and modify its value
              // Put differently: The model must not be changed unless there is user interaction
              // with this widget!

              //var clone = createTalisJsonObjectWithDefaults(talisJson);
              var clone = talisJson;

              if(clone.type != null && clone.value == null) {
                clone.value = '';
              }

              var node;
              try {
                node = jassa.rdf.NodeFactory.createFromTalisRdfJson(clone);
              } catch(err) {
                // Ignore invalid model values, and just wait for them to become valid
                //console.log(err);
              }


              var result;
              if(!node) {
                result = {};
              } else if(node.isUri()) {
                result = {
                  type: vocab.iri,
                  value: node.getUri()
                };
              } else if(node.isLiteral()) {
                var dt = node.getLiteralDatatypeUri();
                var hasDatatype = !jassa.util.ObjectUtils.isEmptyString(dt);

                if(hasDatatype) {
                  result = {
                    type: vocab.typedLiteral,
                    value: node.getLiteralLexicalForm(),
                    datatype: dt
                  };
                } else {
                  result = {
                    type: vocab.plainLiteral,
                    value: node.getLiteralLexicalForm(),
                    lang: node.getLiteralLanguage()
                  };
                }
              }

              return result;
            };


            scope.$watch(function () {
              var r = scope.bindModel;
              return r;
            }, function(talisJson) {
              //console.log('Got outside change: ', talisJson);
              if (!talisJson) {
              } else {
                var newState = convertToState(talisJson);
                scope.state = newState;
                scope.wkt = newState.value;
              }
            }, true);

            scope.$watch(function () {
              var r = getValidState();
              return r;
            }, function(newValue) {
              if(newValue) {
                angular.copy(newValue, scope.bindModel);
              }
            }, true);

          }
        };
      }
    };
  }]);


