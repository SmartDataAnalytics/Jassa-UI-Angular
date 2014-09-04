angular.module('jassa.ui.edit.demo.widgets.map', ['ui.bootstrap', 'ui.jassa'])
  .directive('jassaEditMap', function() {
    return {
      restrict: 'E',
      replace: true,
      //templateUrl: 'template/constraint-list/constraint-list.html',
      templateUrl: 'components/jassa-edit-map.html',
      transclude: false,
      //require: 'constraintList',
      require: 'ngModel',
      scope: {
        'config': '=',
        'geometry': '=',
        'valueStore': '='
      },
      //controller: 'JassaEditMapCtrl',
      link: function(scope, element, attrs, ngModel) {
        var map, drawControls, polygonLayer, panel, wkt, vectors;
        //console.log('geometry', scope.geometry);
        //console.log('mapConfig', scope.config);
        //console.log('valueStoreMap', scope.valueStore);
        scope.wkt = scope.config.data;
        scope.chooseGeometry = scope.geometry;

        scope.$watch(function() {
          return scope.wkt;
        }, function(newValue, oldValue) {
          console.log('old value of input', oldValue);
          // clear layer
          vectors.destroyFeatures();
          // set config data with changed input value ...
          scope.config.data = scope.wkt;
          // ... then call parseWKT to redraw the feature
          parseWKT();
        });

        scope.$watch(function() {
          return scope.config.data;
        }, function(newValue) {
          console.log('map data changed: ', newValue);
          scope.valueStore.setData(newValue);
        });

        scope.$watch(function() {
          return scope.valueStore.getData();
        }, function(newValue) {
          console.log('data reset for map value: ', newValue);
          scope.wkt = scope.config.data;
        });

        scope.$watch(function() {
          return scope.chooseGeometry;
        }, function(newValue) {
          console.log('radio', scope.chooseGeometry);
          scope.geometry = newValue;
          toggleControl();
        });




        function init() {
          map = new OpenLayers.Map('jassa-edit-map');

          var wmsLayer = new OpenLayers.Layer.WMS("OpenLayers WMS",
            "http://vmap0.tiles.osgeo.org/wms/vmap0?", {layers: 'basic'});

          panel = new OpenLayers.Control.Panel({'displayClass': 'olControlEditingToolbar'});

          var snapVertex = {methods: ['vertex', 'edge'], layers: [vectors]};



          // allow testing of specific renderers via "?renderer=Canvas", etc
          var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
          renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

          vectors = new OpenLayers.Layer.Vector("Vector Layer", {
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
           };*/
          var wktValue = generateWKT(drawnGeometry.feature);
          scope.config.data = wktValue;
          scope.$apply();
        }

        function generateWKT(feature) {
          var str = wkt.write(feature);
          str = str.replace(/,/g, ', ');
          return str;
        }

        function parseWKT() {
          //var element = document.getElementById('wkt');
          var features = wkt.read(scope.config.data);
          var bounds;
          if(features) {
            if(features.constructor != Array) {
              features = [features];
            }
            for(var i=0; i<features.length; ++i) {
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
          for(key in drawControls) {
            var control = drawControls[key];
            if(scope.geometry == key && scope.chooseGeometry) {
              control.activate();
            } else {
              control.deactivate();
            }
          }
        }

        function onModificationStart(feature) {
          console.log(feature.id + " is ready to be modified");
          drawControls[scope.geometry].deactivate();

        }

        function onModification(feature) {
          console.log(feature.id + " has been modified");
          var wktValue = generateWKT(feature);
          scope.config.data = wktValue;
          scope.$apply();
        }

        function onModificationEnd(feature) {
          console.log(feature.id + " is finished to be modified");
          drawControls[scope.geometry].activate();
        }


        // init openlayers
        init();

        // set geometry
        var control = drawControls[scope.geometry];
        control.activate();
      }
    };
  });