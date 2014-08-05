Initial readme


* Synchronization via a config object
* Vocabulary abstraction: e.g. map widget can deal with vocabs such as GeoSPARQL, WGS84, GeoRSS ,...
* Support for references to both existing and non-existing values
* Diff + Send Sparql Update to server

* Use case: Support birthdate as gYear, gDate and gDateTime:
  - If there were two input fields for dateTime (i.e. a date and a time picker), then we would have to create a single RDF literal from a set of form values



* Issue: What kind of data should the map widget return?
  * Probably a WKT string, e.g. "POINT(10 20)" - this is a generic representation for geometric information, and e.g. lat/long can be derived from this
  

The map must read the data from some source, and write the data to some sink.



```js

$scope.foo = 1;
$scope.bar = 2;

$scope.$watch('foo + bar', function() { ... } );
$scope.$watch(function() { return 1 + foo; }, function(n, o) { ... });

<jassa-edit-map
  map-config="{center: , zoom: }"
  edit-handler="someEditHandler"
>
</jassa-edit-map>


angular.directive('jassaEditMap', ['$scope', function(scope) {
  return {
    scope: {
      data: '='
    },
    compile: function() {
      $scope.$watch('data.getData()', function() {
        ...
      });
    }
  };
}]);




interface EditHandler {
  /**
   * Retrieve the data which the widget should visualize
   */
  getData();

  setData(obj);
}


class EditHandlerTypeYear {
  initialize: function(graph, ref) {
  },

  getData() {
    return graph.get(ref).getValue() // Expects either null or a javascript Data object;
  },

  setData(data, dataType) {
    var oldValue = graph.get(ref).getValue();
    
    if(oldValue == null) {
      // What datatype should we create now??? gYear, gDate, gDateTime, ... The handler needs to know this 
    }
  }
}

class EditHandlerInitValue {
  initialize: function(delegate, someConfig) {
  },
  getData() { return this.delegate.getData(); },
  setData(data) {
    var oldValue = graph.get(ref).getValue();
    
    if(oldValue == null) {
      // Init the value according to whatever logic
    }

    this.delegate.setData(data);
  }


}


interface ObjectRef {
   Node subject;
   Node predicate;
   int objectIndex;
}

var str = fnLang(graph.getValue(objectRef)); // fnLang is a function that extracts the language tag from the referenced value



class ReadWriteWktFrom2Properties {
  initialize: function(latRef, longRef) {
  }
}


class ReadWriteWktFrom1Property {
  initialize: function(wktStrRef) {
  }
}

class ReadWriteDefaultImpl {
   
}








-----
class ReadWriteMyOwnImpl {
   initialize: function(graph) {
      this.graph = graph;
   },
   source: function() {
      return myGraph.getObjects('http://subject', 'http://predicate')[0].getLiteralLexicalValue();
    }
   sink: function(wktStr) {
    /* Check if the triples already exist or if the have to be created */

    return [new rdf.Triple( rdf.NodeFactory.createLiteral(wktStr, 'someDatatype'), ...) ... ]
   }
}

   //config="config"
   //ref=""   /
   //tripleReadWriter=""
   //config="new WKTReadWriter()"
   shapeRestrictions='point' // Restrict user input to the specified geometry types, Rationale: Prevent users from specifying polygons if e.g. the sink only supports points (wgs84)
   source="function() { return myGraph.getObjects('http://subject', 'http://predicate')[0].getLiteralLexicalValue(); }"
   sink="function(wktStr) { /* Check if the triples */ return [new rdf.Triple( rdf.NodeFactory.createLiteral(wktStr, 'someDatatype'), ...) ... ] }"



```


