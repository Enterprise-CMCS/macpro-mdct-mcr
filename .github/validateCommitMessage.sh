#!/bin/bash
# This file is managed by macpro-mdct-core so if you'd like to change it let's do it there

if [[ ! "$1" =~ ^Merge ]] && grep -q "cmdct-" "$1"; then
  echo "❌ CMDCT must be upper case for CI/CD"
  exit 1
fi
