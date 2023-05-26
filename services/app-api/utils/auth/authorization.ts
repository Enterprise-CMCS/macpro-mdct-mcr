import { SSM } from "aws-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";
import jwt_decode from "jwt-decode";
import { CognitoJwtVerifier } from "aws-jwt-verify";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserRoles } from "../types";

interface DecodedToken {
  "custom:cms_roles": UserRoles;
  "custom:reports": string;
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
    const ssm = new SSM();
    const stage = process.env.STAGE!;
    const userPoolIdParamName = "/" + stage + "/ui-auth/cognito_user_pool_id";
    const userPoolClientIdParamName =
      "/" + stage + "/ui-auth/cognito_user_pool_client_id";
    const userPoolIdParams = {
      Name: userPoolIdParamName,
    };
    const userPoolClientIdParams = {
      Name: userPoolClientIdParamName,
    };
    const userPoolId = await ssm.getParameter(userPoolIdParams).promise();
    const userPoolClientId = await ssm
      .getParameter(userPoolClientIdParams)
      .promise();
    if (userPoolId?.Parameter?.Value && userPoolClientId?.Parameter?.Value) {
      process.env["COGNITO_USER_POOL_ID"] = userPoolId.Parameter.Value;
      process.env["COGNITO_USER_POOL_CLIENT_ID"] =
        userPoolClientId.Parameter.Value;
      return {
        userPoolId: userPoolId.Parameter.Value,
        userPoolClientId: userPoolClientId.Parameter.Value,
      };
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
  allowedRoles: UserRoles[]
) => {
  let isAllowed = false;
  // decode the idToken
  if (event?.headers["x-api-key"]) {
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

export const hasReportAccess = (
  event: APIGatewayProxyEvent,
  reportType: string
) => {
  let hasAccess = false;
  // decode the idToken
  if (event?.headers["x-api-key"]) {
    const decoded = jwt_decode(event.headers["x-api-key"]) as DecodedToken;
    const idmUserRoles = decoded["custom:cms_roles"];
    const isStateUser = idmUserRoles
      ?.split(",")
      .find((role) => role === "mdctmcr-state-user") as UserRoles;

    // check report access for state users only
    if (!isStateUser) {
      return true;
    }
    const reports = decoded["custom:reports"];
    const allowedReports = reports
      ?.split(",")
      .find((report: string) => report.includes(reportType)) as string;
    if (allowedReports) {
      hasAccess = true;
    }
  }
  return hasAccess;
};
