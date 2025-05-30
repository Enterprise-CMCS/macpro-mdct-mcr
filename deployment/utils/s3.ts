import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export function addIamPropertiesToBucketRole(
  stack: cdk.Stack | Construct,
  endOfCdkPath: string,
  iamPermissionsBoundaryArn: string,
  iamPath: string
) {
  const role = findCdkResource(stack, endOfCdkPath) as cdk.aws_iam.CfnRole;
  if (role) {
    role.addPropertyOverride("PermissionsBoundary", iamPermissionsBoundaryArn);
    role.addPropertyOverride("Path", iamPath);
  }
}

function findCdkResource(
  stack: cdk.Stack | Construct,
  endOfCdkPath: string
): cdk.CfnResource | undefined {
  const parts = endOfCdkPath.split("/");
  let currentNode: Construct | undefined = cdk.Stack.of(stack);

  for (const part of parts) {
    if (!currentNode) {
      return undefined;
    }
    currentNode = currentNode.node.tryFindChild(part);
  }

  return currentNode as cdk.CfnResource;
}
