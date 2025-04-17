import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export function addIamPropertiesToBucketAutoDeleteRole(
  stack: cdk.Stack | Construct,
  iamPermissionsBoundaryArn: string,
  iamPath: string
) {
  const provider = cdk.Stack.of(stack).node.tryFindChild(
    "Custom::S3AutoDeleteObjectsCustomResourceProvider"
  );
  if (provider) {
    const role = provider.node.tryFindChild("Role") as cdk.aws_iam.CfnRole;
    if (role) {
      role.addPropertyOverride(
        "PermissionsBoundary",
        iamPermissionsBoundaryArn
      );
      role.addPropertyOverride("Path", iamPath);
    }
  }
}
