
#!/bin/bash
set -e
stage=${1:-dev}

services_set1=(
  'database'
  'uploads'
  'topics'
)

services_set2=(
  'app-api'
  'ui'
  'ui-auth'
  'ui-src'
)

install_deps() {
  if [ "$CI" == "true" ]; then # If we're in a CI system
    if [ ! -d "node_modules" ]; then # If we don't have any node_modules (CircleCI cache miss scenario), run yarn install --frozen-lockfile.  Otherwise, we're all set, do nothing.
      yarn install --frozen-lockfile
    fi
  else # We're not in a CI system, let's yarn install
    yarn install
  fi
}

deploy() {
  service=$1
  pushd services/$service
  install_deps
  serverless deploy --stage $stage
  popd
}

install_deps
export PATH=$(pwd)/node_modules/.bin/:$PATH

# Run the deployment of services_set1 in a subshell
(
  for i in "${services_set1[@]}"; do
    deploy $i
  done
)

# Run the deployment of services_set2 in a subshell
(
  for i in "${services_set2[@]}"; do
    deploy $i
  done
)

pushd services

echo """
------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------
Application endpoint:  `./output.sh ui CloudFrontEndpointUrl $stage`
------------------------------------------------------------------------------------------------
"""
popd
