#!/usr/bin/env -S tsx
import {
  CloudFrontClient,
  paginateListOriginAccessControls,
} from "@aws-sdk/client-cloudfront";

const client = new CloudFrontClient({ region: "us-east-1" });

async function getAllOriginAccessControls(): Promise<string[]> {
  const ids: string[] = [];

  for await (const page of paginateListOriginAccessControls({ client }, {})) {
    for (const item of page.OriginAccessControlList!.Items!) {
      ids.push(item.Id!);
    }
  }

  return ids;
}

function generateDeleteCommands(resources: string[]): string[] {
  return resources.map(
    (id) => `aws cloudfront delete-origin-access-control --id ${id}`
  );
}

export default { getAllOriginAccessControls, generateDeleteCommands };

async function main() {
  const ids = await getAllOriginAccessControls();
  for (const id of ids) console.log(id);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
