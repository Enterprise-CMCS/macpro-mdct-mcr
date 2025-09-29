// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { region } from "./consts.js";

export const checkIfAuthenticated = async (): Promise<void> => {
  const client = new STSClient({ region });
  const command = new GetCallerIdentityCommand({});
  await client.send(command);
};
