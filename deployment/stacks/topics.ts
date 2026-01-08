// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { Construct } from "constructs";
import { aws_ec2 as ec2, CfnOutput, Duration, triggers } from "aws-cdk-lib";
import { Lambda } from "../constructs/lambda.ts";

interface CreateTopicsComponentsProps {
  brokerString: string;
  isDev: boolean;
  kafkaAuthorizedSubnets: ec2.ISubnet[];
  project: string;
  scope: Construct;
  stage: string;
  vpc: ec2.IVpc;
}

export function createTopicsComponents(props: CreateTopicsComponentsProps) {
  const {
    brokerString,
    isDev,
    kafkaAuthorizedSubnets,
    project,
    scope,
    stage,
    vpc,
  } = props;

  const service = "topics";

  const deleteTopicsEnabled = isDev;

  const lambdaSecurityGroup = new ec2.SecurityGroup(
    scope,
    "LambdaSecurityGroup",
    {
      vpc,
      description: "Security Group for the topics service lambdas",
      allowAllOutbound: true,
    }
  );

  const commonProps = {
    brokerString,
    stackName: `${service}-${stage}`,
    environment: {
      brokerString,
      project,
      topicNamespace: isDev ? `--${project}--${stage}--` : "",
    },
    vpc,
    vpcSubnets: { subnets: kafkaAuthorizedSubnets },
    securityGroups: [lambdaSecurityGroup],
    isDev,
  };

  const createTopicsLambda = new Lambda(scope, "CreateTopics", {
    entry: "services/topics/handlers/createTopics.js",
    handler: "handler",
    timeout: Duration.seconds(60),
    retryAttempts: 0,
    ...commonProps,
  });

  if (deleteTopicsEnabled) {
    const deleteTopicsLambda = new Lambda(scope, "DeleteTopics", {
      entry: "services/topics/handlers/deleteTopics.js",
      handler: "handler",
      timeout: Duration.minutes(5),
      ...commonProps,
    });

    deleteTopicsLambda.lambda.node.addDependency(createTopicsLambda);

    new CfnOutput(scope, "DeleteTopicsFunctionName", {
      value: deleteTopicsLambda.lambda.functionName,
    });
  }

  const listTopicsLambda = new Lambda(scope, "ListTopics", {
    entry: "services/topics/handlers/listTopics.js",
    handler: "handler",
    timeout: Duration.minutes(5),
    retryAttempts: 0,
    ...commonProps,
  });

  new CfnOutput(scope, "ListTopicsFunctionName", {
    value: listTopicsLambda.lambda.functionName,
  });

  new triggers.Trigger(scope, "InvokeCreateTopicsFunction", {
    handler: createTopicsLambda.lambda,
    invocationType: triggers.InvocationType.EVENT,
  });
}
