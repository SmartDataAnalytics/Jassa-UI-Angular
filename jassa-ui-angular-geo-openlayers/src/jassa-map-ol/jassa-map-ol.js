angular.module('ui.jassa.jassa-map-ol', [])

.controller('JassaMapOlCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
        
        var refresh;
        
        $scope.$watch('map.center', function(center) {
            refresh();
        });
        
        /*
        $scope.$on('facete:refresh', function() {
            refresh();
        });

        $scope.$on('facete:constraintsChanged', function() {
            refresh();
        });
        */

        
        refresh = function() {
        };

        /*
            var bounds = ns.MapUtils.getExtent($scope.map)
            //console.log('extent', bounds);
            
//             if(viewStateCtrl == null) {
//                 viewStateCtrl = new ns.ViewStateCtrlOpenLayers($scope.map.widget);
//             }


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
                
//              vectors.addFeatures([polygonFeature]);
            });
        };
*/
}])


.directive('jassaMapOl', function($parse) {
    return {
        restrict: 'EA', // says that this directive is only for html elements
        replace: true,
        template: '<div></div>',
        priority: -10,
        scope: {
            center: '=',
            zoom: '='
        },
        link: function (scope, element, attrs) {
            var $el = jQuery(element).ssbMap();
            var widget = $el.data('custom-ssbMap');

            var map = widget.map;
            map.widget = widget;
            var model = $parse(attrs.ssbMap);

            if(model) {
                //model.assign(scope, map);
            }
            
            map.events.register('moveend', this, function(event) {
                if(!scope.$$phase) {
                    scope.$apply();
                }
            });
            
            map.events.register('zoomend', this, function(event) {
                if(!scope.$$phase) {
                    scope.$apply();
                }
            });
        }
            
    };
})

;

