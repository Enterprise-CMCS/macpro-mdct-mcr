window._env_ = {
  API_REGION: "us-east-1",
  API_URL: "{{apiGatewayRestApiUrl}}",
  APPLICATION_ENDPOINT: "{{applicationEndpointUrl}}",
  COGNITO_IDENTITY_POOL_ID: "{{identityPoolId}}",
  COGNITO_IDP_NAME: "Okta",
  COGNITO_REDIRECT_SIGNIN: "{{applicationEndpointUrl}}",
  COGNITO_REDIRECT_SIGNOUT: "{{applicationEndpointUrl}}postLogout",
  COGNITO_REGION: "us-east-1",
  COGNITO_USER_POOL_CLIENT_DOMAIN: "{{userPoolClientDomain}}",
  COGNITO_USER_POOL_CLIENT_ID: "{{userPoolClientId}}",
  COGNITO_USER_POOL_ID: "{{userPoolId}}",
  LD_PROJECT_KEY: "mdct-mcr",
  LOCAL_LOGIN: "false",
  POST_SIGNOUT_REDIRECT: "{{redirectSignout}}",
  REACT_APP_LD_SDK_CLIENT: "{{launchDarklyClient}}",
  SKIP_PREFLIGHT_CHECK: "true",
  STAGE: "{{stage}}",
  TIMESTAMP: "{{timestamp}}",
};
