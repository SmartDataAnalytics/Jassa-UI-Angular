/**

Currently ongoing work (March 1, 2015) Claus Stadler

Navigation Features
===================

ARGH! Is it possible that navigation is only needed for inverse relations? Because:
The lookup system already fetches all outgoing resources, so it is fairly straight forward iterating them
via rexContext.json[rexSubject][rexPredicate].

Although this also has the problem about the unclear semantics of adding to it.
With rex-nav-targets we would watch the array and automatically add the appropriate relations to any added data.

So, actually the issue boils down to combining two arrays into a virtual one:
The array of items for which data already exists, and the array of items added by the user.

To keep things as simple as possible, rex-nav-targets should be sufficient, rather than having two arrays
e.g. rex-nav-targets-src and rex-nav-targets-usr
In the worst case, we really could replace the array of objects in the talis rdf json format with a collection, so that
we get
talis[subject][predicate].get(index)
instead of
talis[subject][predicate][index]




(Highest priority, as this is needed for common use cases, such as the dataset form that can reload prior data saved to a sparql endpoint)
Implement rex-sparql-service to set a default sparql service (in a later phase that could be a unified attribute for any jassa-like framework)
rex-nav-targets for navigating to related sets of IRIs

The main issue is, how navigation interacts with the reference/clean up system.
In principle, the directive holding the rex-nav-targets attribute could request a slot from the context
for each target.

Each slot contains a referenced coordinate.
(s, p, i, c)


Reference/Clean Up System
=========================
It has to be clarified how this system exactly works.
In principle, the rex-component directives register themselves at the context, and thus the context knows which (component-)coordinates
are referenced. The context will removed all values from the override, which are not referenced.

We could change this behavior that all data related the referenced subjects is retained.
Doing so would enable pagination and filtering over properties of resources, without losing any edit data.

However, this rule would then have to be applied recursively, such that all subjects referenced by a referenced subject
are also counted as referenced.

And it is not immediately clear how retaining nested subjects can be accomplished as it may happen that there is
no longer be any rex-subject or rex-nav-targets annotation present in the dom.

We could however check the override for which uris it contains, and then recursively check which of them appear as subjects
and prevent those from clean up.


Lookup Features
===============
(Related to the navigation features)
Deprecate
rex-lookup="someFunction(iri)" and replace it with rex-lookup="true/false" which enables/disables lookup based on any given rex-sparql-service.
Default would be true


Emit Control Feature
====================
Add support for rules when RDF based on the DOM should be "accepted".
Accepted has two implications:
- if there is prior looked up data, acceptance means that the provided data will be accepted for overriding the prior data
  as long as the override-candidate data is not accepted, the prior value will be retained (and thus be part of the overall rdf graph)
- if there is no prior looked up data, acceptance means whether to emit any rdf data.
  note that this is similar of using ng-if to conditionally remove rdf-generating dom elements; however
  rex-accept="condition"

rex-accept operates on rdf term level; i.e. it sets the 'accept' attribute in the appropriate location in rexContext.override.


Note: rex-deleted takes precedence over rex-accept.

ISSUE: An alternate behavior would be do treat rex-accept="false" as rex-deleted="true":
If the newly entered value is erroneous, consider the original value to be deleted.
In this case, there is no need for rex-accept. Still we might then add an indicator
rex-invalid="writeOnlyModel" to react to invalid items.

Multivalue Features
===================
(Least priority for now, as for the time being we can get away by creating separate input fields - but of course there are cases where this implies a sucky UX)
Implement rex-values="arrayOfRdfTermValues" such that rex becomes compatible with ng-list

Note that I suppose that multi-value operations make sense on values, but I am not sure if there are good use cases
for any of the remaining 3 components.

rex-values
  rex-default-termtype
  rex-default-lang
  rex-default-datatype

  rex-filter-termtype=stringOrArrayOfStrings // "en" or "['en', 'de']
  rex-filter-datatype=...
  rex-filter-lang
  If no default is specified, the first values of a possibly present filter will become the implied default


<input type="text" ng-model="array" ng-list=" " ng-trim="false" rex-values="array" rex-default-lang="en" rex-default-termtype="uri">
<button ng-click="array.push('a new value')">

Use rex-default-* to specify the effect of adding new values to that array.
Default term type is 'literal'





*/
