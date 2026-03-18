#!/usr/bin/env -S tsx
import {
  KMSClient,
  paginateListKeys,
  DescribeKeyCommand,
} from "@aws-sdk/client-kms";

const client = new KMSClient({ region: "us-east-1" });

async function getAllKmsKeys(): Promise<string[]> {
  const keyDetails: string[] = [];

  for await (const page of paginateListKeys({ client }, { Limit: 100 })) {
    if (page.Keys) {
      for (const key of page.Keys) {
        const keyId = key.KeyId!;
        try {
          const describeResult = await client.send(
            new DescribeKeyCommand({ KeyId: keyId })
          );

          // Skip AWS-managed keys (cannot be deleted)
          const keyManager = describeResult.KeyMetadata?.KeyManager;
          if (keyManager === "AWS") {
            continue;
          }

          const description =
            describeResult.KeyMetadata?.Description || "(no description)";
          keyDetails.push(`${keyId} - ${description}`);
        } catch {
          keyDetails.push(`${keyId} - (unable to describe)`);
        }
      }
    }
  }

  return keyDetails;
}

async function getKeysFromAliases(aliasNames: string[]): Promise<string[]> {
  const keyIds: string[] = [];

  for (const aliasName of aliasNames) {
    try {
      const describeResult = await client.send(
        new DescribeKeyCommand({ KeyId: aliasName })
      );
      const keyId = describeResult.KeyMetadata?.KeyId;
      if (keyId) {
        keyIds.push(keyId);
      }
    } catch {
      // Alias might not exist or might have been deleted
      continue;
    }
  }

  return keyIds;
}

function generateDeleteCommands(resources: string[]): string[] {
  return resources.map((detail) => {
    const id = detail.split(" - ")[0];
    return `aws kms schedule-key-deletion --key-id ${id} --pending-window-in-days 7`;
  });
}

export default { getAllKmsKeys, getKeysFromAliases, generateDeleteCommands };

async function main() {
  const keys = await getAllKmsKeys();

  for (const k of keys) console.log(k);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
