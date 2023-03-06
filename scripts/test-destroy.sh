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

# A list of protected/important branches/environments/stages.
protected_stage_regex="(^main$|^val$|^production)"
if [[ $stage =~ $protected_stage_regex ]] ; then
    echo """
      ---------------------------------------------------------------------------------------------
      ERROR:  Please read below
      ---------------------------------------------------------------------------------------------
      The regex used to denote protected stages matched the stage name you passed.
      The regex holds names commonly used for important branches/environments/stages.
      This indicates you're trying to destroy a stage that you likely don't really want to destroy.
      Out of caution, this script will not continue.

      If you really do want to destroy $stage, modify this script as necessary and run again.

      Be careful.
      ---------------------------------------------------------------------------------------------
    """
    exit 1
fi

echo "Collecting information on stage $stage before attempting a destroy... This can take a minute or two..."

set -e


if [ "$CI" != "true" ]; then
  read -p "Do you wish to continue?  Re-enter the stage name to continue:  " -r
  echo
  if [[ ! $REPLY == "$stage" ]]
  then
      echo "Stage name not re-entered.  Doing nothing and exiting."
      exit 1
  fi
fi

# Find hanging api-gateway log group
apiGatewayLogGroupName="/aws/api-gateway/app-api-$stage"
apiGatewayLogGroupExists=(`aws logs describe-log-groups --log-group-name-prefix $apiGatewayLogGroupName | jq -r ".logGroups[] | length"`)
if [[ -n $apiGatewayLogGroupExists ]] ; then
    aws logs delete-log-group --log-group-name $apiGatewayLogGroupName
fi

# Cleanup bigmac topics for branch
data='{"project":"mcr","stage":"'"$stage"'"}'
sls topics invoke --stage main --function deleteTopics --data $data
