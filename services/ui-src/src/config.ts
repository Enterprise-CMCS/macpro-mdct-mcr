//  @ts-nocheck

const config = {
  MAX_ATTACHMENT_SIZE: 5000000,
  apiGateway: {
    REGION: window._env_.API_REGION,
    URL: window._env_.API_URL,
  },
  cognito: {
    REGION: window._env_.COGNITO_REGION,
    USER_POOL_ID: window._env_.COGNITO_USER_POOL_ID,
    APP_CLIENT_ID: window._env_.COGNITO_USER_POOL_CLIENT_ID,
    APP_CLIENT_DOMAIN: window._env_.COGNITO_USER_POOL_CLIENT_DOMAIN,
    IDENTITY_POOL_ID: window._env_.COGNITO_IDENTITY_POOL_ID,
    COGNITO_IDP_NAME: window._env_.COGNITO_IDP_NAME,
    REDIRECT_SIGNIN: window._env_.COGNITO_REDIRECT_SIGNIN,
    REDIRECT_SIGNOUT: window._env_.COGNITO_REDIRECT_SIGNOUT,
  },
  POST_SIGNOUT_REDIRECT: window._env_.POST_SIGNOUT_REDIRECT,
  REACT_APP_LD_SDK_CLIENT: window._env_.REACT_APP_LD_SDK_CLIENT,
};

export default config;
