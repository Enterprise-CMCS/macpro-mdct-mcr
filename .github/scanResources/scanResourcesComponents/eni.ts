#!/usr/bin/env -S tsx
import {
  EC2Client,
  paginateDescribeNetworkInterfaces,
} from "@aws-sdk/client-ec2";

const client = new EC2Client({ region: "us-east-1" });

async function getAllNetworkInterfaces(): Promise<string[]> {
  const eniDetails: string[] = [];

  for await (const page of paginateDescribeNetworkInterfaces({ client }, {})) {
    if (page.NetworkInterfaces) {
      for (const eni of page.NetworkInterfaces) {
        const eniId = eni.NetworkInterfaceId!;
        const description = eni.Description || "(no description)";
        const status = eni.Status || "unknown";
        eniDetails.push(`${eniId} - ${description} - ${status}`);
      }
    }
  }

  return eniDetails;
}

function generateDeleteCommands(resources: string[]): string[] {
  return resources.map((detail) => {
    const id = detail.split(" - ")[0];
    return `aws ec2 delete-network-interface --network-interface-id ${id}`;
  });
}

export default { getAllNetworkInterfaces, generateDeleteCommands };

async function main() {
  const enis = await getAllNetworkInterfaces();

  for (const e of enis) console.log(e);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
