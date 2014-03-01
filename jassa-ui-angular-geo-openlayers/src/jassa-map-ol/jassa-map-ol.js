angular.module('ui.jassa.openlayers.jassa-map-ol', [])

.controller('JassaMapOlCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
        
        var refresh;

//        $scope.center = null;
//        $scope.zoom = null;
//        $scope.config = [];
        
        var defaultViewStateFetcher = new Jassa.geo.ViewStateFetcher();

        console.log('scope', $scope);
        console.log('config: ' + Jassa.util.ObjectUtils.hashCode($scope.config), $scope.config);

        // Make Jassa's ObjectUtils known to the scope - features the hashCode utility function
        $scope.ObjectUtils = Jassa.util.ObjectUtils;
        
        //var watchList = '[map.center, map.zoom, ObjectUtils.hashCode(config), viewStateFetcher]';
        var watchList = '[map.center, map.zoom, ObjectUtils.hashCode(config)]'; //viewStateFetcher
        
        $scope.$watch(watchList, function() {
            console.log('Map refresh: ' + Jassa.util.ObjectUtils.hashCode($scope.config));
            refresh();
        }, true);
        
        
        refresh = function() {
             
            var mapWrapper = $scope.map.widget;
 
            mapWrapper.clearItems();

            var configs = $scope.config;
            
            
            var bounds = Jassa.geo.openlayers.MapUtils.getExtent($scope.map);
            
            _(configs).each(function(config) {

                var viewStateFetcher = config.viewStateFetcher || defaultViewStateFetcher;
                
                var sparqlService = config.sparqlService;
                var mapFactory = config.mapFactory;
                //var conceptFactory = config.conceptFactory
                var conceptFactory = config.conceptFactory;
                var concept = conceptFactory.createConcept();
                
                var quadTreeConfig = config.quadTreeConfig;
                
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
                                id: doc.id
                            };
                            
                            mapWrapper.addWkt(doc.id, doc.wkt, itemData);// {fillColor: markerFillColor, strokeColor: markerStrokeColor});
                            
                        });
                    });
                });
                
                
            });
        };
        
}])

//http://jsfiddle.net/A2G3D/1/
.directive('jassaMapOl', function($parse) {
    return {
        restrict: 'EA', // says that this directive is only for html elements
        replace: true,
        template: '<div></div>',
        controller: 'JassaMapOlCtrl',
        scope: {
            config: '=',
            onSelect: '&select',
            onUnselect: '&unselect'
        },
        link: function (scope, element, attrs) {
            
            var $el = jQuery(element).ssbMap();
            var widget = $el.data('custom-ssbMap');

            var map = widget.map;
            map.widget = widget;
            
            scope.map = map;
            //scope.$parent.map = map;
                        
            /*
            var getCenter = $parse('map.center');
            var setCenter = getCenter.assign;
            
            var getCenter = $parse('map.center');
            var setCenter = getCenter.assign;
            */
            
            //var model = $parse(attrs.jassaMapOl);


//            if(model) {
//                //model.assign(scope, map);
//            }


            var syncModel = function(event) {
                console.log('syncModel');

                scope.config.center = scope.map.getCenter();
                scope.config.zoom = scope.map.getZoom();
                if(!scope.$$phase) {
                    scope.$apply();
                }
                /*
                var center = scope.map.getCenter();
                //scope.config.center = {lon: center.lon; lat: center.lat};

//              if(scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') {
//              scope.$apply();
//          }
*/
            };

            /*
            var watchList = '[map.getCenter(), map.getZoom()]';
            scope.$watch(watchList, function() {
                syncModel();
            }, true);
*/
            
/*
            scope.$watch('[config.center, config.zoom]', function(arr) {
                console.log('New map center', arr);
               scope.map.setCenter(arr[0], arr[1]);
            }, true);
*/
//            scope.$watch('config.zoom', function(val) {
//                scope.map.setZoom(val);
//            });
            
            //$(this.el).on("ssbmap2featureselect"
            $el.on('ssbmapfeatureselect', function(ev, data) {
                console.log('args', arguments);
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




/*
    var bounds = ns.MapUtils.getExtent($scope.map)
    //console.log('extent', bounds);
    
//     if(viewStateCtrl == null) {
//         viewStateCtrl = new ns.ViewStateCtrlOpenLayers($scope.map.widget);
//     }


    $scope.map.widget.clearItems();

    
    var mapLinkIndex = 0;
    
    
            var sparqlService = sparqlServiceFactory.createSparqlService(wsConf.sparqlServiceIri, wsConf.defaultGraphIris);
            var facetConfig = conceptSpace.getFacetTreeConfig().getFacetConfig();
            var facetConceptGenerator = facete.FaceteUtils.createFacetConceptGenerator(facetConfig);

            var paths = conceptSpace.getData().activeMapLinkPaths.getArray();
            

            _(paths).each(function(path) {
                
                var markerFillColor = markerFillColors[mapLinkIndex];
                var markerStrokeColor = markerStrokeColors[mapLinkIndex];
                
                var concept = facetConceptGenerator.createConceptResources(path); 
                
                //console.log('PAAAAA ' + geoConcept);
                
                
                var mapFactory = mapLinkFactories[0];
                var promise = viewStateFetcher.fetchViewState(sparqlService, mapFactory, concept, bounds);
                
                promise.done(function(viewState) {
                    var nodes = viewState.getNodes();
                    
                    _(nodes).each(function(node) {
                        //console.log('booooo', node);
                        if(!node.isLoaded) {
                            //console.log('box: ' + node.getBounds());
                            $scope.map.widget.addBox('' + node.getBounds(), node.getBounds());
                        }
                        
                        var data = node.data || {};
                        var docs = data.docs || [];

                        _(docs).each(function(doc) {
     
                            $scope.map.widget.addWkt(doc.id, doc.wkt, {fillColor: markerFillColor, strokeColor: markerStrokeColor});
                        });                 
                    });
                });
                
                ++mapLinkIndex;
            });
                                
        });
    });
    */
    
    //var concept = fctService.createConceptFacetValues(new facete.Path());
/* TODO RE-ENABLE           
    viewStateFetcher.fetchViewState(bounds).done(function(viewState) {
       //var nodes = viewState.getNodes();
       //console.log('viewStateNodes', nodes);
       
       viewStateCtrl.updateView(viewState);            
    });
*/
/*            
    var promise = qtc.fetchData(bounds);
    promise.done(function(nodes) {
        $scope.map.widget.clearItems();
        console.log('nodes', nodes);

        _(nodes).each(function(node) {
            
            if(!node.isLoaded) {
                console.log('box: ' + node.getBounds());
                $scope.map.widget.addBox('' + node.getBounds(), node.getBounds());
            }
            
            var data = node.data || {};
            var docs = data.docs || [];

            _(docs).each(function(doc) {

                $scope.map.widget.addWkt(doc.id, doc.wkt);
                
                //var wktParser = new OpenLayers.Format.WKT();
                //var polygonFeature = wktParser.read(wkt);
                //console.log('wkt: ', polygonFeature);
                //polygonFeature.geometry.transform(map.displayProjection, map.getProjectionObject());         
            });                 
        });
        
//      vectors.addFeatures([polygonFeature]);
    });

};

$scope.$watch('map.center', function(center) {
    refresh();
});

$scope.$watch('map.zoom', function(zoom) {
    refresh();
});

$scope.$watch('ObjectUtils.hashCode(config)', function(newHashCode) {
    refresh();
});


refresh = function() {
    console.log('refereshing');
};


*/
