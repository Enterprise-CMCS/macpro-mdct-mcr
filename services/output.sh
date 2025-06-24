
set -e

help='This script is run with the format  ./output.sh <target stack name> <cloudformation output variable name>'
example='ex.  ./output.sh qmr-cmdct-4184-cdk CloudFrontUrl'

stack_name=${1}
output=${2}

aws cloudformation describe-stacks --stack-name $stack_name --query "Stacks[0].Outputs[?OutputKey=='$output'].OutputValue" --output text
