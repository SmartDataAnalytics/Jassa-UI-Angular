#!/bin/bash

# NOTE: Starting with bower v1.3.6, you can now use
# bower install --force
# instead of this script http://stackoverflow.com/questions/20226232/bower-force-update-of-local-package

rm -rf app/bower_components
bower cache clean
bower install
grunt bowerInstall
