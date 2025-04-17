#!/usr/bin/env node
import "source-map-support/register";
import {
  App,
  SecretValue,
  Stack,
  StackProps,
  aws_ec2 as ec2,
  aws_secretsmanager as secretsmanager,
} from "aws-cdk-lib";
import { Construct } from "constructs";

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
      secretName: "mcr-default", // pragma: allowlist-secret
      secretObjectValue: {
        vpcName: SecretValue.unsafePlainText("localstack"),
        brokerString: SecretValue.unsafePlainText("localstack"),
        kafkaAuthorizedSubnetIds: SecretValue.unsafePlainText(subnet1.subnetId),
      },
    });
  }
}

async function main() {
  const app = new App();

  new LocalPrerequisiteStack(app, "mcr-local-prerequisites");
}

main();
