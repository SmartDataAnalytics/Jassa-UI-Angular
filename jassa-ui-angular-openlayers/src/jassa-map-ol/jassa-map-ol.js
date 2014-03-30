//TODO Move to some better place
Jassa.setOlMapCenter = function(map, config) {
    var zoom = config.zoom;

    var center = config.center;
    var olCenter = null;
    if(center && center.lon != null && center.lat != null) {
        var lonlat = new OpenLayers.LonLat(center.lon, center.lat);
        olCenter = lonlat.clone().transform(map.displayProjection, map.projection);
    }

    if(olCenter != null) {
        map.setCenter(olCenter, zoom);
    }
    else if(zoom != null) {
        map.setZoom(zoom);
    }
};



angular.module('ui.jassa.openlayers.jassa-map-ol', [])

.controller('JassaMapOlCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
        
        var refresh;
        
        var defaultViewStateFetcher = new Jassa.geo.ViewStateFetcher();

        // Make Jassa's ObjectUtils known to the scope - features the hashCode utility function
        $scope.ObjectUtils = Jassa.util.ObjectUtils;
        
        
        $scope.$watch('config', function(config, oldConfig) {
            //console.log('Config update: ', config);
            
            if(_(config).isEqual(oldConfig)) {
                return;
            }
            
            //console.log('Compared: ' + JSON.stringify(config) + ' -> ' + JSON.stringify(oldConfig));
            
            Jassa.setOlMapCenter($scope.map, config);
        }, true);
        

        var watchList = '[map.center, map.zoom, ObjectUtils.hashCode(sources)]'; //viewStateFetcher
        
        $scope.$watch(watchList, function() {
            //console.log('Map refresh: ' + Jassa.util.ObjectUtils.hashCode($scope.config));
            refresh();
        }, true);
        
        
        refresh = function() {
             
            var mapWrapper = $scope.map.widget;
 
            mapWrapper.clearItems();

            var dataSources = $scope.sources;
            
            
            var bounds = Jassa.geo.openlayers.MapUtils.getExtent($scope.map);
            
            _(dataSources).each(function(dataSource) {

                var viewStateFetcher = dataSource.viewStateFetcher || defaultViewStateFetcher;
                
                var sparqlService = dataSource.sparqlService;
                var mapFactory = dataSource.mapFactory;
                //var conceptFactory = dataSource.conceptFactory
                var conceptFactory = dataSource.conceptFactory;
                var concept = conceptFactory.createConcept();
                
                var quadTreeConfig = dataSource.quadTreeConfig;
                
                var promise = viewStateFetcher.fetchViewState(sparqlService, mapFactory, concept, bounds, quadTreeConfig);
                
                // TODO How to obtain the marker style?
                promise.done(function(viewState) {
                    var nodes = viewState.getNodes();
                    
                    _(nodes).each(function(node) {
                        //console.log('booooo', node);
                        if(!node.isLoaded) {
                            //console.log('box: ' + node.getBounds());
                            mapWrapper.addBox('' + node.getBounds(), node.getBounds());
                        }
                        
                        var data = node.data || {};
                        var docs = data.docs || [];

                        _(docs).each(function(doc) {
                            var itemData = {
                                id: doc.id,
                                config: dataSource // Make the dataSource object part of the marker's data
                            };

							var wkt = doc.wkt.getLiteralLexicalForm();

                            mapWrapper.addWkt(doc.id, wkt, itemData);// {fillColor: markerFillColor, strokeColor: markerStrokeColor});
                            
                        });
                    });
                });
                
                
            });
        };
        
}])

//http://jsfiddle.net/A2G3D/1/
.directive('jassaMapOl', function($parse) {
    return {
        restrict: 'EA',
        replace: true,
        template: '<div></div>',
        controller: 'JassaMapOlCtrl',
        scope: {
            config: '=',
            sources: '=',
            onSelect: '&select',
            onUnselect: '&unselect'
        },
        link: function (scope, element, attrs) {
            
            var $el = jQuery(element).ssbMap();
            var widget = $el.data('custom-ssbMap');

            var map = widget.map;
            map.widget = widget;
            
            scope.map = map;

            Jassa.setOlMapCenter(scope.map, scope.config);

            
            var syncModel = function(event) {
                var tmp = scope.map.getCenter();
                var center = tmp.transform(scope.map.projection, scope.map.displayProjection);
                
                //console.log('syncModel', center);

                scope.config.center = {lon: center.lon, lat: center.lat};
                scope.config.zoom = scope.map.getZoom();
                if(!scope.$root.$$phase) {
                    scope.$apply();
                }
            };

            
            $el.on('ssbmapfeatureselect', function(ev, data) {
                scope.onSelect({data: data});
            });

            $el.on('ssbmapfeatureunselect', function(ev, data) {
                scope.onUnselect({data: data});
            });
                    
            
            map.events.register('moveend', this, syncModel);
            map.events.register('zoomend', this, syncModel);
        }
            
    };
})

;
