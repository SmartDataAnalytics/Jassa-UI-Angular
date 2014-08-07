# Jassa-Angular-UI Map Documentation

The purpose of this document is to first explain how jassa's map component works
and then to itemize open issues.

## Jassa Structure
Including the Jassa library into a JavaScript project will make the `jassa`
object available, which contains Jassa's modules. These are: `rdf`, `sparql`,
`service`, `sponate`, and `facete`.

For example, accessing Jassa's factory object for RDF terms (called nodes), is achieved using:
```
var s = jassa.rdf.NodeFactory.createUri('http://example.org');
```


## The Map Widget
[Source Code for the JQuery Map Plugin](https://github.com/GeoKnow/Jassa-UI-Angular/blob/master/jassa-ui-angular-openlayers/src/jassa-map-ol/jquery.ssb.map.js)
[Source Code for the AngularJS wrapper](https://github.com/GeoKnow/Jassa-UI-Angular/blob/master/jassa-ui-angular-openlayers/src/jassa-map-ol/jassa-map-ol.js)

The map directive draws data from an array of data source objects.

```javascript

angular.module('jassa.demo.map.ol.basic', ['ui.bootstrap', 'ui.jassa.openlayers'])

.controller('AppCtrl', ['$scope', function($scope) {

   $scope.dataSources = [
        createMapDataSource(sparqlServiceA, geoMapFactoryVirt, conceptA, '#CC0020'),
        createMapDataSource(sparqlServiceB, geoMapFactoryWgs, conceptB, '#2000CC')
        //createMapDataSource(sparqlServiceC, geoMapFactoryAsWktVirt, conceptC, '#663300'),
    ];
        
    $scope.selectGeom = function(data) {
        alert(JSON.stringify(data));
    };
        
    $scope.mapConfig = {
        center: { lon: 8, lat: 50 },
        zoom: 8
    };

```

```html
<div 
    jassa-map-ol="map"
    style="position: absolute; left: 0px; top: 0px; width: 100%; height: 100%;"
    config="mapConfig"
    data-sources="dataSources"
    select="selectGeom(data)">
</div>
```


## Data Access Abstraction
Jassa's service module comes with APIs for the following common data access patterns:

### Lookup Services
[Source file](https://github.com/GeoKnow/Jassa/blob/master/jassa-js/src/main/webapp/resources/js/service/lookup-services.js)

The LookupService interface is intended for asynchronous lookup of items based
on arrays of keys.

```java
package jassa.service;

interface LookupService<K, V> {
    /**
     * This method must convert keys to unique strings
     * A default implementation should use the key.toString().
     */
    String getKeyStr(K key); // TODO Currently this method is called getIdStr

    Promise<jassa.util.Map<K, V>> lookup(Array<K> keys);
}

/**
 * Adds caching of the key's corresponding values.
 *
 */
class LookupServiceCache<K, V>
    extends LookupServiceDelegateBase<K, V>
{
	LookupServiceCache(LookupService<K, V> delegate, RequestCache requestCache = null);
}


/**
 * TODO Currently called LookupServiceChunker
 *
 * Partitions the set of provided keys, and performs a lookup for each partition.
 *
 */
class LookupServicePartition<K, V>
    extends LookupServiceDelegateBase<K, V>
{
    LookupServicePartition(LookupService<K, V> delegate, maxPartitionSize);
}

/**
 * Multiple requests via .lookup(keys) within the time window specified by delayInMs will be grouped
 * into a single request to the delegate.
 */
class LookupServiceTimeout<K, V>
    extends LookupServiceDelegateBase<K, V>
{
	LookupServiceTimeout(LookupService<K, V> delegate, Long delayInMs, Long maxRefreshCount);
}


/**
 * A lookup service that yields the same data regardless of the key.
 * 
 */
class LookupServiceConst<K, V>
    extends LookupServiceBase<K, V>
{
    LookupServiceConst(V data);
}

/**
 * Use a sponate source, such as myStore.myCastleSource, as a lookup service.
 */
class LookupServiceSponate
    extends ns.LookupServiceBase<Node, Object>
{
    LookupServiceSponate(SponateSource source);
}


/**
 * TODO Currently named LookupServiceIdFilter
 *
 * Filters keys according to the predicate and only delegates those keys to
 * the underyling service that pass the test.
 */
class LookupServiceKeyFilter<K, V>
    extends LookupServiceDelegateBase<K, V>
{
    LookupServiceKeyFilter(LookupSurvice<K, V>, Function<K> predicate);
}



```




### List Services

[Source file](https://github.com/GeoKnow/Jassa/blob/master/jassa-js/src/main/webapp/resources/js/service/concept-lookup-services.js)

A list service offers "concept"-based lookup. The notion of concept is essentially
any object referring to a set of items, and could be a tag ('must_read'), a bounding box, or a SPARQL concept (See `jassa.sparql.Concept` - TODO currently the class is under jassa.facete.Concept).
It is up to the implementation of the list service to use a suitable interpretation of the provide concept

```java
package jassa.service;

interface ListService<C, K> {
    Promise<Array<K> fetchItems(C concept, Long limit, Long offset);
    Promise<Long> fetchCount(C concept, Long scanLimit);
}



/**
 * A list service that fetches ressources based on bounding boxes.
 * The geoMapFactory abstracts from spatial RDF vocabularies, such as GeoSPARQL and WGS84, and is supports creating properly constraint SPARQL graph patterns from
 * given bounding boxes.
 * The concept is used as an additional filter over all the resources matched by the geoMapFactory.
 * This means, that internally, a combined SPARQL query is created from the geoMapFactory and the concept.
 * For instance, "Airports locatedIn Europe".
 * 
 */
class ListServiceBbox
    implements ListService<jassa.geo.Bounds, Object>
{
    ListServiceBbox(jassa.service.SparqlService sparqlService, jassa.geo.MapFactory geoMapFactory, jassa.sparql.Concept concept);
}


/**
 * A list service that first retrieves a set of resources based on a jassa.sparql.Concept, and then pipes the resources to a lookup service.
 * Can be used to e.g. first retrieve resources within a given bounding box, and in a separate step retrieve corresponding labels.
 */
class ListServiceConceptKeyLookup<V>
    implements ListService<jassa.sparql.Concept, jassa.rdf.Node>
{
    ListServiceConceptKeyLookup(SparqlService sparqlService, LookupService<jassa.rdf.Node, V> lookupService);
}


/**
 *
 */
class ListServiceAsyncTransform<C, V>
    implements ListService<C, W>
{
    ListServiceAugmenter(ListService<C, V> listService, AsyncTransform<Array<V>, Array<W>> asyncTransform);
}



interface AsyncTransform<I, O>
{
    Promise<O> transform(I input);
}

interface AsyncTransformArray<I, O>
    extends AsyncTransform<Array<I>, Array<O>>
{
}

class AsyncTransformerLookupService<I, O>
    implements AsyncTransformArray<I, O>
{
    //Function<I, itemToKeyFn,
    AsyncTransformerLookupService(LookupService<I, O> lookupService, mergeFn);

    transform(Array<I> items);
}


```




### Data Services
Data services offer a minimalistic interface for concept-based data retrieval.
Jassa's map widget makes use of this interface to request the data within
the viewport's bounding box.

```java
package jassa.service;

interface DataService<C, K> {
    Promise<Array<K> fetchData(C concept);
}
```


The following implementation uses an underlying bounding box-based ListService
to cluster areas containing too many items:

```java
package jassa.service;

class DataServiceBboxCache
    implements DataService<jassa.geo.Bounds, Object>
{
    DataServiceBboxCache(ListService<jassa.geo.Bounds> listServiceBbox, Long maxGlobalItemCount, Long maxItemsPerTileCount, Long aquireDepth);
    Promise<Array<Object>> fetchData(jassa.geo.Bounds bounds);
}

```


### Compound Data Access Services






## Open Issues

### Use an alternative structure for List Services?

If we used the structure below, we could make the lookup of items and counts
independent from the concept, which might offer some better reusability, although
the additional indirection increases complexity.

```java
package jassa.service;

interfacet ListServiceFactory<C, K> {
    ListService<K> createListService(C concept);
}

interface ListService<K> {
    
    Promise<Array<K> fetchItems(Long limit, Long offset);
    Promise<Long> fetchCount(Long scanLimit);
}
```
