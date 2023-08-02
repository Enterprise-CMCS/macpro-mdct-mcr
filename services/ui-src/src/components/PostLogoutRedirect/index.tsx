import config from "config";

export const PostLogoutRedirect = () => {
  window.location.href = config.POST_SIGNOUT_REDIRECT;
  return <></>;
};
