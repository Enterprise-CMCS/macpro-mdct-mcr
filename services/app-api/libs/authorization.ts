import { APIGatewayProxyEvent } from "aws-lambda";
import jwt_decode from "jwt-decode";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserRoles } from "../types";

interface DecodedToken {
  "custom:cms_roles": UserRoles;
  "custom:cms_state"?: string;
  given_name?: string;
  family_name?: string;
  identities?: [{ userId?: string }];
}

// TODO: COMPLETELY CHANGE EVERYTHING ABOUT THIS
export const isAuthorized = (event: APIGatewayProxyEvent) => {
  if (!event.headers["x-api-key"]) return false;

  /*
   * TODO: check user_role against lambda context user data
   * to confirm the user is an admin_user, since /banners
   * is the only endpoint right now
   *
   * returning true for the purposes of this commit, but will change later
   */

  return true;
};

// TODO: NEED TO CHANGE THIS TO NOT USE JWT_DECODE (SAME AS ABOVE)
export const getUserNameFromJwt = (event: APIGatewayProxyEvent) => {
  let userName = "branchUser";
  if (!event?.headers || !event.headers?.["x-api-key"]) return userName;

  const decoded = jwt_decode(event.headers["x-api-key"]) as DecodedToken;

  if (decoded["given_name"] && decoded["family_name"]) {
    userName = `${decoded["given_name"]} ${decoded["family_name"]}`;
    return userName;
  }

  if (decoded.identities && decoded.identities[0]?.userId) {
    userName = decoded?.identities[0].userId;
    return userName;
  }

  return userName;
};
