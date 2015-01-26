angular.module('jassa.demo')

.controller('LinkingDemoCtrl', ['$scope', '$q', function($scope, $q) {

    //var linkSparqlService = new service.SparqlServiceHttp('http://lod.openlinksw.com/sparql', ['http://dbpedia.org']);
    var linkSparqlService = new jassa.service.SparqlServiceHttp('http://localhost/data/geolink/sparql', ['http://geolink.aksw.org/'], {type: 'POST'});
    //var dbpediaSparqlService = new jassa.service.SparqlServiceHttp('http://lod.openlinksw.com/sparql', ['http://dbpedia.org'], {type: 'POST'});
    //var dbpediaSparqlService = new jassa.service.SparqlServiceHttp('http://localhost/data/dbpedia/sparql', ['http://dbpedia.org'], {type: 'POST'});
    var dbpediaSparqlService = new jassa.service.SparqlServiceHttp('http://dbpedia.org/sparql', ['http://dbpedia.org'], {type: 'POST'});
    var lgdSparqlService = new jassa.service.SparqlServiceHttp('http://linkedgeodata.org/sparql', ['http://linkedgeodata.org'], {type: 'POST'});

    linkStore = new jassa.sponate.StoreFacade(linkSparqlService, {
        'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        'llo': 'http://www.linklion.org/ontology#'
    });

    linkStore.addMap({
        name: 'links',
        template: [{
            id: '?l',
            source: { $ref: { target: 'dbpedia-data', on: '?s' } },
            target: { $ref: { target: 'lgd-data', on: '?t' } }
        }],
        from: '?l a llo:Link; rdf:subject ?s; rdf:object ?t'
    });

    var bestLiteralConfig = new jassa.sparql.BestLabelConfig(); //['ja', 'ko', 'en', '']);
    var mappedConcept = jassa.sponate.MappedConceptUtils.createMappedConceptBestLabel(bestLiteralConfig);

    linkStore.addTemplate({
        name: 'spo',
        template: [{
            id: '?s',
            displayLabel: { $ref: { target: mappedConcept, attr: 'displayLabel' }},
            predicates: [{
                id: '?p',
                displayLabel: { $ref: { target: mappedConcept, attr: 'displayLabel', on: '?p' }},
                values: [{
                    id: '?o',
                    displayLabel: { $ref: { target: mappedConcept, attr: 'displayLabel', on: '?o' }},
                }]
            }]
        }],
        from: '?s ?p ?o',
    });

    linkStore.addMap({
        name: 'dbpedia-data',
        template: 'spo',
        service: dbpediaSparqlService
    });

    linkStore.addMap({
        name: 'lgd-data',
        template: 'spo',
        service: lgdSparqlService
    });

    $scope.offset = 0;
    $scope.numItems = 10;

    var orderBySource = function(map) {
        var result = Object.keys(map);

        _(result).orderBy(function(item) {
            var s = item.sources;
            var r = s.length + '-' + s.join('-');
            return r;
        });

        return result;
    };

    $scope.sourceOrderFn = function(item) {
        var s = item.sources;
        var r = s.length + '-' + s.join('-');
        //console.log('Item: ', item, r);
        return r;
    };


    var listService = linkStore.links.getListService();

    var fnTransformSearch = function(searchString) {
        var r;
        if(searchString) {

            var bestLiteralConfig = new jassa.sparql.BestLabelConfig();
            var relation = jassa.sparql.LabelUtils.createRelationPrefLabels(bestLiteralConfig);
            // TODO Make it configurable to whether scan URIs too (the true argument)
            r = jassa.sparql.KeywordSearchUtils.createConceptRegex(relation, searchString, true);
            //var result = sparql.KeywordSearchUtils.createConceptBifContains(relation, searchString);
        } else {
            r = null;
        }

        return r;
    };

    listService = new jassa.service.ListServiceTransformConcept(listService, fnTransformSearch);

    listService = new jassa.service.ListServiceTransformItems(listService, function(entries) {
        var r = entries.map(function(entry) {
            // TODO Do not modify original object as it may break cache
            var link = entry.val || {};
            var cluster = jassa.util.ClusterUtils.clusterLink(link);

            // TODO Add the property display labels
//                 _(cluster).forEach(function(cluster) {

//                 })

            link.cluster = cluster;
            return entry;
        });

        return r;
    });



    $scope.linkListService = listService;
    $scope.listServiceWatcher = new ListServiceWatcher($scope, $q);

    /*
    $scope.listServiceLinks = listService;

    $scope.$watchCollection('[offset, numItems]', function() {
        $q.when(linkStore.links.find().limit($scope.numItems).skip($scope.offset).list().then(function(items) {
            return items.map(function(item) {
                return item.val;
            });
        })).then(function(links) {

            // Enrich links with a cluster for the predicates


            //console.log('Links: ', links);

            $scope.links = links;
        })

    });
*/

}]);
