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
  console.log("trying to load cognito values"); // eslint-disable-line
  if (
    process.env.COGNITO_USER_POOL_ID &&
    process.env.COGNITO_USER_POOL_CLIENT_ID
  ) {
    // eslint-disable-next-line
    console.log(
      "env vars not empty: ",
      process.env.COGNITO_USER_POOL_ID,
      process.env.COGNITO_USER_POOL_CLIENT_ID
    ); // eslint-disable-line
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
    // eslint-disable-next-line
    console.log(
      "cognito param names:",
      userPoolIdParamName,
      userPoolClientIdParamName
    );
    // eslint-disable-next-line
    console.log(
      "trim and standard match values",
      userPoolIdParamName,
      userPoolIdParamName.trim()
    );
    // eslint-disable-next-line
    console.log(
      "trim and standard match bool",
      userPoolIdParamName === userPoolIdParamName.trim()
    );
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
    console.log("fetched both params", userPoolClientId, userPoolId); // eslint-disable-line
    // eslint-disable-next-line
    console.log(
      "values: ",
      userPoolId.Parameter?.Value,
      userPoolClientId.Parameter?.Value
    );
    if (userPoolId.Parameter?.Value && userPoolClientId.Parameter?.Value) {
      process.env["COGNITO_USER_POOL_ID"] = userPoolId.Parameter?.Value;
      process.env["COGNITO_USER_POOL_CLIENT_ID"] =
        userPoolClientId.Parameter?.Value;
      return {
        userPoolId: userPoolId.Parameter.Value,
        userPoolClientId: userPoolClientId.Parameter.Value,
      };
    } else {
      console.log("ssm didn't work. throwing error"); // eslint-disable-line
      throw new Error("cannot load cognito values");
    }
  }
};

export const isAuthorized = async (event: APIGatewayProxyEvent) => {
  const cognitoValues = await loadCognitoValues();
  console.log("got cognito values", cognitoValues); // eslint-disable-line
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
