import { Construct } from "constructs";
import { aws_iam as iam } from "aws-cdk-lib";

interface CreateCustomResourceRoleProps {
  scope: Construct;
  isDev: boolean;
}

export function createCustomResourceRole(props: CreateCustomResourceRoleProps) {
  const { isDev, scope } = props;

  return new iam.Role(scope, "CustomResourceRole", {
    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
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
          ...(isDev
            ? [
                new iam.PolicyStatement({
                  effect: iam.Effect.DENY,
                  actions: ["logs:CreateLogGroup"],
                  resources: ["*"],
                }),
              ]
            : []),
        ],
      }),
    },
  });
}
