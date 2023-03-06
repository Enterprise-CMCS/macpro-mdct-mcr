#!/bin/bash
set -e

install_deps() {
  if [ "$CI" == "true" ]; then # If we're in a CI system
    if [ ! -d "node_modules" ]; then # If we don't have any node_modules (CircleCI cache miss scenario), run yarn install --frozen-lockfile.  Otherwise, we're all set, do nothing.
      yarn install --frozen-lockfile
    fi
  else # We're not in a CI system, let's yarn install
    yarn install
  fi
}

install_deps
export PATH=$(pwd)/node_modules/.bin/:$PATH

if [[ $1 == "" ]] ; then
    echo 'ERROR:  You must pass a stage to destroy.  Ex. sh scripts/destroy.sh my-stage-name'
    exit 1
fi
stage=$1

set -e

# Cleanup bigmac topics for branch
data='{"project":"mcr","stage":"'"$stage"'"}'
sls topics --stage main --function deleteTopics --data $data
