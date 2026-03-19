#!/bin/bash
# This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
set -o pipefail -o nounset -u
git fetch --all > /dev/null

#Parse inputs
case ${1-} in
  "orphaned_topics")
    OP=${1-}
    ;;
  *)
    echo "Error:  unknown operation"
    echo "Usage: ${0} [orphaned_topics] [resource_tagging_response|null]" && exit 1
    ;;
esac

shift
if [ ! -z "${1-}" ]; then
  if [ -f "${1-}" ]; then
    RESOURCES=$(<"${1-}")
  else
    RESOURCES="${@-}"
  fi
  jq empty <<< "${RESOURCES}"
  [ "$?" != 0 ] && echo "Error:  supplied JSON is invalid." && echo ${RESOURCES} && exit 1
else
  export REGION=us-east-1
  RESOURCES=$(aws resourcegroupstaggingapi get-resources)
fi

#Create array of objects with the branch name and the interpolated branch name (for bot created branches)
get_branches () {
 local RAW_BRANCHES=$(git for-each-ref --format='%(refname:short)' refs/remotes/origin | sed 's|^origin/||')
 local BRANCHES=()
 for B in $RAW_BRANCHES; do
   [ "${B}" == "HEAD" ] && continue
   IBRANCH=$(./setBranchName.ts ${B})
   BRANCHES+=($(echo '{"BRANCH":"'${B}'","IBRANCH":"'${IBRANCH}'"}'))
 done

 jq -s '{BRANCHES:.}' <<< ${BRANCHES[*]}
}

get_composite_ci () {
  local BRANCHES=$(get_branches)
  local RESOURCES=$(jq -r '{RESOURCES:[.ResourceTagMappingList[] | select(.Tags[]?.Key?=="STAGE")]}' <<< "${1}")
  jq -rs 'reduce .[] as $item ({}; . * $item) 
          | [JOIN(INDEX(.BRANCHES[]; .IBRANCH); .RESOURCES[]; .Tags[].Value; add)] 
          | [.[] 
          | {"BRANCH":.BRANCH, "STAGE":.Tags[] 
          | select(.Key=="STAGE").Value, "ResourceARN":.ResourceARN}]' <<< $(echo ${BRANCHES}${RESOURCES})
}

#Produce report for active stacks created by the ci pipeline (does NOT have a corresponding branch)
ci_inactive () {
  jq -r '[.[] | select(.BRANCH == null)] | del(.[].BRANCH) | sort_by(.STAGE)' <<< $(get_composite_ci "${1}")
}

#Create array of objects with the topic name and parsed topic namespace
get_topics () {
  local RAW_TOPICS="$(./run list-topics --stage main | jq -r '.[]')"
  local TOPICS=()
  for T in $RAW_TOPICS; do
    STAGE=$(echo "${T}" | sed 's/--/ /g' | cut -f3 -d' ')
    TOPICS+=($(echo '{"TOPIC":"'${T}'","STAGE":"'${STAGE}'"}'))
  done

  jq -s '{TOPICS:.}' <<< ${TOPICS[*]-}
}

#Produce a report with all topics and associated resource tags
orphaned_topics () {
  local STAGES=$(ci_inactive "${1}" | jq -r '[.[].STAGE] | sort | unique | {STAGES: [{"STAGE":.[]}]}')
  local TOPICS=$(get_topics)
  jq -rs '.[0] * .[1] | [[.STAGES[].STAGE] as $stages | .TOPICS[] | 
          select( . as $topics | $stages | index($topics.STAGE) | not)] |
          sort_by(.STAGE)' <<< $(echo ${TOPICS}${STAGES})
}

#Execute operation
$OP "${RESOURCES}"
