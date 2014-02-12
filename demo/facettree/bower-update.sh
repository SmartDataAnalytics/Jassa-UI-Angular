#!/bin/bash
rm -rf app/bower_components
bower cache clean
bower install
grunt bower-install
