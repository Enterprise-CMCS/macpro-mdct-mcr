import {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

const COGNITO_CLIENT = new CognitoIdentityProviderClient({
  apiVersion: "2016-04-19",
  region: "us-east-1",
  logger: {
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
  },
});

export async function createUser(params) {
  await COGNITO_CLIENT.send(new AdminCreateUserCommand(params));
}

export async function setPassword(params) {
  await COGNITO_CLIENT.send(new AdminSetUserPasswordCommand(params));
}

export async function updateUserAttributes(params) {
  await COGNITO_CLIENT.send(new AdminUpdateUserAttributesCommand(params));
}
