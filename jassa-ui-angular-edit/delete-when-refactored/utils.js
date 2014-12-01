var createRexLookupService = function(sparqlService) {

    var store = new jassa.sponate.StoreFacade(sparqlService, {
//        'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
//        'llo': 'http://www.linklion.org/ontology#'
    });

    var bestLiteralConfig = new jassa.sparql.BestLabelConfig(); //['ja', 'ko', 'en', '']);
    var mappedConcept = jassa.sponate.MappedConceptUtils.createMappedConceptBestLabel(bestLiteralConfig);


    var indexResource = function(map) {
        var result = {};

        var subjects = map.entries();
        subjects.forEach(function(entry) {
            var subjectIri = entry.key;
            var predicates = entry.val.predicates.entries();

            var s = result[subjectIri] = {};


            predicates.forEach(function(entry) {
                var predicateIri = entry.key;

                var p = s[predicateIri] = {};

                var objects = entry.val.values.entries();
                objects.forEach(function(entry) {
                    var node = entry.val.id;
                    var json = jassa.rdf.NodeUtils.toTalisJsonRdf(node);
                    p.push(json);
                });
            });
        });
    }

    var toMap = function(arr) {
        //console.log('ARGH', arr);
        var result = new util.HashMap();
        arr.forEach(function(item) {
            result.put(item.id, item);
        });
        return result;
    };

    var toTalisJsonRdf = function(items) {
        var result = items.map(function(item) {
            var r = jassa.rdf.NodeUtils.toTalisJsonRdf(item.id);
            return r;
        });
        return result;
    };


    /*
    store.addMap({
        name: 'spo',
        template: [{
            id: '?s',
            displayLabel: { $ref: { target: mappedConcept, attr: 'displayLabel' }},
            predicates: [[{
                id: '?p',
                displayLabel: { $ref: { target: mappedConcept, attr: 'displayLabel', on: '?p' }},
                values: [[{
                    id: '?o | node',
                    displayLabel: { $ref: { target: mappedConcept, attr: 'displayLabel', on: '?o' }}
                }], toTalisJsonRdf],
            }], toMap],
        }],
        from: '?s ?p ?o',
    });
    */



    var changeIndex = function(triples) {
        var spToCount = {};

        var result = new jassa.util.HashMap();
        //var result = {};


        triples.forEach(function(triple) {
            var sp = triple.s + ' ' + triple.p;
            var i = spToCount[sp] = (spToCount[sp] || 0);
            ++spToCount[sp];

            var json = jassa.rdf.NodeUtils.toTalisJsonRdf(triple.o);

            var attrs = Object.keys(json);
            attrs.forEach(function(attr) {
                var key = {
                    s: triple.s,
                    p: triple.p,
                    i: i,
                    c: attr,
                };

                var val = json[attr];

                result.put(key, val);
            });
        })

//         var assembled = assembleTalisJsonRdf(result);
//         console.log('Assembled: ', assembled);

        return result;
    };


    store.addMap({
        name: 'spo',
        template: [{
            id: '?s',
            data: [[{
                id: '?rowId',
                s: '?s',
                p: '?p',
                o: '?o | node'
            }], changeIndex]
        }],
        from: '?s ?p ?o',
    });

    var ls = store.spo.getListService();

    var lookupService = new jassa.service.LookupServiceListServiceSparql(ls);

    return lookupService;
};

/* Part of jassa.geo now */
var PointUtils = {
    lonlatToWkt: function(lonlat) {
        var result = this.pointToWkt(lonlat.lon, lonlat.lat);
        return result;
    },

    xyToWkt: function(xy) {
        var result = this.pointToWkt(xy.x, xy.y);
        return result;
    },

    pointToWkt: function(x, y) {
        var result = 'POINT (' + x + ' ' + y + ')';
        return result;
    },

    wktPointRegex: /^\s*POINT\s*\(\s*([^\s]+)\s+([^)]+)\)\s*$/i,

    isWktPoint: function(wktStr) {
        var match = this.wktPointRegex.exec(wktStr);
        var result = !!match;
        return result;
    },

    wktToXy: function(wktStr) {
        var match = this.wktPointRegex.exec(wktStr);
        if(!match) {
            return null;
        }

        var xStr = match[1];
        var yStr = match[2];

        var result = {
            x: parseFloat(xStr),
            y: parseFloat(yStr)
        };

        return result;
    }
};


