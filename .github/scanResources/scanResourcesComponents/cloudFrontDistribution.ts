#!/usr/bin/env -S tsx
import {
  CloudFrontClient,
  paginateListDistributions,
} from "@aws-sdk/client-cloudfront";

const client = new CloudFrontClient({ region: "us-east-1" });

async function getAllDistributions(): Promise<string[]> {
  const ids: string[] = [];

  for await (const page of paginateListDistributions({ client }, {})) {
    for (const d of page.DistributionList!.Items!) {
      ids.push(d.Id!);
    }
  }

  return ids;
}

function generateDeleteCommands(resources: string[]): string[] {
  const commands: string[] = [];
  resources.forEach((id) => {
    commands.push(`# Disable and delete distribution ${id}`);
    commands.push(
      `aws cloudfront get-distribution-config --id ${id} > /tmp/dist-config-${id}.json`
    );
    commands.push(
      `# Manually edit /tmp/dist-config-${id}.json to set Enabled to false, then:`
    );
    commands.push(
      `aws cloudfront update-distribution --id ${id} --distribution-config file:///tmp/dist-config-${id}.json --if-match <ETag>`
    );
    commands.push(
      `aws cloudfront delete-distribution --id ${id} --if-match <ETag>`
    );
  });
  return commands;
}

export default { getAllDistributions, generateDeleteCommands };

async function main() {
  const ids = await getAllDistributions();
  for (const id of ids) console.log(id);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
