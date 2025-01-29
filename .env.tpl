API_URL=http://localhost:3030/local
BANNER_TABLE_NAME=local-banners
COGNITO_USER_POOL_CLIENT_ID=op://mdct_devs/mcr_secrets/COGNITO_USER_POOL_CLIENT_ID
COGNITO_USER_POOL_ID=op://mdct_devs/mcr_secrets/COGNITO_USER_POOL_ID
POST_SIGNOUT_REDIRECT=http://localhost:3000/
DATATRANSFORM_ENABLED=false
DATATRANSFORM_UPDATED_ENABLED=false
DISABLE_ESLINT_PLUGIN=true
DYNAMODB_URL=http://localhost:8000
IAM_PATH=/
IAM_PERMISSIONS_BOUNDARY="bound"
LOCAL_LOGIN=true
MCPAR_FORM_BUCKET=op://mdct_devs/mcr_secrets/MCPAR_FORM_BUCKET
MCPAR_REPORT_TABLE_NAME=local-mcpar-reports
MLR_FORM_BUCKET=op://mdct_devs/mcr_secrets/MLR_FORM_BUCKET
MLR_REPORT_TABLE_NAME=local-mlr-reports
NAAAR_REPORT_TABLE_NAME=local-naaar-reports
NAAAR_FORM_BUCKET=op://mdct_devs/mcr_secrets/NAAAR_FORM_BUCKET
FORM_TEMPLATE_TABLE_NAME=local-form-template-versions
S3_ATTACHMENTS_BUCKET_NAME=op://mdct_devs/mcr_secrets/S3_ATTACHMENTS_BUCKET_NAME
S3_LOCAL_ENDPOINT=http://localhost:4569
SKIP_PREFLIGHT_CHECK=true
TEMPLATE_BUCKET=local-uploads
LOGGING_BUCKET=op://mdct_devs/mcr_secrets/LOGGING_BUCKET
WARMUP_SCHEDULE=60
WARMUP_CONCURRENCY=5

# Values used for short-circuiting ssm: lookups, most likely won't need locally
VPC_ID=local-nonsense
VPC_SUBNET_A=local-nonsense
VPC_SUBNET_B=local-nonsense
VPC_SUBNET_C=local-nonsense
BROKER_STRINGS=local-nonsense
MCPAR_REPORT_TABLE_STREAM_ARN=local-nonsense
MLR_REPORT_TABLE_STREAM_ARN=local-nonsense
NAAAR_REPORT_TABLE_STREAM_ARN=local-nonsense

# needed for e2e tests
CYPRESS_ADMIN_USER_EMAIL=op://mdct_devs/mcr_secrets/CYPRESS_ADMIN_USER_EMAIL
CYPRESS_ADMIN_USER_PASSWORD=op://mdct_devs/mcr_secrets/CYPRESS_ADMIN_USER_PASSWORD # pragma: allowlist secret
CYPRESS_STATE_USER_EMAIL=op://mdct_devs/mcr_secrets/CYPRESS_STATE_USER_EMAIL
CYPRESS_STATE_USER_PASSWORD=op://mdct_devs/mcr_secrets/CYPRESS_STATE_USER_PASSWORD # pragma: allowlist secret

# needed for playwright e2e tests
TEST_ADMIN_USER_EMAIL=op://mdct_devs/mcr_secrets/CYPRESS_ADMIN_USER_EMAIL
TEST_ADMIN_USER_PASSWORD=op://mdct_devs/mcr_secrets/CYPRESS_ADMIN_USER_PASSWORD # pragma: allowlist secret
TEST_STATE_USER_EMAIL=op://mdct_devs/mcr_secrets/CYPRESS_STATE_USER_EMAIL
TEST_STATE_USER_PASSWORD=op://mdct_devs/mcr_secrets/CYPRESS_STATE_USER_PASSWORD # pragma: allowlist secret
TEST_STATE=DC
TEST_STATE_NAME="District of Columbia"

SERVERLESS_LICENSE_KEY=op://mdct_devs/mcr_secrets/SERVERLESS_LICENSE_KEY