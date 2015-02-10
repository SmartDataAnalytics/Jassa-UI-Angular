angular.module(
    'jassa.demo',
    [
       'ui.router', 'ngSanitize', 'ui.bootstrap', 'ui.select', 'ui.jassa',
       'ui.jassa.openlayers', 'ui.jassa.edit', 'ui.codemirror', 'ngAnimate'
    ],
    [ '$rootScopeProvider', function($rootScopeProvider) {
       $rootScopeProvider.digestTtl(10);
    }]
)

.config([function() {
    // Setup drop down menu
    jQuery('.dropdown-toggle').dropdown();

    // Fix input element click problem
    jQuery('.dropdown input, .dropdown label').click(function(e) {
      e.stopPropagation();
    });
}])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    // Now set up the states
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'partials/home.html',
            //controller: 'SearcCtrl'
        })
        .state('sponate', {
            url: '/sponate',
            templateUrl: 'partials/sponate.html',
            controller: 'SponateCtrl'
        })
        .state('edit', {
            url: '/edit',
            templateUrl: 'partials/edit.html',
            controller: 'EditCtrl'
        })
        .state('geo', {
            url: '/geo',
            templateUrl: 'partials/geo.html',
            controller: 'GeoCtrl'
        })
        .state('facete', {
            url: '/facete',
            templateUrl: 'demos/facete/facete.html',
            //controller: 'Ctrl'
        })
        .state('widgets', {
            url: '/widgets',
            templateUrl: 'partials/widget-index.html',
            //controller: 'Ctrl'
        })
        ;

}])

.filter('objectToArray', function() {
    return function(input) {
        var r = _.values(input);
        return r;
    }
})

.controller('AppCtrl', ['$scope', '$q', '$templateCache', '$http', function($scope, $q, $templateCache, $http) {

    $scope.loadTemplate = function(path, scope, attr) {
        scope[attr] = '';
        $q.when($http.get(path)).then(function(response) {
            scope[attr] = response.data || '';

            //console.log('Data for [' + path + ']: ', scope[attr]);
        });

        return scope[attr];
    };


    $scope.syncTemplate = function(path, scope, attr, name) {
        $scope.loadTemplate(path, scope, attr);

        $scope.$watch(function() {
            return scope[attr];
        }, function(val) {
            $templateCache.put(name, val);
            console.log('set cache: ', name, val);
        }, true);
    };

    var doEvalCore = function(str, context) {
        var f = function(str) {
            console.log(str);
            str = 'try {' + str + ' } catch(e) { console.log(\'Inner\', e, e.stack); }';
            //var r = eval('console.log('test');');
            var r = eval(str);
            return r;
        };

        var result = f.call(context, str);
        return result;
    };

    $scope.doEval = function(str, context) {
        //try {
            doEvalCore(str, context);
        //} catch (e) {
            //console.log('Outer:', e);
            //alert(JSON.stringify(e));
            //console.log('Error', e,lineNumber, e, e.stack);
        //}
    };










    var createListService = function(sparqlService, langs) {

        /*
         * Set up the Sponate mapping for the data we are interested in
         */
        var store = new jassa.sponate.StoreFacade(sparqlService, {
            'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            'dbpedia-owl': 'http://dbpedia.org/ontology/',
            'foaf': 'http://xmlns.com/foaf/0.1/',
            'dcat': 'http://www.w3.org/ns/dcat#',
            'theme': 'http://example.org/resource/theme/',
            'o': 'http://example.org/ontology/'
        });

        var labelConfig = new jassa.sparql.BestLabelConfig(langs);
        var labelTemplateFn = function() { return jassa.sponate.MappedConceptUtils.createMappedConceptBestLabel(labelConfig); };
        var commentTemplateFn = function() { return jassa.sponate.MappedConceptUtils.createMappedConceptBestLabel(new jassa.sparql.BestLabelConfig(langs, [jassa.vocab.rdfs.comment])); };

        var template = [{
            id: '?s',
            label: { $ref: { target: labelTemplateFn, attr: 'displayLabel' }},
            comment: { $ref: { target: commentTemplateFn, attr: 'displayLabel' }},
            depiction: '?d',
            resources: [{
                label: 'Distributions',
                items: [{ $ref: { target: 'distributions', on: '?x'} }],
                template: 'template/dataset-browser/distribution-list.html'
            }, {
                label: 'Join Summaries',
                items: [[{ $ref: { target: 'datasets', on: '?j'} }], function(items) { // <- here be recursion
                    var r = _(items).chain().map(function(item) {
                                return item.resources[0].items;
                            }).flatten(true).value();
                    return r;
                }],
                template: 'template/dataset-browser/distribution-list.html'
            }]
        }];

        store.addMap({
            name: 'primaryDatasets',
            template: template,
            from: '?s a dcat:Dataset ; dcat:theme theme:primary . Optional { ?s foaf:depiction ?d } . Optional { ?x o:distributionOf ?s } Optional { ?j o:joinSummaryOf ?s }'
        });

        store.addMap({
            name: 'datasets',
            template: template,
            from: '?s a dcat:Dataset . Optional { ?s foaf:depiction ?d } . Optional { ?x o:distributionOf ?s } Optional { ?j o:joinSummaryOf ?s }'
        });

        store.addMap({
            name: 'distributions',
            template: [{
                id: '?s',
                accessUrl: '?a',
                graphs: ['?g']
            }],
            from: '?s a dcat:Distribution ; dcat:accessURL ?a . Optional { ?s o:graph ?g } '
        });


        var result = store.primaryDatasets.getListService();

        result = new jassa.service.ListServiceTransformConceptMode(result, function() {
            var searchConfig = new jassa.sparql.BestLabelConfig(langs, [jassa.vocab.rdfs.comment, jassa.vocab.rdfs.label]);
            var labelRelation = jassa.sparql.LabelUtils.createRelationPrefLabels(searchConfig);
            return labelRelation;
        });

        result.fetchItems().then(function(entries) {
            console.log('Got: ', entries);
        });

        return result;
    };

    var testSparqlService =
        jassa.service.SparqlServiceBuilder
            .http('http://cstadler.aksw.org/data/misc/sparql', ['http://datacat.aksw.org/'])
            .cache()
            .virtFix()
            .paginate(1000)
            .pageExpand(100)
            .create();


    $scope.testListService = createListService(testSparqlService, ['de', 'en', '']);
    $scope.listServiceWatcher = new ListServiceWatcher($scope, $q);

    console.log('utils: ', $scope.ListServiceUtils);

}])

;
