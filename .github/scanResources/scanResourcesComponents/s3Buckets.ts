#!/usr/bin/env -S tsx
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const client = new S3Client({ region: "us-east-1" });

async function getAllS3Buckets(): Promise<string[]> {
  const r = await client.send(new ListBucketsCommand({}));
  return r.Buckets!.map((b) => b.Name!);
}

function generateDeleteCommands(resources: string[]): string[] {
  return resources.map(
    (name) => `aws s3 rb s3://${name} --force  # WARNING: Deletes all objects!`
  );
}

export default { getAllS3Buckets, generateDeleteCommands };

async function main() {
  const names = await getAllS3Buckets();
  for (const n of names) console.log(n);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
