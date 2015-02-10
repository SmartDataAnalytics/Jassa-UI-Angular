context.sparqlService =
    jassa.service.SparqlServiceBuilder
        .http('http://cstadler.aksw.org/data/misc/sparql', ['http://datacat.aksw.org/'])
        .cache()
        .virtFix()
        .paginate(1000)
        .pageExpand(100)
        .create();

context.onSelect = function(data) {
    alert(JSON.stringify(data));
};

