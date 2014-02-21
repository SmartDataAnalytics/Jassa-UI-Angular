#!/bin/bash
#rm -rf app/bower_components
rm -rf app/bower_components/jassa
bower cache clean
bower install
grunt bower-install
