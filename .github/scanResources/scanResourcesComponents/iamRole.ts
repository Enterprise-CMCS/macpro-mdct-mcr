#!/usr/bin/env -S tsx
import { IAMClient, paginateListRoles } from "@aws-sdk/client-iam";

const client = new IAMClient({ region: "us-east-1" });

async function getAllIamRoles(): Promise<string[]> {
  const names: string[] = [];

  for await (const page of paginateListRoles({ client }, { MaxItems: 1000 })) {
    for (const role of page.Roles!) {
      names.push(role.RoleName!);
    }
  }

  return names;
}

function generateDeleteCommands(resources: string[]): string[] {
  const commands: string[] = [];
  resources.forEach((name) => {
    commands.push(`# Delete IAM role ${name}`);
    commands.push(
      `aws iam list-attached-role-policies --role-name ${name} --query 'AttachedPolicies[].PolicyArn' --output text | xargs -n1 aws iam detach-role-policy --role-name ${name} --policy-arn`
    );
    commands.push(
      `aws iam list-role-policies --role-name ${name} --query 'PolicyNames[]' --output text | xargs -n1 aws iam delete-role-policy --role-name ${name} --policy-name`
    );
    commands.push(`aws iam delete-role --role-name ${name}`);
  });
  return commands;
}

export default { getAllIamRoles, generateDeleteCommands };

async function main() {
  const names = await getAllIamRoles();
  for (const n of names) console.log(n);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
