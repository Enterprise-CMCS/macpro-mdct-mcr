import jwt_decode from "jwt-decode";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { SimpleJwksCache } from "aws-jwt-verify/jwk";
import { SimpleFetcher } from "aws-jwt-verify/https";
// types
import { APIGatewayProxyEvent, UserRoles } from "../types";

interface DecodedToken {
  "custom:cms_roles": UserRoles;
  "custom:cms_state": string | undefined;
}

export const isAuthenticated = async (event: APIGatewayProxyEvent) => {
  const isLocalStack = event.requestContext.accountId === "000000000000";
  if (isLocalStack) {
    return true;
  }

  const userPoolId = process.env.COGNITO_USER_POOL_ID!;
  const clientId = process.env.COGNITO_USER_POOL_CLIENT_ID!;

  // Verifier that expects valid access tokens:
  const verifier = CognitoJwtVerifier.create(
    {
      userPoolId,
      tokenUse: "id",
      clientId,
    },
    {
      jwksCache: new SimpleJwksCache({
        fetcher: new SimpleFetcher({
          defaultRequestOptions: {
            responseTimeout: 6000,
          },
        }),
      }),
    }
  );
  try {
    await verifier.verify(event?.headers?.["x-api-key"]!);
    return true;
  } catch {
    return false;
  }
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
