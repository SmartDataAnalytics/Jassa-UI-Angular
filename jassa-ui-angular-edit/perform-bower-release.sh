#!/bin/bash
set -e

source ./build.conf

./build.sh


cd "$targetFolder"
git add -A
git commit -m "Updating version $version with tag $tag" --allow-empty
git push
# Delete tag if already present
git tag -d "$tag" || true
git push origin ":refs/tags/$tag" || true
git tag "$tag"
git push --tags

