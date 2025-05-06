import { Construct } from "constructs";
import {
  aws_ec2 as ec2,
  aws_iam as iam,
  custom_resources as cr,
  CfnOutput,
  Duration,
} from "aws-cdk-lib";
import { Lambda } from "../constructs/lambda";

interface CreateTopicsComponentsProps {
  brokerString: string;
  iamPath: string;
  iamPermissionsBoundary: iam.IManagedPolicy;
  customResourceRole: iam.Role;
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
    iamPath,
    iamPermissionsBoundary,
    isDev,
    kafkaAuthorizedSubnets,
    customResourceRole,
    project,
    scope,
    stage,
    vpc,
  } = props;

  const service = "topics";

  const deleteTopicsEnabled = !isDev;

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
    },
    iamPermissionsBoundary,
    iamPath,
    vpc,
    vpcSubnets: { subnets: kafkaAuthorizedSubnets },
    securityGroups: [lambdaSecurityGroup],
  };

  const createTopicsLambda = new Lambda(scope, "CreateTopics", {
    entry: "services/topics/handlers/createTopics.js",
    handler: "handler",
    timeout: Duration.seconds(60),
    ...commonProps,
    environment: {
      topicNamespace: isDev ? `--${project}--${stage}--` : "",
      ...commonProps.environment,
    },
  });

  if (deleteTopicsEnabled) {
    const deleteTopicsLambda = new Lambda(scope, "DeleteTopics", {
      entry: "services/topics/handlers/deleteTopics.js",
      handler: "handler",
      timeout: Duration.seconds(300),
      ...commonProps,
    });

    deleteTopicsLambda.node.addDependency(createTopicsLambda);

    new CfnOutput(scope, "DeleteTopicsFunctionName", {
      value: deleteTopicsLambda.lambda.functionName,
    });
  }

  const listTopicsLambda = new Lambda(scope, "ListTopics", {
    entry: "services/topics/handlers/listTopics.js",
    handler: "handler",
    timeout: Duration.seconds(300),
    ...commonProps,
  });

  new CfnOutput(scope, "ListTopicsFunctionName", {
    value: listTopicsLambda.lambda.functionName,
  });

  const createTopicsInvoke = new cr.AwsCustomResource(
    scope,
    "InvokeCreateTopicsFunction",
    {
      onCreate: {
        service: "Lambda",
        action: "invoke",
        parameters: {
          FunctionName: createTopicsLambda.lambda.functionName,
          InvocationType: "Event",
          Payload: JSON.stringify({}),
        },
        physicalResourceId: cr.PhysicalResourceId.of(
          `InvokeCreateTopicsFunction-${stage}`
        ),
      },
      onUpdate: {
        service: "Lambda",
        action: "invoke",
        parameters: {
          FunctionName: createTopicsLambda.lambda.functionName,
          InvocationType: "Event",
          Payload: JSON.stringify({}),
        },
        physicalResourceId: cr.PhysicalResourceId.of(
          `InvokeCreateTopicsFunction-${stage}`
        ),
      },
      onDelete: undefined,
      policy: cr.AwsCustomResourcePolicy.fromStatements([
        new iam.PolicyStatement({
          actions: ["lambda:InvokeFunction"],
          resources: [createTopicsLambda.lambda.functionArn],
        }),
      ]),
      role: customResourceRole,
      resourceType: "Custom::InvokeCreateTopicsFunction",
    }
  );

  createTopicsInvoke.node.addDependency(createTopicsLambda);
}
