import { APIGatewayProxyEvent } from "aws-lambda";
import jwt_decode from "jwt-decode";
import { UserRoles, RequestMethods } from "../types";

interface DecodedToken {
  "custom:cms_roles": UserRoles;
  "custom:cms_state"?: string;
  given_name?: string;
  family_name?: string;
  identities?: [{ userId?: string }];
}

export const isAuthorized = (event: APIGatewayProxyEvent) => {
  if (!event.headers["x-api-key"]) return false;

  // get state and method from the event
  const requestState = event.pathParameters?.state;
  const requestMethod = event.httpMethod as RequestMethods;

  // decode the idToken
  const decoded = jwt_decode(event.headers["x-api-key"]) as DecodedToken;

  // get the role / state from the decoded token
  const userRole = decoded["custom:cms_roles"];
  const userState = decoded["custom:cms_state"];

  // if user is a state user - check they are requesting a resource from their state
  if (userState && requestState && userRole === UserRoles.STATE) {
    return userState.toLowerCase() === requestState.toLowerCase();
  }

  // if user is an admin - they can only GET resources
  return requestMethod === RequestMethods.GET;
};

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
