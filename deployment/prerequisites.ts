#!/usr/bin/env node
import "source-map-support/register";
import {
  App,
  Aws,
  aws_apigateway as apigateway,
  aws_iam as iam,
  DefaultStackSynthesizer,
  Stack,
  StackProps,
  Tags,
} from "aws-cdk-lib";
import { CloudWatchLogsResourcePolicy } from "./constructs/cloudwatch-logs-resource-policy";
import { loadDefaultSecret } from "./deployment-config";
import { Construct } from "constructs";
import { isLocalStack } from "./local/util";

interface PrerequisiteConfigProps {
  project: string;
}

export class PrerequisiteStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps & PrerequisiteConfigProps
  ) {
    super(scope, id, props);

    const { project } = props;

    new CloudWatchLogsResourcePolicy(this, "logPolicy", { project });

    const cloudWatchRole = new iam.Role(
      this,
      "ApiGatewayRestApiCloudWatchRole",
      {
        assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            "service-role/AmazonAPIGatewayPushToCloudWatchLogs" // pragma: allowlist secret
          ),
        ],
      }
    );

    new apigateway.CfnAccount(this, "ApiGatewayRestApiAccount", {
      cloudWatchRoleArn: cloudWatchRole.roleArn,
    });
  }
}

async function main() {
  const app = new App({
    defaultStackSynthesizer: new DefaultStackSynthesizer({
      deployRoleArn:
        "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/delegatedadmin/developer/cdk-${Qualifier}-deploy-role-${AWS::AccountId}-${AWS::Region}",
      fileAssetPublishingRoleArn:
        "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/delegatedadmin/developer/cdk-${Qualifier}-file-publishing-role-${AWS::AccountId}-${AWS::Region}",
      imageAssetPublishingRoleArn:
        "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/delegatedadmin/developer/cdk-${Qualifier}-image-publishing-role-${AWS::AccountId}-${AWS::Region}",
      cloudFormationExecutionRole:
        "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/delegatedadmin/developer/cdk-${Qualifier}-cfn-exec-role-${AWS::AccountId}-${AWS::Region}",
      lookupRoleArn:
        "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/delegatedadmin/developer/cdk-${Qualifier}-lookup-role-${AWS::AccountId}-${AWS::Region}",
      qualifier: "hnb659fds",
    }),
  });

  Tags.of(app).add("PROJECT", "MCR");

  const project = process.env.PROJECT!;
  new PrerequisiteStack(app, "mcr-prerequisites", {
    project,
    ...(await loadDefaultSecret(project)),
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: "us-east-1",
    },
  });
}

main();
