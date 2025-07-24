import { Construct } from "constructs";
import {
  aws_iam as iam,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambda_nodejs,
  aws_logs as logs,
  Duration,
  RemovalPolicy,
} from "aws-cdk-lib";
import { DynamoDBTableIdentifiers } from "../constructs/dynamodb-table";

interface LambdaDynamoEventProps
  extends Partial<lambda_nodejs.NodejsFunctionProps> {
  additionalPolicies?: iam.PolicyStatement[];
  stackName: string;
  tables: DynamoDBTableIdentifiers[];
  isDev: boolean;
}

export class LambdaDynamoEventSource extends Construct {
  public readonly lambda: lambda_nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaDynamoEventProps) {
    super(scope, id);

    const {
      additionalPolicies = [],
      environment = {},
      handler,
      memorySize = 1024,
      tables,
      stackName,
      timeout = Duration.seconds(6),
      isDev,
      ...restProps
    } = props;

    const role = new iam.Role(this, `${id}LambdaExecutionRole`, {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaVPCAccessExecutionRole"
        ),
      ],
      inlinePolicies: {
        LambdaPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
              ],
              resources: ["arn:aws:logs:*:*:*"],
            }),
            ...additionalPolicies,
          ],
        }),
      },
    });

    this.lambda = new lambda_nodejs.NodejsFunction(this, id, {
      functionName: `${stackName}-${id}`,
      handler,
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout,
      memorySize,
      role,
      bundling: {
        minify: true,
        sourceMap: true,
      },
      environment,
      ...restProps,
    });

    new logs.LogGroup(this, `${id}LogGroup`, {
      logGroupName: `/aws/lambda/${this.lambda.functionName}`,
      removalPolicy: isDev ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
      retention: logs.RetentionDays.THREE_YEARS, // exceeds the 30 month requirement
    });

    for (let table of tables) {
      new lambda.CfnEventSourceMapping(
        scope,
        `${id}${table.id}DynamoDBStreamEventSourceMapping`,
        {
          eventSourceArn: table.streamArn,
          functionName: this.lambda.functionArn,
          startingPosition: "TRIM_HORIZON",
          maximumRetryAttempts: 2,
          batchSize: 10,
          enabled: true,
        }
      );
    }
  }
}
