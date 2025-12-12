PROJECT=mcr

COGNITO_USER_POOL_CLIENT_ID=op://mdct_devs/mcr_secrets/COGNITO_USER_POOL_CLIENT_ID
COGNITO_USER_POOL_ID=op://mdct_devs/mcr_secrets/COGNITO_USER_POOL_ID
COGNITO_USER_POOL_CLIENT_DOMAIN=op://mdct_devs/mcr_secrets/COGNITO_USER_POOL_CLIENT_DOMAIN
COGNITO_IDENTITY_POOL_ID=op://mdct_devs/mcr_secrets/COGNITO_IDENTITY_POOL_ID
LD_SDK_KEY=op://mdct_devs/mcr_secrets/LD_SDK_KEY
REACT_APP_LD_SDK_CLIENT=op://mdct_devs/mcr_secrets/REACT_APP_LD_SDK_CLIENT

# needed for e2e tests
CYPRESS_ADMIN_USER_EMAIL=op://mdct_devs/mcr_secrets/CYPRESS_ADMIN_USER_EMAIL
CYPRESS_ADMIN_USER_PASSWORD=op://mdct_devs/mcr_secrets/CYPRESS_ADMIN_USER_PASSWORD # pragma: allowlist secret
CYPRESS_STATE_USER_EMAIL=op://mdct_devs/mcr_secrets/CYPRESS_STATE_USER_EMAIL
CYPRESS_STATE_USER_PASSWORD=op://mdct_devs/mcr_secrets/CYPRESS_STATE_USER_PASSWORD # pragma: allowlist secret

# needed for playwright e2e tests
TEST_ADMIN_USER_EMAIL=op://mdct_devs/mcr_secrets/SEED_ADMIN_USER_EMAIL
TEST_ADMIN_USER_PASSWORD=op://mdct_devs/mcr_secrets/SEED_ADMIN_USER_PASSWORD # pragma: allowlist secret
TEST_STATE_USER_EMAIL=op://mdct_devs/mcr_secrets/SEED_STATE_USER_EMAIL
TEST_STATE_USER_PASSWORD=op://mdct_devs/mcr_secrets/SEED_STATE_USER_PASSWORD # pragma: allowlist secret
TEST_STATE=op://mdct_devs/mcr_secrets/SEED_STATE
TEST_STATE_NAME=op://mdct_devs/mcr_secrets/SEED_STATE_NAME

# db:seed
SEED_ADMIN_USER_EMAIL=op://mdct_devs/mcr_secrets/SEED_ADMIN_USER_EMAIL
SEED_ADMIN_USER_PASSWORD=op://mdct_devs/mcr_secrets/SEED_ADMIN_USER_PASSWORD # pragma: allowlist secret
SEED_STATE_USER_EMAIL=op://mdct_devs/mcr_secrets/SEED_STATE_USER_EMAIL
SEED_STATE_USER_PASSWORD=op://mdct_devs/mcr_secrets/SEED_STATE_USER_PASSWORD # pragma: allowlist secret
SEED_STATE=op://mdct_devs/mcr_secrets/SEED_STATE
SEED_STATE_NAME=op://mdct_devs/mcr_secrets/SEED_STATE_NAME
