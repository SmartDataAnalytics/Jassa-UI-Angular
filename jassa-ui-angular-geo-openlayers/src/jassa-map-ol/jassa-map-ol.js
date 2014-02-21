angular.module('ui.jassa.jassa-map-ol', [])

.controller('JassaMapOlCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
        
        var refresh;

        var defaultViewStateFetcher = new Jassa.geo.ViewStateFetcher();

        console.log('scope', $scope);
        console.log('config: ' + Jassa.util.ObjectUtils.hashCode($scope.config), $scope.config);

        // Make Jassa's ObjectUtils known to the scope - features the hashCode utility function
        $scope.ObjectUtils = Jassa.util.ObjectUtils;
        
        var watchList = '[map.center, map.zoom, ObjectUtils.hashCode(config), viewStateFetcher]';
        $scope.$watch(watchList, function() {
            refresh();
        }, true);
        
        
        refresh = function() {
             
            var mapWrapper = $scope.map.widget;
 
            mapWrapper.clearItems();

            var configs = $scope.config;
            
            
            var bounds = mapWrapper.getExtent();//            var bounds = ns.MapUtils.getExtent($scope.map)
            
            _(configs).each(function(config) {

                var viewStateFetcher = config.viewStateFetcher || defaultViewStateFetcher;
                
                var sparqlService = config.sparqlService;
                var mapLinkFactory = config.mapLinkFactory;
                //var conceptFactory = config.conceptFactory
                var concept = config.concept;
                
                var promise = viewStateFetcher.fetchViewState(sparqlService, mapLinkFactory, concept, bounds);
                
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
     
                            mapWrapper.addWkt(doc.id, doc.wkt);// {fillColor: markerFillColor, strokeColor: markerStrokeColor});
                        });
                    });
                });
                
                
            });
        };
        
}])


.directive('jassaMapOl', function($parse) {
    return {
        restrict: 'EA', // says that this directive is only for html elements
        replace: true,
        template: '<div></div>',
        priority: -10,
        controller: 'JassaMapOlCtrl',
        scope: {
//            center: '=',
//            zoom: '=',
            config: '='
        },
        link: function (scope, element, attrs) {
            
            var $el = jQuery(element).ssbMap();
            var widget = $el.data('custom-ssbMap');

            var map = widget.map;
            map.widget = widget;
            var model = $parse(attrs.jassaMapOl);

            if(model) {
                model.assign(scope, map);
            }

            //console.log('Dir dataSources', attrs, scope);


            var syncModel = function(event) {
                //console.log('map event');
//                if(!scope.$$phase) {
//                    scope.$apply();
//                }
            };
            
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
                
                
                var mapLinkFactory = mapLinkFactories[0];
                var promise = viewStateFetcher.fetchViewState(sparqlService, mapLinkFactory, concept, bounds);
                
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
