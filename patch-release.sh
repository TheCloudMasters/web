#!/usr/bin/env bash

set -e

# uesio login
# uesio work
# npm run push
# echo "Seeding workspace with data..."
# ./seed.sh
# echo "Creating new patch bundle..."
# patchResult=$(uesio bundle create -t=patch)
patchResult="Successfully created new bundle version: 1.0.3"
echo "patch result is $patchResult"
#version=$(echo "$patchResult" | grep -o "\d\+.\d\+.\d\+")
grep --help
echo "$patchResult"
grep -o "\d\+.\d\+.\d\+" - "foobar 1.2.3"
version=$(echo "$patchResult" | grep -o "\d\+.\d\+.\d\+" -)
echo "version is $version"
exit 1

echo "Created bundle with version = $version"
echo "Deploying patch bundle to site 'prod'..."
uesio siteadmin -n=prod
uesio site use -b=$version
echo "Uploading latest docs to site 'prod'..."
./seedprod.sh
echo "Successfully released latest docs!"