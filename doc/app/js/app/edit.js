angular.module('jassa.demo')

.controller('EditCtrl', ['$scope', function($scope) {

    // Begin of REX Setup

    $scope.defaultNgModelOptions = {
        //updateOn: 'default blur',
        debounce: {
            'default': 300,
            'blur': 0
        }
    };


    var sparqlService = jassa.service.SparqlServiceBuilder
        //.http('http://dbpedia.org/sparql', ['http://dbpedia.org'], {type: 'POST'})
        .http('http://akswnc3.informatik.uni-leipzig.de/data/jassa/sparql', ['http://dbpedia.org'], {type: 'POST'})
        //.http('http://localhost/data/pokedex/sparql', ['http://pokedex.org/'], {type: 'POST'})
        .virtFix().paginate(50000).pageExpand(100).create();

    // TODO Somehow update .cache() on update

    var updateService = new jassa.service.SparqlUpdateHttp('http://akswnc3.informatik.uni-leipzig.de/data/jassa/sparql', ['http://dbpedia.org']);

    $scope.performUpdate = function(diff, prefixMapping) {
        var str;
        str = $scope.createDeleteRequest(diff.removed, prefixMapping);
        var p1 = updateService.createUpdateExecution(str).execUpdate();

        str = $scope.createInsertRequest(diff.added, prefixMapping);
        var p2 = updateService.createUpdateExecution(str).execUpdate();

        Promise.all([p1, p2]).then(function() {
            alert('Success - I will now refresh - ya, will make that nicer soon');
            location.reload();
        }, function() {
            alert('Failed');
        });

        /*
        var request = $http({
            method: 'post',
            url: "api/index.cfm",
            params: {
            action: "get"
            }
        });*/

        //$http

    };

    $scope.createInsertRequest = function(graph, prefixMapping) {
        var result;
        if(graph) {
            var quads = jassa.sparql.QuadUtils.triplesToQuads(graph);
            result = '' + new jassa.sparql.UpdateDataInsert(quads);
        } else {
            result = '';
        }
        return result;
    };

    $scope.createDeleteRequest = function(graph, prefixMapping) {
        var result;
        if(graph) {
            var quads = jassa.sparql.QuadUtils.triplesToQuads(graph);
            result = '' + new jassa.sparql.UpdateDataDelete(quads);
        } else {
            result = '';
        }
        return result;
    };


    $scope.lookupFn = function(node) {
        var result = jassa.service.ServiceUtils.execDescribeViaSelect(sparqlService, [node]);
        return result;
    };

    $scope.newGraph = function() {
        return new jassa.rdf.GraphImpl();
    };


    $scope.graphToTurtle = function(graph, prefixMapping) {
        var talis = graph ? jassa.io.TalisRdfJsonUtils.triplesToTalisRdfJson(graph) : null;
        var r = talis ? jassa.io.TalisRdfJsonUtils.talisRdfJsonToTurtle(talis, prefixMapping) : '';
        return r;
    }
    // End of REX Setup

    // Some Utils for geo stuff
    $scope.PointUtils = jassa.geo.PointUtils;


    // Helper for date parsing / serialization
    // !!! Does not actually produce date strings as demanded by xsd date(Time) !!!
    // !!! Its just a proof of concept !!!
    // TODO integrate moment.js
    // Native Javascript Date features seem to be insanely useless when it comes to RDF :/
    $scope.dateToString = function(x) {
        var r = !x ? null : moment(x).toISOString();
        //var r = !x ? null : x.toUTCString();
        return r;
    };

    $scope.parseDate = function(x) {
        var r = !x ? null : moment(x).toDate();
        //var r = !x ? null : new Date(x);
        return r;
    };


    // Helper to keep an input field at the top of the page
    $scope.scrollTo = function(target) {
        $timeout(function() {
            $location.hash(target);
            $anchorScroll();
        }, 50);
    };

    // Code mirror setup
    $scope.editorOptions = {
        ttl: {
            lineWrapping : true,
            lineNumbers: true,
            tabMode: 'indent',
            matchBrackets: true,
            mode: 'text/turtle',
            readOnly: true
        }
    };

    // Angular UI date picker set up
    $scope.dp = {};

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.dp.opened = false;
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.dp.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1
    };

}]);

;

