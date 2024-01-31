import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import jwt_decode from "jwt-decode";
import { CognitoJwtVerifier } from "aws-jwt-verify";
// types
import { APIGatewayProxyEvent, UserRoles } from "../types";
import { logger } from "../debugging/debug-lib";

interface DecodedToken {
  "custom:cms_roles": UserRoles;
  "custom:cms_state": string | undefined;
}

const loadCognitoValues = async () => {
  if (
    process.env.COGNITO_USER_POOL_ID &&
    process.env.COGNITO_USER_POOL_CLIENT_ID
  ) {
    return {
      userPoolId: process.env.COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
    };
  } else {
    const ssmClient = new SSMClient({ logger });
    const stage = process.env.STAGE!;
    const getParam = async (identifier: string) => {
      const command = new GetParameterCommand({
        Name: `/${stage}/ui-auth/${identifier}`,
      });
      const result = await ssmClient.send(command);
      return result.Parameter?.Value;
    };
    const userPoolId = await getParam("cognito_user_pool_id");
    const userPoolClientId = await getParam("cognito_user_pool_client_id");
    if (userPoolId && userPoolClientId) {
      process.env["COGNITO_USER_POOL_ID"] = userPoolId;
      process.env["COGNITO_USER_POOL_CLIENT_ID"] = userPoolClientId;
      return { userPoolId, userPoolClientId };
    } else {
      throw new Error("cannot load cognito values");
    }
  }
};

export const isAuthorized = async (event: APIGatewayProxyEvent) => {
  const cognitoValues = await loadCognitoValues();
  // Verifier that expects valid access tokens:
  const verifier = CognitoJwtVerifier.create({
    userPoolId: cognitoValues.userPoolId,
    tokenUse: "id",
    clientId: cognitoValues.userPoolClientId,
  });

  let isAuthorized;

  if (event?.headers?.["x-api-key"]) {
    try {
      isAuthorized = await verifier.verify(event.headers["x-api-key"]);
    } catch {
      // verification failed - unauthorized
      isAuthorized = false;
    }
  }

  return !!isAuthorized;
};

export const hasPermissions = (
  event: APIGatewayProxyEvent,
  allowedRoles: UserRoles[],
  state?: string
) => {
  let isAllowed = false;
  // decode the idToken
  if (event?.headers?.["x-api-key"]) {
    const decoded = jwt_decode(event.headers["x-api-key"]) as DecodedToken;
    const idmUserRoles = decoded["custom:cms_roles"];
    const idmUserState = decoded["custom:cms_state"];
    let mcrUserRole = idmUserRoles
      ?.split(",")
      .find((role) => role.includes("mdctmcr")) as UserRoles;

    // consolidate "STATE_REP" role into "STATE_USER" role
    if (mcrUserRole === UserRoles.STATE_REP) {
      mcrUserRole = UserRoles.STATE_USER;
    }

    if (state) {
      if (allowedRoles.includes(mcrUserRole) && idmUserState?.includes(state)) {
        isAllowed = true;
      }
    } else {
      if (allowedRoles.includes(mcrUserRole)) {
        isAllowed = true;
      }
    }
  }

  return isAllowed;
};
