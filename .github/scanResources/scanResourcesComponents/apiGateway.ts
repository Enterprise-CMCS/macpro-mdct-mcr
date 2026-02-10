#!/usr/bin/env -S tsx
import {
  APIGatewayClient,
  paginateGetRestApis,
} from "@aws-sdk/client-api-gateway";

const client = new APIGatewayClient({ region: "us-east-1" });

async function getAllRestApis(): Promise<string[]> {
  const ids: string[] = [];

  for await (const page of paginateGetRestApis({ client }, { limit: 500 })) {
    for (const api of page.items!) ids.push(api.id!);
  }

  return ids;
}

function generateDeleteCommands(resources: string[]): string[] {
  return resources.map(
    (id) => `aws apigateway delete-rest-api --rest-api-id ${id}`
  );
}

export default { getAllRestApis, generateDeleteCommands };

async function main() {
  const ids = await getAllRestApis();
  for (const id of ids) console.log(id);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
