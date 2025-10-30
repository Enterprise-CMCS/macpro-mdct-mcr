// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: "us-east-1" });

export async function getSecret(secretId: string) {
  console.log("getting secret:", secretId); // eslint-disable-line no-console
  const command = new GetSecretValueCommand({ SecretId: secretId });
  const data = await client.send(command);
  return data.SecretString;
}
