// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { Construct } from "constructs";
import {
  aws_iam as iam,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambda_nodejs,
  aws_logs as logs,
  aws_s3 as s3,
  Duration,
  RemovalPolicy,
} from "aws-cdk-lib";
import { createHash } from "node:crypto";
import { DynamoDBTable } from "./dynamodb-table.ts";

interface LambdaDynamoEventProps extends Partial<lambda_nodejs.NodejsFunctionProps> {
  additionalPolicies?: iam.PolicyStatement[];
  stackName: string;
  tables: DynamoDBTable[];
  buckets?: s3.IBucket[];
  isDev: boolean;
}

export class LambdaDynamoEventSource extends Construct {
  public readonly lambda: lambda_nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaDynamoEventProps) {
    super(scope, id);

    const {
      additionalPolicies = [],
      memorySize = 1024,
      tables,
      buckets = [],
      stackName,
      timeout = Duration.seconds(6),
      isDev,
      ...restProps
    } = props;

    const logGroup = new logs.LogGroup(this, `${id}LogGroup`, {
      logGroupName: `/aws/lambda/${stackName}-${id}`,
      removalPolicy: isDev ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
      retention: logs.RetentionDays.THREE_YEARS, // exceeds the 30 month requirement
    });

    this.lambda = new lambda_nodejs.NodejsFunction(this, id, {
      functionName: `${stackName}-${id}`,
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout,
      memorySize,
      bundling: {
        assetHash: createHash("sha256")
          .update(`${Date.now()}-${id}`)
          .digest("hex"),
        minify: true,
        sourceMap: true,
        nodeModules: ["kafkajs"],
      },
      logGroup,
      ...restProps,
    });

    for (const ddbTable of tables) {
      new lambda.CfnEventSourceMapping(
        scope,
        `${id}${ddbTable.node.id}DynamoDBStreamEventSourceMapping`,
        {
          eventSourceArn: ddbTable.table.tableStreamArn,
          functionName: this.lambda.functionArn,
          startingPosition: "TRIM_HORIZON",
          maximumRetryAttempts: 2,
          batchSize: 10,
          enabled: true,
        }
      );
    }

    for (const stmt of additionalPolicies) {
      this.lambda.addToRolePolicy(stmt);
    }

    for (const ddbTable of tables) {
      ddbTable.table.grantReadWriteData(this.lambda);
      if (ddbTable.table.tableStreamArn) {
        ddbTable.table.grantStreamRead(this.lambda);
      }
    }

    for (const bucket of buckets) {
      bucket.grantReadWrite(this.lambda);
    }
  }
}
