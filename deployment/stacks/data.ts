import { Construct } from "constructs";
import {
  // aws_dynamodb as dynamodb,
  aws_iam as iam,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambda_nodejs,
  custom_resources as cr,
  CfnOutput,
  Duration,
} from "aws-cdk-lib";
// import { DynamoDBTable } from "../constructs/dynamodb-table";
import { IManagedPolicy } from "aws-cdk-lib/aws-iam";

interface CreateDataComponentsProps {
  scope: Construct;
  stage: string;
  isDev: boolean;
  iamPermissionsBoundary: IManagedPolicy;
  iamPath: string;
  customResourceRole: iam.Role;
}

export function createDataComponents(props: CreateDataComponentsProps) {
  const {
    scope,
    stage,
    isDev,
    iamPermissionsBoundary,
    iamPath,
    customResourceRole,
  } = props;

  const tables = [];

  // seed data
  const lambdaApiRole = new iam.Role(scope, "SeedDataLambdaApiRole", {
    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    managedPolicies: [
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AWSLambdaVPCAccessExecutionRole"
      ),
    ],
    inlinePolicies: {
      DynamoPolicy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              "dynamodb:DescribeTable",
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
            ],
            resources: ["*"],
          }),
        ],
      }),
    },
    permissionsBoundary: iamPermissionsBoundary,
    path: iamPath,
  });

  const seedDataFunction = new lambda_nodejs.NodejsFunction(scope, "seedData", {
    entry: "services/database/handlers/seed/seed.js",
    handler: "handler",
    runtime: lambda.Runtime.NODEJS_20_X,
    timeout: Duration.seconds(900),
    role: lambdaApiRole,
    environment: {
      dynamoPrefix: stage,
      seedData: isDev.toString(),
    },
    bundling: {
      commandHooks: {
        beforeBundling(inputDir: string, outputDir: string): string[] {
          return [
            `mkdir -p ${outputDir}/data/initial_data_load/`,
            `cp -r ${inputDir}/services/database/data/initial_data_load/* ${outputDir}/data/initial_data_load/`,
          ];
        },
        afterBundling() {
          return [];
        },
        beforeInstall() {
          return [];
        },
      },
    },
  });

  const seedDataInvoke = new cr.AwsCustomResource(
    scope,
    "InvokeSeedDataFunction",
    {
      onCreate: {
        service: "Lambda",
        action: "invoke",
        parameters: {
          FunctionName: seedDataFunction.functionName,
          InvocationType: "Event",
          Payload: JSON.stringify({}),
        },
        physicalResourceId: cr.PhysicalResourceId.of(
          `InvokeSeedDataFunction-${stage}`
        ),
      },
      onUpdate: undefined,
      onDelete: undefined,
      policy: cr.AwsCustomResourcePolicy.fromStatements([
        new iam.PolicyStatement({
          actions: ["lambda:InvokeFunction"],
          resources: [seedDataFunction.functionArn],
        }),
      ]),
      role: customResourceRole,
      resourceType: "Custom::InvokeSeedDataFunction",
    }
  );

  new CfnOutput(scope, "SeedDataFunctionName", {
    value: seedDataFunction.functionName,
  });

  seedDataInvoke.node.addDependency(seedDataFunction);

  return { tables };
}
