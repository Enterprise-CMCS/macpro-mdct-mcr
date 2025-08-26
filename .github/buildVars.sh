#!/bin/bash

var_list=(
  'AWS_OIDC_ROLE_TO_ASSUME'
  'AWS_DEFAULT_REGION'
)

set_value() {
  varname=${1}
  if [ ! -z "${!varname}" ]; then
    echo "Setting $varname"
    echo "${varname}=${!varname}" >> $GITHUB_ENV
    echo "${varname}=${!varname}" >> $GITHUB_OUTPUT
  fi
}

set_name() {
  varname=${1}
  echo "BRANCH_SPECIFIC_VARNAME_$varname=${branch_name//-/_}_$varname" >> $GITHUB_ENV
  echo "BRANCH_SPECIFIC_VARNAME_$varname=${branch_name//-/_}_$varname" >> $GITHUB_OUTPUT
}

action=${1}

case "$1" in
set_names)
  for i in "${var_list[@]}"
  do
    set_name $i
  done
  ;;
set_values)
  for i in "${var_list[@]}"
  do
  	set_value $i
  done
  ;;
esac
