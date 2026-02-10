#!/usr/bin/env -S tsx
import {
  CloudFrontClient,
  ListResponseHeadersPoliciesCommand,
} from "@aws-sdk/client-cloudfront";

const client = new CloudFrontClient({ region: "us-east-1" });

async function getAllCustomResponseHeadersPolicies(): Promise<string[]> {
  const ids: string[] = [];
  let marker: string | undefined;

  do {
    const r = await client.send(
      new ListResponseHeadersPoliciesCommand({ Marker: marker })
    );

    for (const item of r.ResponseHeadersPolicyList!.Items!) {
      if (item.Type === "custom") ids.push(item.ResponseHeadersPolicy!.Id!);
    }

    marker = r.ResponseHeadersPolicyList!.NextMarker;
  } while (marker);

  return ids;
}

function generateDeleteCommands(resources: string[]): string[] {
  return resources.map(
    (id) => `aws cloudfront delete-response-headers-policy --id ${id}`
  );
}

export default {
  getAllCustomResponseHeadersPolicies,
  generateDeleteCommands,
};

async function main() {
  const ids = await getAllCustomResponseHeadersPolicies();
  for (const id of ids) console.log(id);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
