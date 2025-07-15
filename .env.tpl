BannerTable=local-banners
COGNITO_USER_POOL_CLIENT_ID=op://mdct_devs/mcr_secrets/COGNITO_USER_POOL_CLIENT_ID
COGNITO_USER_POOL_ID=op://mdct_devs/mcr_secrets/COGNITO_USER_POOL_ID
COGNITO_USER_POOL_CLIENT_DOMAIN=op://mdct_devs/mcr_secrets/COGNITO_USER_POOL_CLIENT_DOMAIN
COGNITO_IDENTITY_POOL_ID=op://mdct_devs/mcr_secrets/COGNITO_IDENTITY_POOL_ID
POST_SIGNOUT_REDIRECT=http://localhost:3000/
REACT_APP_LD_SDK_CLIENT=op://mdct_devs/mcr_secrets/REACT_APP_LD_SDK_CLIENT
DATATRANSFORM_ENABLED=false
DATATRANSFORM_UPDATED_ENABLED=false
DISABLE_ESLINT_PLUGIN=true
MCPAR_FORM_BUCKET=op://mdct_devs/mcr_secrets/MCPAR_FORM_BUCKET
McparReportsTable=local-mcpar-reports
MLR_FORM_BUCKET=op://mdct_devs/mcr_secrets/MLR_FORM_BUCKET
MlrReportsTable=local-mlr-reports
NaaarReportsTable=local-naaar-reports
NAAAR_FORM_BUCKET=op://mdct_devs/mcr_secrets/NAAAR_FORM_BUCKET
FormTemplateVersionsTable=local-form-template-versions
SKIP_PREFLIGHT_CHECK=true
WARMUP_SCHEDULE=60
WARMUP_CONCURRENCY=5

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

# db:seed
SEED_ADMIN_USER_EMAIL=op://mdct_devs/mcr_secrets/SEED_ADMIN_USER_EMAIL
SEED_ADMIN_USER_PASSWORD=op://mdct_devs/mcr_secrets/SEED_ADMIN_USER_PASSWORD # pragma: allowlist secret
SEED_STATE_USER_EMAIL=op://mdct_devs/mcr_secrets/SEED_STATE_USER_EMAIL
SEED_STATE_USER_PASSWORD=op://mdct_devs/mcr_secrets/SEED_STATE_USER_PASSWORD # pragma: allowlist secret
SEED_STATE=op://mdct_devs/mcr_secrets/SEED_STATE
SEED_STATE_NAME=op://mdct_devs/mcr_secrets/SEED_STATE_NAME
