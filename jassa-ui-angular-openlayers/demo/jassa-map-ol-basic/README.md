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

## Data Access Abstraction
Jassa's service module comes with APIs for the following common data access patterns:

### Lookup Services
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
 * Use a sponate source, such as myStore.myCastleSource, as a lookup service.
 */
class LookupServiceSponate
    extends ns.LookupServiceBase<Node, Object>
{
    LookupServiceSponate(SponateSource source);
}


/**
 * TODO Currently named LookupServiceIdFilter
 */
class LookupServiceKeyFilter


```




### List Services
A list service offers "concept"-based lookup. The notion of concept is essentially
any object referring to a set of items, and could be a tag ('must_read'), a bounding box, or a SPARQL concept (See `jassa.sparql.Concept` - TODO currently the class is under jassa.facete.Concept).
It is up to the implementation of the list service to use a suitable interpretation of the provide concept

```java
package jassa.service;

interface ListService<C, K> {
    Promise<Array<K> fetchItems(C concept, Long limit, Long offset);
    Promise<Long> fetchCount(C concept, Long scanLimit);
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
