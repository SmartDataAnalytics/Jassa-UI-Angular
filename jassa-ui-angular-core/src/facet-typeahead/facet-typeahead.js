angular.module('ui.jassa.facet-typeahead', [])

.directive('facetTypeahead', ['$compile', '$q', '$parse', function($compile, $q, $parse) {

    var FacetTypeAheadServiceAngular = Class.create({
        initialize: function($scope, $q, configExpr, id) {
            this.$scope = $scope;
            this.$q = $q;

            this.configExpr = configExpr;
            this.id = id;
        },
        
        getSuggestions: function(filterString) {
            var config = this.configExpr(this.$scope);

            var sparqlService = config.sparqlService;
            var fct = config.facetTreeConfig;

            // Get the attributes from the config
            var idToModelPathMapping = config.idToModelPathMapping;
            
            var modelPathMapping = idToModelPathMapping[this.id];

            if(!modelPathMapping) {
                console.log('Cannot retrieve model-path mapping for facet-typeahead directive with id ' + id);
                throw 'Bailing out';
            }
            
            var limit = modelPathMapping.limit || config.defaultLimit || 10;
            var offset = modelPathMapping.offset || config.defaultOffset || 0;


            var pathSpec = modelPathMapping.pathExpr(this.scope);
            var path = FacetTypeAheadUtils.parsePathSpec(pathSpec);
            
            // Hack - the facetService should only depend on FacetConfig
            var tmp = fct.getFacetConfig();
            
            var cm = tmp.getConstraintManager();
            var cmClone = cm.shallowClone();
            
            var facetConfig = new Jassa.facete.FacetConfig();
            facetConfig.setConstraintManager(cmClone);
            facetConfig.setBaseConcept(tmp.getBaseConcept());
            facetConfig.setRootFacetNode(tmp.getRootFacetNode());
            facetConfig.setLabelMap(tmp.getLabelMap());
            
            var facetTreeConfig = new Jassa.facete.FacetTreeConfig();
            //facetTreeConfig.setFacetConfig(facetConfig);
            // TODO HACK Use a setter instead
            facetTreeConfig.facetConfig = facetConfig;

            
            // Compile constraints
            var self = this;
            
            var constraintSpecs = _(idToModelPathMapping).map(function(item) {
                var valStr = item.modelExpr(self.$scope);
                if(!valStr || valStr.trim() === '') {
                    return null;
                }

                var val = rdf.NodeFactory.createPlainLiteral(valStr);
                var pathSpec = item.pathExpr(self.$scope);
                var path = FacetTypeAheadUtils.parsePathSpec(pathSpec);


                var r = new Jassa.facete.ConstraintSpecPathValue('regex', path, val);
                return r;
            });
            
            constraintSpecs = _(constraintSpecs).compact();
            
            _(constraintSpecs).each(function(constraint) {
                cmClone.addConstraint(constraint);
            });

            
            var facetValueService = new Jassa.facete.FacetValueService(sparqlService, facetTreeConfig);
            var fetcher = facetValueService.createFacetValueFetcher(path, filterString);
            
            var p1 = fetcher.fetchData(offset, limit); //offset);
            var p2 = fetcher.fetchCount();
            
            var p3 = jQuery.when.apply(null, [p1, p2]).pipe(function(data, count) {
                var r = {
                    offset: this.offset,
                    count: count,
                    data: data
                };
                
                return r;
            });
            
            
            var p4 = p3.pipe(function(data) {
                var r = _(data.data).map(function(item) {
                   return item.displayLabel;
                });
                
                return r;
            });

            var result = Jassa.sponate.angular.bridgePromise(p4, this.$q.defer(), this.$scope.$root);
            return result;
        }
    });



    return {
        restrict: 'A',
        scope: true,
        //require: ['ngModel', 'facetTypeaheadPath'], // TODO I want to require attributes on elem - not directives - seems require is only for the latter?
        /*
        scope: {
            'facetTypeahead': '=',
            ''
        },
        */

        // We need to run this directive before the the ui-bootstrap's type-ahead directive!
        priority: 1001,
        
        // Prevent angular calling other directives - we do it manually
        terminal: true,
        
        compile: function(elem, attrs) {
            
            if(!this.instanceId) {
                this.instanceId = 0;
            }
            
            var instanceId = 'facetTypeAhead-' + (this.instanceId++);
            //console.log('INSTANCEID', instanceId);                
            
            var modelExprStr = attrs['ngModel'];
            var configExprStr = attrs['facetTypeahead'];
            var pathExprStr = attrs['facetTypeaheadPath'];
            
            // Remove the attribute to prevent endless loop in compilation
            elem.removeAttr('facet-typeahead');
            elem.removeAttr('facet-typeahead-path');

            var newAttrVal = 'item for item in facetTypeAheadService.getSuggestions($viewValue)';
            //var newAttrVal = 'item for item in getSuggestions($viewValue);'
            //newAttrVal = $sanitize(newAttrVal);
            elem.attr('typeahead', newAttrVal);


            return {
                pre: function(scope, elem, attrs) {
//                         var requiredAttrNames = ['ng-model', 'facet-typeahead', 'facet-typeahead-path']
                    
//                         var attrExprs = {};
//                         _(requiredAttrNames).each(function(attrName) {
//                             var exprStr = elem.attr(attrName);

//                             attrExprs[attrName] = $parse(exprStr);
//                         });

                    // TODO Check if any of the required attributes were left undefined

                                     
//                     },
                
//                     post: function(scope, elem, attrs) {

                    /*
                    var modelExprStr = this.modelExprStr;
                    var configExprStr = this.configExprStr;
                    var pathExprStr = this.pathExprStr;
                    */
                    

                    var modelExpr = $parse(modelExprStr);
                    var pathExpr = $parse(pathExprStr);
                    var configExpr = $parse(configExprStr);
                    
                    // Note: We do not need to watch the config, because we retrieve the most
                    // recent values when the suggestions are requested                        
                    // However, we need to register/unregister the directive from the config object when this changes

                    
                    scope.$watch(configExprStr, function(newConfig, oldConfig) {
                        
                        if(!newConfig) {
                            return;
                        }
                        
                        if(!newConfig.idToModelPathMapping) {
                            newConfig.idToModelPathMapping = {};
                        }
                        
                        
                        newConfig.idToModelPathMapping[instanceId] = {
                            modelExpr: modelExpr,
                            modelExprStr: modelExprStr,
                            pathExprStr: pathExprStr,
                            pathExpr: pathExpr
                        };
                        
                        // TODO Unregister from old config
                        if(oldConfig && oldConfig != newConfig && oldConfig.modelToPathMapping) {
                            delete oldConfig.idToModelPathMapping[instanceId];
                        }
                    });


                    scope.facetTypeAheadService = new FacetTypeAheadServiceAngular(scope, $q, configExpr, instanceId);
                },
                
                post: function(scope, elem, attr) {
                    // Continue processing any further directives
                    $compile(elem)(scope);
                }
            };
        }
    };
}])

;


