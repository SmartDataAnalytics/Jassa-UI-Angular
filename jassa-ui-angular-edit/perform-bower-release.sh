#!/bin/bash
set -e

sudo npm install

# Retrieve the package version via grunt (no idea how to make grunt output to stdout; that's why i just use a file)
sudo grunt getversion
version=`cat target/version.txt`
tag="v$version"
#echo "$version"

sourceFolder='dist'
targetFolder='/home/cannelony/temp/target/release/repo'

# !! WARNING: We delete the source folder as we assume its a dist folder anyway !!!
sudo rm -rf "$sourceFolder"

grunt


git clone git@github.com:GeoKnow/Jassa-UI-Angular-Edit-Bower.git "$targetFolder" || true
( cd "$targetFolder" && git pull )

#rm -rf "$targetFolder"
#mkdir -p "$targetFolder"

cp bower.json "$targetFolder"
cp css/jassa-ui-angular-edit.css "$targetFolder"

for source in `cd "$sourceFolder" && ls -1`; do
    target=`echo "$source" | sed -r 's|-[0-9.]+(-SNAPSHOT)?\.|\.|g'`
 
    cp -v "$sourceFolder/$source" "$targetFolder/$target"
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

