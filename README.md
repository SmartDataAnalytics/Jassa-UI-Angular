# Jassa-Angular-UI

This repository contains a set of reusable angularjs directives (widgets) for user interface components based on the [JAvaScript Suite for Sparql Access (Jassa)](https://github.com/GeoKnow/Jassa).
The widgets are designed to work directly on a SPARQL endpoint and cope with large result sets by means of pagination support.

_Disclaimer: The repository layout and the build configuration are based on [angular-ui-bootstrap](https://github.com/angular-ui/bootstrap)._

## Components

### Facet Search
* FacetTree: A SPARQL-based data-driven widget for showing a (possibly) nested facet tree for a selected set of resources. Nodes in the tree feature support for regex search and pagination.
* FacetValueList: A SPARQL-based data-driven widget for showing the list of values for a given facet selection. Supports regex search and pagination.
* ConstraintList: A widget which summarizes 


### Map display
The interaction of the faceted search components with the map frameworks (OpenLayers)[http://openlayers.org/] and (Leaflet)[http://leafletjs.com/] is work in progress.


## Demo

See the widgets in action [here](http://cstadler.aksw.org/jassa-ui/).
_The stylistic aspect is work in progress :)_


## Usage

You can install jassa-ui-angular with the bower package managager using

    bower install jassa-ui-angular

This will checkout the latest version (by git tag) from our [bower release repository](https://github.com/GeoKnow/Jassa-UI-Angular-Bower).

HTML tags for the dependencies can be injected into a file using the `bower-install` grunt task.

    grunt bower-install

For some dependencies bower-install task does not know what to add to your HTML file due to lack of metadata. Manually add the following elements to your `index.html` or main file.

    <link rel="stylesheet" href="css/jassa-ui-angular.css" />
    <script src="bower_components/jscache/cache.js"></script>
    <script src="bower_components/underscore.string/lib/underscore.string.js"></script>


Note: [This issue](https://github.com/angular-ui/bootstrap/issues/1791) causes Angular-UI-Bootstrap v0.10.0 to throw an exception when using expressions for the active state of tabs. The issue seems to be fixed in master, but there is no bower release yet. Hence, you need to fall back to this [slightly modified version](https://github.com/GeoKnow/Jassa-UI-Angular/blob/master/jassa-ui-angular-core/demo/facet-tree/app/lib/angular-ui/0.10.0/ui-bootstrap-tpls-0.10.0.js).


    <script src="lib/angular-ui/0.10.0/ui-bootstrap-tpls-0.10.0.js"></script>

## Build

Make sure that a current version `npm` is available on your system.
You can install `npm` using:

```bash
# Remove or purge old versions
sudo apt-get remove nodejs npm
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
# The nodejs package includes the npm command
```

Install development tools (-g indicates to install them globally on your system rather than the current working directory)

```bash
sudo npm install -g grunt-cli
sudo npm install -g bower
```

Run the build script

```bash
cd jassa-ui-angular-core
./build.sh
```

## Project layout

* `jassa-ui-angular-core`: Module for core widgets which do not depend on other user interface libraries except for angular-ui-bootstrap.
* `jassa-ui-angular-geo-openlayers`: Module for openlayer widgets. WIP.

## License
To be clarified (some liberal one, such as MIT or Apache v2)

