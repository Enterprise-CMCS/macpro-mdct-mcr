#!/bin/bash
# This file is managed by macpro-mdct-core so if you'd like to change it let's do it there

set -e

local_branch=${1}
[ -z "${1}" ] && local_branch=$(git rev-parse --abbrev-ref HEAD)

valid_branch='^[a-z][a-z0-9-]*$'

reserved_words=(
    cognito
)

join_by() { local IFS='|'; echo "$*"; }

#creates glob match to check for reserved words used in branch names which would trigger failures
glob=$(join_by $(for i in ${reserved_words[@]}; do echo "^$i-|-$i$|-$i-|^$i$"; done;))

if [[ ! $local_branch =~ $valid_branch ]] || [[ $local_branch =~ $glob ]] || [[ ${#local_branch} -gt 64 ]]; then
    echo """
     ------------------------------------------------------------------------------------------------------------------------------
     ERROR:  Please read below
     ------------------------------------------------------------------------------------------------------------------------------
    Bad branch name detected; cannot continue.  $local_branch

    To head off deployment issues where the branch name becomes part of AWS resource names: A branch name should only contain alphanumeric (case sensitive) and hyphens. It should start with an alphabetic character and shouldnt exceed 64 characters.
    So, make a new branch with a name that begins with a letter and is made up of only letters, numbers, and hyphens... then delete this branch.
    ------------------------------------------------------------------------------------------------------------------------------
    """
    exit 1
fi

exit 0
