var sparqlService = jassa.service.SparqlServiceBuilder
    .http('http://dbpedia.org/sparql', ['http://dbpedia.org'], {type: 'POST'})
    .create();


var store = new jassa.sponate.StoreFacade(sparqlService, _({
    dbo: 'http://dbpedia.org/ontology/',
    cat: 'http://dbpedia.org/resource/Category:',
    }).defaults(jassa.vocab.InitialContext));


store.addMap({
    name: 'presidents',
    template: [{
        id: '?s',
        name: '?l',
        depiction: '?d',
        birthDate: '?bd'
    }],
    from: '?s dcterms:subject cat:Presidents_of_the_United_States ; rdfs:label ?l; foaf:depiction ?d ; dbo:birthDate ?bd . Filter(langMatches(lang(?l), "en"))'
});

// Note: the wrapping with $q.when() makes angular aware of having to refresh the view once the items are fetched
$q.when(store.presidents.getListService().fetchItems(null, 10)).then(function(entries) {
    $scope.items = _(entries).pluck('val');
});
