// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { Construct } from "constructs";
import { Aws, aws_iam as iam, aws_logs as logs } from "aws-cdk-lib";

interface CloudWatchLogsResourcePolicyProps {
  readonly project: string;
}

export class CloudWatchLogsResourcePolicy extends Construct {
  public readonly policy: logs.ResourcePolicy;

  constructor(
    scope: Construct,
    id: string,
    props: CloudWatchLogsResourcePolicyProps
  ) {
    super(scope, id);

    const statement = new iam.PolicyStatement({
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
    });

    this.policy = new logs.ResourcePolicy(
      this,
      "CentralizedCloudWatchLogsResourcePolicy",
      {
        resourcePolicyName: `${props.project}-centralized-logs-policy-${id}`,
        policyStatements: [statement],
      }
    );
  }
}
