window._env_ = {
  SKIP_PREFLIGHT_CHECK: "true",
  API_REGION: "us-east-1",
  API_URL: "{{apiGatewayRestApiUrl}}",
  COGNITO_REGION: "us-east-1",
  COGNITO_IDENTITY_POOL_ID: "{{identityPoolId}}",
  COGNITO_USER_POOL_ID: "{{userPoolId}}",
  COGNITO_USER_POOL_CLIENT_ID: "{{userPoolClientId}}",
  COGNITO_USER_POOL_CLIENT_DOMAIN: "{{userPoolClientDomain}}",
  COGNITO_REDIRECT_SIGNIN: "{{applicationEndpointUrl}}",
  COGNITO_REDIRECT_SIGNOUT: "{{applicationEndpointUrl}}",
  STAGE: "{{stage}}",
  TIMESTAMP: "{{timestamp}}",
};
