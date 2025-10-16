#!/usr/bin/env node
// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import "source-map-support/register";
import {
  App,
  SecretValue,
  Stack,
  StackProps,
  aws_ec2 as ec2,
  aws_iam as iam,
  aws_secretsmanager as secretsmanager,
} from "aws-cdk-lib";
import { Construct } from "constructs";

if (!process.env.PROJECT) {
  throw new Error("PROJECT enironment variable is required but not set");
}

const project = process.env.PROJECT!;

export class LocalPrerequisiteStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const localstackVpc = new ec2.Vpc(this, "localstackVpc", {
      ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/16"),
      enableDnsSupport: true,
      enableDnsHostnames: false,
      subnetConfiguration: [],
      vpcName: "localstack",
    });

    const subnet1 = new ec2.Subnet(this, "Subnet1", {
      vpcId: localstackVpc.vpcId,
      availabilityZone: "us-east-1a",
      cidrBlock: "10.0.1.0/24",
    });

    new secretsmanager.Secret(this, "DefaultSecret", {
      secretName: `${project}-default`, // pragma: allowlist secret
      secretObjectValue: {
        brokerString: SecretValue.unsafePlainText("localstack"),
        kafkaAuthorizedSubnetIds: SecretValue.unsafePlainText(subnet1.subnetId),
        launchDarklyClient: SecretValue.unsafePlainText("localstack"),
        oktaMetadataUrl: SecretValue.unsafePlainText("localstack"),
        redirectSignout: SecretValue.unsafePlainText("localstack"),
        vpcName: SecretValue.unsafePlainText("localstack"),
      },
    });

    new iam.ManagedPolicy(this, "ADORestrictionPolicy", {
      managedPolicyName: "ADO-Restriction-Policy",
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["*"],
          resources: ["*"],
        }),
      ],
    });

    new iam.ManagedPolicy(this, "CMSApprovedAWSServicesPolicy", {
      managedPolicyName: "CMSApprovedAWSServices",
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["*"],
          resources: ["*"],
        }),
      ],
    });
  }
}

async function main() {
  const app = new App();

  new LocalPrerequisiteStack(app, `${project}-local-prerequisites`);
}

main();
