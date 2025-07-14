import jwt_decode from "jwt-decode";
// types
import { APIGatewayProxyEvent, UserRoles } from "../types";

interface DecodedToken {
  "custom:cms_roles": UserRoles;
  "custom:cms_state": string | undefined;
}

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
