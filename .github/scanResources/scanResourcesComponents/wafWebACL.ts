#!/usr/bin/env -S tsx
import {
  WAFV2Client,
  ListWebACLsCommand,
  WebACLSummary,
} from "@aws-sdk/client-wafv2";

type Scope = "REGIONAL" | "CLOUDFRONT";

const client = new WAFV2Client({ region: "us-east-1" });

async function listWebAclsByScope(scope: Scope): Promise<WebACLSummary[]> {
  const out: WebACLSummary[] = [];
  let NextMarker: string | undefined;

  do {
    const r = await client.send(
      new ListWebACLsCommand({ Scope: scope, NextMarker, Limit: 100 })
    );

    for (const acl of r.WebACLs!) {
      out.push(acl);
    }

    NextMarker = r.NextMarker;
  } while (NextMarker);

  return out;
}

async function getAllWafv2WebACLsCfnIds(): Promise<string[]> {
  const [regional, cloudfront] = await Promise.all([
    listWebAclsByScope("REGIONAL"),
    listWebAclsByScope("CLOUDFRONT"),
  ]);

  const toId = (scope: Scope) => (w: WebACLSummary) =>
    `${w.Name!}|${w.Id!}|${scope}`;

  return [
    ...regional.map(toId("REGIONAL")),
    ...cloudfront.map(toId("CLOUDFRONT")),
  ];
}

function generateDeleteCommands(resources: string[]): string[] {
  return resources.map(
    (id) =>
      `aws wafv2 delete-web-acl --id ${id} --scope <REGIONAL|CLOUDFRONT> --lock-token <token>`
  );
}

export default { getAllWafv2WebACLsCfnIds, generateDeleteCommands };

async function main() {
  const ids = await getAllWafv2WebACLsCfnIds();
  for (const id of ids) console.log(id);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
