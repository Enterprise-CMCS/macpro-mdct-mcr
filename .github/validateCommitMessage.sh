#!/bin/bash

if [[ ! "$1" =~ ^Merge ]] && grep -q "cmdct-" "$1"; then
  echo "❌ CMDCT must be upper case for CI/CD"
  exit 1
fi
