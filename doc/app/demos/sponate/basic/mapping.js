// Create a simple HTTP SPARQL service
var sparqlService = jassa.service.SparqlServiceBuilder
    .http('http://dbpedia.org/sparql', ['http://dbpedia.org'], {type: 'POST'})
    .create();

// Set up a sponate store (a collection for mappings), and configure it with
// the SPARQL service and some default prefixes
var store = new jassa.sponate.StoreFacade(sparqlService, _({
    dbo: 'http://dbpedia.org/ontology/',
    cat: 'http://dbpedia.org/resource/Category:',
    }).defaults(jassa.vocab.InitialContext));

// Create a map for US presidents
store.addMap({
    name: 'presidents',
    template: [{
        id: '?s',
        label: '?l',
        description: '?a',
        depiction: '?d',
        birthDate: '?bd'
    }],
    from: '?s dcterms:subject cat:Presidents_of_the_United_States ;' +
          '  rdfs:label ?l; dbo:abstract ?a ; foaf:depiction ?d ; dbo:birthDate ?bd .' +
          '  Filter(langMatches(lang(?l), "en") && langMatches(lang(?a), "en"))'
});

// Fetch 10 items from the list and assign it to context.items which is referenced by the HTML template
// Note: the wrapping with $q.when() makes angular aware of having to refresh the view once the items are fetched
$q.when(store.presidents.getListService().fetchItems(null, 10)).then(function(entries) {
    context.items = _(entries).pluck('val');
});
