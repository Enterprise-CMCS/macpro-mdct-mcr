import { SSM } from "aws-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";
import jwt_decode from "jwt-decode";
import { CognitoJwtVerifier } from "aws-jwt-verify";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserRoles } from "../types/types";

interface DecodedToken {
  "custom:cms_roles": UserRoles;
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
    const userPoolIdParams = {
      Name: "${process.env.STAGE!}/ui-auth/cognito_user_pool_id",
    };
    const userPoolClientIdParams = {
      Name: "${process.env.STAGE!}/ui-auth/cognito_user_pool_client_id",
    };
    const userPoolId = await ssm.getParameter(userPoolIdParams).promise();
    const userPoolClientId = await ssm
      .getParameter(userPoolClientIdParams)
      .promise();
    if (userPoolId.Parameter?.Value && userPoolClientId.Parameter?.Value) {
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
