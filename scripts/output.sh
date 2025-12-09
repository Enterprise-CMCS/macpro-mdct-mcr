#!/usr/bin/env bash
# This file is managed by macpro-mdct-core so if you'd like to change it let's do it there

set -e

if [ -z "${1:-}" ] || [ -z "${2:-}" ]; then
  echo "Usage: ./output.sh <stack_name> <output-key>"
  echo "Example: ./output.sh qmr-cmdct-4184-cdk CloudFrontUrl"
  exit 1
fi

stack_name=$1
output_key=$2

aws cloudformation describe-stacks \
  --stack-name $stack_name \
  --query "Stacks[0].Outputs[?OutputKey=='${output_key}'].OutputValue" \
  --output text
