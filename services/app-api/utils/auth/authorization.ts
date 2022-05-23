import { APIGatewayProxyEvent } from "aws-lambda";
import jwt_decode from "jwt-decode";
import { CognitoJwtVerifier } from "aws-jwt-verify";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserRoles } from "../types/types";

interface DecodedToken {
  "custom:cms_roles": UserRoles;
}

export const isAuthorized = async (event: APIGatewayProxyEvent) => {
  // Verifier that expects valid access tokens:
  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID!,
    tokenUse: "id",
    clientId: process.env.COGNITO_USER_POOL_CLIENT_ID!,
  });

  let payload;

  if (event.headers["x-api-key"]) {
    try {
      payload = await verifier.verify(event.headers["x-api-key"]);
    } catch {
      console.log("Token not valid!"); // eslint-disable-line
    }
  }

  return !!payload;
};

export const hasPermissions = (
  event: APIGatewayProxyEvent,
  allowedRoles: UserRoles[]
) => {
  let isAllowed = false;
  // decode the idToken
  if (event.headers["x-api-key"]) {
    const decoded = jwt_decode(event.headers["x-api-key"]) as DecodedToken;
    const idmUserRoles = decoded["custom:cms_roles"];
    const mcrUserRole = idmUserRoles
      ?.split(",")
      .find((role) => role.includes("mdctmcr")) as UserRoles;

    if (allowedRoles.includes(mcrUserRole)) {
      isAllowed = true;
    }
  }

  return isAllowed;
};
