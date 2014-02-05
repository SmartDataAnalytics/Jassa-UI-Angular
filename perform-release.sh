#!/bin/bash
set -e

npm install

# Retrieve the package version via grunt (no idea how to make grunt output to stdout; that's why i just use a file)
grunt getversion
version=`cat target/version.txt`
tag="v$version"
#echo "$version"

sourceFolder='dist'
targetFolder='target/release/repo'

# !! WARNING: We delete the source folder as we assume its a dist folder anyway !!!
rm -rf "$sourceFolder"

grunt


git clone git@github.com:GeoKnow/Jassa-UI-Angular-Bower.git "$targetFolder" || true
git pull

#rm -rf "$targetFolder"
#mkdir -p "$targetFolder"

for source in `cd "$sourceFolder" && ls -1`; do
    target=`echo "$source" | sed -r 's|-[0-9.]+(-SNAPSHOT)?||g'`
 
    cp -v "$sourceFolder/$source" "$targetFolder/$target"
#    git add "$targetFolder/$target" || true
done


cd "$targetFolder"
git add -A
git commit -m "Updating version $version with tag $tag" --allow-empty
git push
# Delete tag if already present
git tag -d "$tag" || true
git push origin ":refs/tags/$tag" || true
git tag "$tag"
git push --tags 
