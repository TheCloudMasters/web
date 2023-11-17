#!/usr/bin/env bash

set -e

uesio login
uesio work -n=$WORKSPACE
uesio pack && uesio workspace deploy

echo "Uploading latest blog posts to workspace '$WORKSPACE'..."
./seed.sh
echo "Successfully uploaded latest blog posts to workspace."

echo "Creating new patch bundle..."
patchResult=$(uesio bundle create -t=patch -d="$DESCRIPTION")

# Extract version number from patchResult variable using grep
version=$(echo "$patchResult" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')

echo "Created bundle with version = $version"
echo "Deploying patch bundle to site '$SITE'..."
uesio siteadmin -n=$SITE
uesio site use -b=$version

echo "Uploading latest blog posts to site '$SITE'..."
./seedsite.sh
echo "Successfully released latest blog posts!"