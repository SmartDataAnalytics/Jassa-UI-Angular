//angular.module('DatasetBrowser', ['ui.jassa', 'ui.bootstrap', 'ui.sortable', 'ui.keypress', 'ngSanitize'])
angular.module('ui.jassa.dataset-browser', [])

.controller('DatasetBrowserCtrl', ['$scope', '$q', function($scope, $q) {

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


    $scope.$watch(function() {
        return $scope.sparqlService;
    }, function(sparqlService) {
        $scope.listService = createListService(sparqlService, $scope.langs);
    });


    $scope.langs = ['de', 'en', ''];

    /*
     * Create a list service for our mapping and decorate it with
     * keyword search support
     */
    $scope.searchModes = [{
        label: 'regex',
        mode: 'regex'
    }, {
        label: 'fulltext',
        mode: 'fulltext'
    }];

    $scope.activeSearchMode = $scope.searchModes[0];

    /*
     * Angular setup
     */
    $scope.availableLangs = ['de', 'en', 'jp', 'ko'];


    $scope.offset = 0;
    $scope.limit = 10;
    $scope.totalItems = 0;
    $scope.items = [];
    $scope.maxSize = 7;

    $scope.doFilter = function(searchString) {
        $scope.filter = {
            searchString: searchString,
            mode: $scope.activeSearchMode.mode
        };
        $scope.offset = 0;
    };

    /*
    var buildAccessUrl = function(accessUrl, graphUrls) {
        var defaultQuery = 'Select * { ?s ?p ?o } Limit 10'
        return accessUrl + '?qtxt=' + encodeURIComponent(defaultQuery) + (
            graphUrls && graphUrls.length > 0
                ? '&' + graphUrls.map(function(item) { return 'default-graph-uri=' + encodeURIComponent(item); }).join('&')
                : ''
        );
    }
    */


    $scope.context = {
        // TODO Get rid of the limitation of having to pass in the itemTemplate via a 'context' object
        itemTemplate: 'template/dataset-browser/dataset-item.html'
    };

    //$scope.itemTemplate = 'dataset-item.html';
    $scope.itemTemplate = 'template/dataset-browser/dataset-item.html';
}])

.directive('datasetBrowser', function() {
    return {
        restrict: 'EA',
        replace: true,
        //templateUrl: 'template/dataset-browser/dataset-list.html',
        templateUrl: 'template/dataset-browser/dataset-browser.html',
        scope: {
            sparqlService: '=',
            //model: '=ngModel',
            maxSize: '=?',
            onSelect: '&select'
        },
        controller: 'DatasetBrowserCtrl',
        compile: function(elm, attrs) {
            return {
                pre: function(scope, elm, attrs, controller) {
                }
            };
//            return function link(scope, elm, attrs, controller) {
//            };
        }
    };
})



;
