#!/bin/bash
set -o pipefail -o nounset -u
git fetch --all > /dev/null

#Parse inputs
case ${1-} in
  "ci_active"|"ci_inactive"|"cf_other"|"untagged")
    OP=${1-}
    ;;
  *)
    echo "Error:  unkown operation"
    echo "Usage: ${0} [ci_active|ci_inactive|cf_other|untagged] [resource_tagging_response|null]" && exit 1
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
  RESOURCES=$(aws resourcegroupstaggingapi get-resources)
fi

#Create array of objects with the branch name and the interpolated branch name (for bot created branches)
get_branches () {
 RAW_BRANCHES=$(git for-each-ref --format='%(refname)' refs/remotes/origin | sed 's|^.\+\/||g')
 BRANCHES=()
 for B in $RAW_BRANCHES; do
   [ "${B}" == "HEAD" ] && continue
   IBRANCH=$(./setBranchName.sh ${B})
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

#Produce report for active stacks created by the ci pipeline (has a corresponding branch)
ci_active () {
  jq -r '[.[] | select(.BRANCH != null)] | sort_by(.STAGE)' <<< $(get_composite_ci "${1}")
}

#Produce report for active stacks created by the ci pipeline (does NOT have a corresponding branch)
ci_inactive () {
  jq -r '[.[] | select(.BRANCH == null)] | del(.[].BRANCH) | sort_by(.STAGE)' <<< $(get_composite_ci "${1}")
}

#Produce report for resources that have tags but were not created by the ci pipeline
cf_other () {
  jq -r '[.ResourceTagMappingList[] | select((.Tags? | length) > 0) | del(select(.Tags[].Key=="STAGE")) // empty | 
         {
           InferredId: .Tags[] | select(.Key=="aws:cloudformation:stack-name" or .Key=="cms-cloud-service" or .Key=="Name").Value,
           ResourceARN: .ResourceARN
         }] | sort' <<< "${1}"
}

#Produce report for resources that are untagged (some are still created by the ci pipeline)
untagged () {
  jq -r '[{ResourceARN:.ResourceTagMappingList[] | select((.Tags? | length) < 1).ResourceARN}] | sort' <<< "${1}"
}

#Execute operation
$OP "${RESOURCES}"
