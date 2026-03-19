#!/usr/bin/env -S tsx
import {
  CognitoIdentityProviderClient,
  paginateListUserPools,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

async function getAllUserPools(): Promise<string[]> {
  const ids: string[] = [];

  for await (const page of paginateListUserPools(
    { client },
    { MaxResults: 60 }
  )) {
    for (const p of page.UserPools!) {
      ids.push(p.Id!);
    }
  }

  return ids;
}

function generateDeleteCommands(resources: string[]): string[] {
  return resources.map(
    (id) => `aws cognito-idp delete-user-pool --user-pool-id ${id}`
  );
}

export default { getAllUserPools, generateDeleteCommands };

async function main() {
  const ids = await getAllUserPools();
  for (const id of ids) console.log(id);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
