#!/usr/bin/env -S tsx
import { EC2Client, paginateDescribeSecurityGroups } from "@aws-sdk/client-ec2";

const client = new EC2Client({ region: "us-east-1" });

async function getAllSecurityGroups(): Promise<string[]> {
  const groupDetails: string[] = [];

  for await (const page of paginateDescribeSecurityGroups({ client }, {})) {
    if (page.SecurityGroups) {
      for (const sg of page.SecurityGroups) {
        const groupId = sg.GroupId!;
        const groupName = sg.GroupName || "(no name)";
        const description = sg.Description || "(no description)";
        groupDetails.push(`${groupId} - ${groupName} - ${description}`);
      }
    }
  }

  return groupDetails;
}

function generateDeleteCommands(resources: string[]): string[] {
  return resources.map((detail) => {
    const id = detail.split(" - ")[0];
    return `aws ec2 delete-security-group --group-id ${id}`;
  });
}

export default { getAllSecurityGroups, generateDeleteCommands };

async function main() {
  const groups = await getAllSecurityGroups();

  for (const g of groups) console.log(g);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
