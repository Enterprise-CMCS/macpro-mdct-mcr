import { Construct } from "constructs";
import {
  aws_apigateway as apigateway,
  aws_ec2 as ec2,
  aws_iam as iam,
  aws_logs as logs,
  aws_s3 as s3,
  aws_s3_notifications as s3notifications,
  aws_wafv2 as wafv2,
  CfnOutput,
  Duration,
  RemovalPolicy,
} from "aws-cdk-lib";
import { Lambda } from "../constructs/lambda";
import { WafConstruct } from "../constructs/waf";
import { LambdaDynamoEventSource } from "../constructs/lambda-dynamo-event";
import { isDefined } from "../utils/misc";
import { isLocalStack } from "../local/util";
import { DynamoDBTable } from "../constructs/dynamodb-table";

interface CreateApiComponentsProps {
  scope: Construct;
  stage: string;
  project: string;
  isDev: boolean;
  vpc: ec2.IVpc;
  kafkaAuthorizedSubnets: ec2.ISubnet[];
  tables: DynamoDBTable[];
  brokerString: string;
  mcparFormBucket: s3.IBucket;
  mlrFormBucket: s3.IBucket;
  naaarFormBucket: s3.IBucket;
}

export function createApiComponents(props: CreateApiComponentsProps) {
  const {
    scope,
    stage,
    project,
    isDev,
    vpc,
    kafkaAuthorizedSubnets,
    tables,
    brokerString,
    mcparFormBucket,
    mlrFormBucket,
    naaarFormBucket,
  } = props;

  const service = "app-api";

  const kafkaSecurityGroup = new ec2.SecurityGroup(
    scope,
    "KafkaSecurityGroup",
    {
      vpc,
      description:
        "Security Group for streaming functions. Egress all is set by default.",
      allowAllOutbound: true,
    }
  );

  const logGroup = new logs.LogGroup(scope, "ApiAccessLogs", {
    removalPolicy: isDev ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
    retention: logs.RetentionDays.THREE_YEARS, // exceeds the 30 month requirement
  });

  const api = new apigateway.RestApi(scope, "ApiGatewayRestApi", {
    restApiName: `${stage}-app-api`,
    deploy: true,
    cloudWatchRole: false,
    deployOptions: {
      stageName: stage,
      tracingEnabled: true,
      loggingLevel: apigateway.MethodLoggingLevel.INFO,
      dataTraceEnabled: true,
      metricsEnabled: false,
      throttlingBurstLimit: 5000,
      throttlingRateLimit: 10000.0,
      cachingEnabled: false,
      cacheTtl: Duration.seconds(300),
      cacheDataEncrypted: false,
      accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
      accessLogFormat: apigateway.AccessLogFormat.custom(
        "requestId: $context.requestId, ip: $context.identity.sourceIp, " +
          "caller: $context.identity.caller, user: $context.identity.user, " +
          "requestTime: $context.requestTime, httpMethod: $context.httpMethod, " +
          "resourcePath: $context.resourcePath, status: $context.status, " +
          "protocol: $context.protocol, responseLength: $context.responseLength"
      ),
    },
    defaultCorsPreflightOptions: {
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: apigateway.Cors.ALL_METHODS,
    },
  });

  api.addGatewayResponse("Default4XXResponse", {
    type: apigateway.ResponseType.DEFAULT_4XX,
    responseHeaders: {
      "Access-Control-Allow-Origin": "'*'",
      "Access-Control-Allow-Headers": "'*'",
    },
  });

  api.addGatewayResponse("Default5XXResponse", {
    type: apigateway.ResponseType.DEFAULT_5XX,
    responseHeaders: {
      "Access-Control-Allow-Origin": "'*'",
      "Access-Control-Allow-Headers": "'*'",
    },
  });

  const environment = {
    NODE_OPTIONS: "--enable-source-maps",
    BOOTSTRAP_BROKER_STRING_TLS: brokerString,
    STAGE: stage,
    MCPAR_FORM_BUCKET: mcparFormBucket.bucketName,
    MLR_FORM_BUCKET: mlrFormBucket.bucketName,
    NAAAR_FORM_BUCKET: naaarFormBucket.bucketName,
    ...Object.fromEntries(
      tables.map((table) => [`${table.node.id}Table`, table.table.tableName])
    ),
  };

  const commonProps = {
    brokerString,
    stackName: `${service}-${stage}`,
    api,
    environment,
    isDev,
  };

  new Lambda(scope, "fetchBanner", {
    entry: "services/app-api/handlers/banners/fetch.ts",
    handler: "fetchBanner",
    path: "/banners",
    method: "GET",
    ...commonProps,
  }).lambda;

  new Lambda(scope, "createBanner", {
    entry: "services/app-api/handlers/banners/create.ts",
    handler: "createBanner",
    path: "/banners",
    method: "POST",
    ...commonProps,
  }).lambda;

  new Lambda(scope, "deleteBanner", {
    entry: "services/app-api/handlers/banners/delete.ts",
    handler: "deleteBanner",
    path: "/banners/{bannerId}",
    method: "DELETE",
    ...commonProps,
  }).lambda;

  new Lambda(scope, "fetchReport", {
    entry: "services/app-api/handlers/reports/fetch.ts",
    handler: "fetchReport",
    path: "/reports/{reportType}/{state}/{id}",
    method: "GET",
    ...commonProps,
  }).lambda;

  new Lambda(scope, "fetchReportsByState", {
    entry: "services/app-api/handlers/reports/fetch.ts",
    handler: "fetchReportsByState",
    path: "/reports/{reportType}/{state}",
    method: "GET",
    timeout: Duration.seconds(30),
    ...commonProps,
  }).lambda;

  new Lambda(scope, "archiveReport", {
    entry: "services/app-api/handlers/reports/archive.ts",
    handler: "archiveReport",
    path: "/reports/archive/{reportType}/{state}/{id}",
    method: "PUT",
    ...commonProps,
  }).lambda;

  new Lambda(scope, "releaseReport", {
    entry: "services/app-api/handlers/reports/release.ts",
    handler: "releaseReport",
    path: "/reports/release/{reportType}/{state}/{id}",
    method: "PUT",
    ...commonProps,
  }).lambda;

  new Lambda(scope, "createReport", {
    entry: "services/app-api/handlers/reports/create.ts",
    handler: "createReport",
    path: "/reports/{reportType}/{state}",
    method: "POST",
    additionalPolicies: [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["dynamodb:Query"],
        resources: tables
          .filter((table) => ["FormTemplateVersions"].includes(table.node.id))
          .map((table) => `${table.table.tableArn}/index/HashIndex`),
      }),
    ],
    ...commonProps,
  }).lambda;

  new Lambda(scope, "updateReport", {
    entry: "services/app-api/handlers/reports/update.ts",
    handler: "updateReport",
    path: "/reports/{reportType}/{state}/{id}",
    method: "PUT",
    memorySize: 2048,
    timeout: Duration.seconds(30),
    ...commonProps,
  }).lambda;

  new Lambda(scope, "submitReport", {
    entry: "services/app-api/handlers/reports/submit.ts",
    handler: "submitReport",
    path: "/reports/submit/{reportType}/{state}/{id}",
    method: "POST",
    memorySize: 2048,
    timeout: Duration.seconds(30),
    ...commonProps,
  }).lambda;

  new LambdaDynamoEventSource(scope, "postKafkaData", {
    entry: "services/app-api/handlers/kafka/post/postKafkaData.ts",
    handler: "handler",
    timeout: Duration.seconds(120),
    memorySize: 2048,
    retryAttempts: 2,
    vpc,
    vpcSubnets: { subnets: kafkaAuthorizedSubnets },
    securityGroups: [kafkaSecurityGroup],
    ...commonProps,
    environment: {
      topicNamespace: isDev ? `--${project}--${stage}--` : "",
      ...commonProps.environment,
    },
    tables: tables.filter((table) =>
      ["McparReports", "MlrReports", "NaaarReports"].includes(table.node.id)
    ),
    additionalPolicies: [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "dynamodb:BatchWriteItem",
          "dynamodb:DeleteItem",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:UpdateItem",
        ],
        resources: tables.map((table) => table.table.tableArn),
      }),

      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "dynamodb:DescribeStream",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:ListShards",
          "dynamodb:ListStreams",
        ],
        resources: tables
          .map((table) => table.table.tableStreamArn)
          .filter(isDefined),
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["dynamodb:Query", "dynamodb:Scan"],
        resources: tables.map((table) => `${table.table.tableArn}/index/*`),
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "cognito-idp:AdminGetUser",
          "ses:SendEmail",
          "ses:SendRawEmail",
          "lambda:InvokeFunction",
        ],
        resources: ["*"],
      }),
    ],
  });

  const bucketLambdaProps = {
    timeout: Duration.seconds(120),
    memorySize: 2048,
    vpc,
    vpcSubnets: { subnets: kafkaAuthorizedSubnets },
    securityGroups: [kafkaSecurityGroup],
    ...commonProps,
    environment: {
      topicNamespace: isDev ? `--${project}--${stage}--` : "",
      ...commonProps.environment,
    },
    additionalPolicies: [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3:GetObject"],
        resources: [
          `${naaarFormBucket.bucketArn}/*`,
          `${mlrFormBucket.bucketArn}/*`,
          `${mcparFormBucket.bucketArn}/*`,
        ],
      }),
    ],
  };

  const postNaaarBucketDataLambda = new Lambda(scope, "postNaaarBucketData", {
    entry: "services/app-api/handlers/kafka/post/postKafkaData.ts",
    handler: "handler",
    ...bucketLambdaProps,
  }).lambda;

  naaarFormBucket.addEventNotification(
    s3.EventType.OBJECT_CREATED,
    new s3notifications.LambdaDestination(postNaaarBucketDataLambda),
    { suffix: ".json" }
  );

  naaarFormBucket.addEventNotification(
    s3.EventType.OBJECT_TAGGING_PUT,
    new s3notifications.LambdaDestination(postNaaarBucketDataLambda),
    { suffix: ".json" }
  );

  const postMlrBucketDataLambda = new Lambda(scope, "postMlrBucketData", {
    entry: "services/app-api/handlers/kafka/post/postKafkaData.ts",
    handler: "handler",
    ...bucketLambdaProps,
  }).lambda;

  mlrFormBucket.addEventNotification(
    s3.EventType.OBJECT_CREATED,
    new s3notifications.LambdaDestination(postMlrBucketDataLambda),
    { suffix: ".json" }
  );

  mlrFormBucket.addEventNotification(
    s3.EventType.OBJECT_TAGGING_PUT,
    new s3notifications.LambdaDestination(postMlrBucketDataLambda),
    { suffix: ".json" }
  );

  const postMcparBucketDataLambda = new Lambda(scope, "postMcparBucketData", {
    entry: "services/app-api/handlers/kafka/post/postKafkaData.ts",
    handler: "handler",
    ...bucketLambdaProps,
  }).lambda;

  mcparFormBucket.addEventNotification(
    s3.EventType.OBJECT_CREATED,
    new s3notifications.LambdaDestination(postMcparBucketDataLambda),
    { suffix: ".json" }
  );

  mcparFormBucket.addEventNotification(
    s3.EventType.OBJECT_TAGGING_PUT,
    new s3notifications.LambdaDestination(postMcparBucketDataLambda),
    { suffix: ".json" }
  );

  if (!isLocalStack) {
    const waf = new WafConstruct(
      scope,
      "ApiWafConstruct",
      {
        name: `${project}-${stage}-${service}`,
        blockRequestBodyOver8KB: false,
      },
      "REGIONAL"
    );

    new wafv2.CfnWebACLAssociation(scope, "WebACLAssociation", {
      resourceArn: api.deploymentStage.stageArn,
      webAclArn: waf.webAcl.attrArn,
    });
  }

  const apiGatewayRestApiUrl = api.url.slice(0, -1);

  new CfnOutput(scope, "ApiUrl", {
    value: apiGatewayRestApiUrl,
  });

  return {
    restApiId: api.restApiId,
    apiGatewayRestApiUrl,
  };
}
