#!/usr/bin/env bash

CIRCUIT_BREAKER=10
AWS_RETRY_ERROR=254
AWS_THROTTLING_EXCEPTION=252
#0, 1, 2 are the levels of debug, with 0 being off
DEBUG=1

set -o pipefail -o nounset -u

case ${1-} in
  append)
    OP=append
    ;;
  set)
    OP=set
    ;;
  *)
    echo "Error:  unkown operation"
    echo "Usage: ${0} [append|set] [ip_set name] [ip_set id] [list of CIDR blocks]" && exit 1
    ;;
esac

shift
NAME="${1-}"
ID="${2-}"
shift; shift
RUNNER_CIDRS="${@-}"

[[ $DEBUG -ge 1 ]] && echo "Inputs:  NAME \"${NAME}\", ID \"${ID}\", RUNNER_CIDRS \"${RUNNER_CIDRS}\""

[[ -z "${NAME}" ]] || [[ -z "${ID}" ]] || [[ -z "${RUNNER_CIDRS}" ]] && echo "Error:  one or more inputs are missing" && exit 1

#Exponential backoff with jitter
jitter() {
  #.5 seconds
  SHORTEST=50
  #10 seconds
  LONGEST=1000
  DIV=100
  EXP=$(perl -e "use bigint; print $SHORTEST**$1")
  MIN=$(($EXP>$LONGEST ? $LONGEST : $EXP))
  RND=$(shuf -i$SHORTEST-$MIN -n1)
  perl -e "print $RND/$DIV"
}

#Attempt to avoid resource contention from the start
sleep $(jitter $(shuf -i1-10 -n1))

for ((i=1; i <= $CIRCUIT_BREAKER; i++)); do
  #This loop is ONLY for retrying if the retries exceeded exception is thrown
  for ((j=1; j <= $CIRCUIT_BREAKER; j++)); do
    #Read WAF configuration from AWS
    WAF_CONFIG=$(aws wafv2 get-ip-set --scope CLOUDFRONT --id ${ID} --name ${NAME} 2>&1)
    CMD_CD=$?
    [[ $DEBUG -ge 1 ]] && echo "AWS CLI Read Response Code:  ${CMD_CD}"
    [[ $DEBUG -ge 2 ]] && echo "AWS CLI Read Response:  ${WAF_CONFIG}"

    #If the retries exceeded error code is returned, try again, otherwise exit the loop
    [[ $CMD_CD -eq $AWS_RETRY_ERROR ]] || break

    SLEEP_FOR=$(jitter ${j})
    echo "CLI retries exceed.  Waiting for ${SLEEP_FOR} seconds to execute read again...(${j})"
    sleep ${SLEEP_FOR}
  done

  #Unable to get the lock tocken and IP set so there isn't any point in attempting the write op
  [[ $j -ge $CIRCUIT_BREAKER ]] && echo “Attempts to read WAF IPSet exceeded” && sleep $(jitter ${i}) && continue

  #The loop was short circuited with an error code other than 0, so something is wrong
  [[ $CMD_CD -eq 0 ]] || ( echo "An unexpected read error occurred:  ${CMD_CD}" && exit 2 )

  echo "Read was successful."

  if [ ${OP} == "append" ]; then
    ##If this is used to whitelist individual ips or cidrs, using an additive approach is what is required
    #Parse out IP set addresses to array
    IP_ADDRESSES=($(jq -r '.IPSet.Addresses | .[]' <<< ${WAF_CONFIG}))

    #If CIDR is already present in IP set, eject
    grep -q $RUNNER_CIDRS <<< ${IP_ADDRESSES}
    [[ $? -ne 0 ]] || ( echo "CIDR is present in IP Set." && exit 0 )

    #Add runner CIDR to array
    IP_ADDRESSES+=("$RUNNER_CIDRS")
  else 
    ##If this is used to hard set the IP set, just clobber it
    IP_ADDRESSES=("$RUNNER_CIDRS")
  fi

  #Stringify IPs
  STRINGIFIED=$(echo $(IFS=" " ; echo "${IP_ADDRESSES[*]}"))
  [[ $DEBUG -ge 2 ]] && echo "Ip Addresses:  ${STRINGIFIED}"

  #Parse out optimistic concurrency control token
  OCC_TOKEN=$(jq -r '.LockToken' <<< ${WAF_CONFIG})
  [[ $DEBUG -ge 2 ]] && echo "LockToken:  ${OCC_TOKEN}"

  #This loop is ONLY for retrying if the retries exceeded exception is thrown
  for ((k=1; k <= $CIRCUIT_BREAKER; k++)); do
    #Write updated WAF configuration to AWS
    OUTPUT=$(aws wafv2 update-ip-set --scope CLOUDFRONT --id ${ID} --name ${NAME} --lock-token ${OCC_TOKEN} --addresses ${STRINGIFIED} 2>&1)
    CMD_CD=$?
    [[ $DEBUG -ge 1 ]] && echo "AWS CLI Write Response Code:  ${CMD_CD}"
    [[ $DEBUG -ge 2 ]] && echo "AWS CLI Write Response:  ${OUTPUT}"

    #If the retries exceeded error code is returned, try again, otherwise exit the loop
    [[ $CMD_CD -eq $AWS_RETRY_ERROR ]] || break
    #If WAFOptimisticLockException error code is returned, exit the loop
    [[ "$OUTPUT" =~ "WAFOptimisticLockException" ]] && break

    SLEEP_FOR=$(jitter ${k})
    echo "CLI retries exceed.  Waiting for ${SLEEP_FOR} seconds to execute write again...(${k})"
    sleep ${SLEEP_FOR}
  done

  [[ $CMD_CD -ne 0 ]] || break
  #Still not having success, so try again

  echo "Exit Code:  ${CMD_CD}"

  SLEEP_FOR=$(jitter ${i})
  echo "Waiting for ${SLEEP_FOR} seconds to execute main loop again...(${i})"
  sleep ${SLEEP_FOR}
done

[[ $DEBUG -ge 1 ]] && echo "Attempts to update ip set:  $i"

[[ $i -gt $CIRCUIT_BREAKER ]] && echo “Attempts to update WAF IPSet exceeded, exiting.” && exit 2

echo "Applied the IP Set successfully."

#Things should not have made it this far without being able to successfully write the IP Set
exit $CMD_CD
