import jwt_decode from "jwt-decode";
import { CognitoJwtVerifier } from "aws-jwt-verify";
// types
import { APIGatewayProxyEvent, UserRoles } from "../types";
import { logger } from "../debugging/debug-lib";

interface DecodedToken {
  "custom:cms_roles": UserRoles;
  "custom:cms_state": string | undefined;
  sub?: string;
}

const createVerifier = () =>
  CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID!,
    tokenUse: "id",
    clientId: process.env.COGNITO_USER_POOL_CLIENT_ID!,
  });

// Kept between requests so Cognito's signing keys are only downloaded once
let verifier: ReturnType<typeof createVerifier> | undefined;

/** Checks that the ID token in x-api-key was signed by our Cognito user pool */
export const isAuthenticated = async (event: APIGatewayProxyEvent) => {
  const token = event?.headers?.["x-api-key"];
  if (!token) {
    return false;
  }

  try {
    verifier ??= createVerifier();
    await verifier.verify(token);
    return true;
  } catch (error) {
    logger.warn("Token rejected: %s", (error as Error).message);
    return false;
  }
};

/** Only call after isAuthenticated: this reads the token without verifying it */
export const hasPermissions = (
  event: APIGatewayProxyEvent,
  allowedRoles: UserRoles[],
  state?: string
) => {
  let isAllowed = false;
  // decode the idToken
  if (event?.headers?.["x-api-key"]) {
    const decoded = jwt_decode(event.headers["x-api-key"]) as DecodedToken;
    logger.debug(`Requesting user has sub '${decoded.sub}'`);
    const idmUserRoles = decoded["custom:cms_roles"];
    const idmUserState = decoded["custom:cms_state"];
    let mcrUserRole = idmUserRoles
      ?.split(",")
      .find((role) => role.includes("mdctmcr")) as UserRoles;

    // consolidate "STATE_REP" role into "STATE_USER" role
    if (mcrUserRole === UserRoles.STATE_REP) {
      mcrUserRole = UserRoles.STATE_USER;
    }

    isAllowed =
      allowedRoles.includes(mcrUserRole) &&
      (!state || idmUserState?.includes(state))!;
  }

  return isAllowed;
};

export const isAuthorizedToFetchState = (
  event: APIGatewayProxyEvent,
  state: string
) => {
  // If this is a state user for the matching state, authorize them.
  if (hasPermissions(event, [UserRoles.STATE_USER], state)) {
    return true;
  }

  const nonStateUserRoles = Object.values(UserRoles).filter(
    (role) => role !== UserRoles.STATE_USER
  );

  // If they are any other user type, they don't need to belong to this state.
  return hasPermissions(event, nonStateUserRoles);
};
