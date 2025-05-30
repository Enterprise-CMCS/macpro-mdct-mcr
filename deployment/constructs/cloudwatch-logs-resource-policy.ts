import { Construct } from "constructs";
import { CfnResourcePolicy } from "aws-cdk-lib/aws-logs";
import { Aws, aws_iam as iam } from "aws-cdk-lib";

interface CloudWatchLogsResourcePolicyProps {
  readonly project: string;
}

export class CloudWatchLogsResourcePolicy extends Construct {
  public readonly policy: CfnResourcePolicy;

  constructor(
    scope: Construct,
    id: string,
    props: CloudWatchLogsResourcePolicyProps
  ) {
    super(scope, id);

    const policyDocument = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          principals: [new iam.ServicePrincipal("delivery.logs.amazonaws.com")],
          actions: ["logs:CreateLogStream", "logs:PutLogEvents"],
          resources: [
            `arn:aws:logs:*:${Aws.ACCOUNT_ID}:log-group:aws-waf-logs-*`,
            `arn:aws:logs:*:${Aws.ACCOUNT_ID}:log-group:/aws/http-api/*`,
            `arn:aws:logs:*:${Aws.ACCOUNT_ID}:log-group:/aws/vendedlogs/*`,
          ],
          conditions: {
            StringEquals: { "aws:SourceAccount": Aws.ACCOUNT_ID },
            ArnLike: {
              "aws:SourceArn": `arn:aws:logs:${Aws.REGION}:${Aws.ACCOUNT_ID}:*`,
            },
          },
        }),
      ],
    });

    policyDocument.validateForResourcePolicy();

    this.policy = new CfnResourcePolicy(
      this,
      `CentralizedCloudWatchLogsResourcePolicy`,
      {
        policyName: `${props.project}-centralized-logs-policy-${id}`,
        policyDocument: JSON.stringify(policyDocument.toJSON()),
      }
    );
  }
}
