import { Construct } from "constructs";
import { aws_iam as iam } from "aws-cdk-lib";

interface CreateCustomResourceRoleProps {
  scope: Construct;
  iamPermissionsBoundary: iam.IManagedPolicy;
  iamPath: string;
}

export function createCustomResourceRole(props: CreateCustomResourceRoleProps) {
  const { scope, iamPermissionsBoundary, iamPath } = props;

  return new iam.Role(scope, "CustomResourceRole", {
    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    path: iamPath,
    permissionsBoundary: iamPermissionsBoundary,
    inlinePolicies: {
      InlinePolicy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            actions: ["lambda:InvokeFunction"],
            resources: ["*"],
          }),
          new iam.PolicyStatement({
            actions: [
              "logs:CreateLogGroup",
              "logs:CreateLogStream",
              "logs:PutLogEvents",
              "cloudfront:CreateInvalidation",
            ],
            resources: ["*"],
          }),
        ],
      }),
    },
  });
}
