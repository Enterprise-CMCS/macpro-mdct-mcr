import { Construct } from "constructs";
import {
  aws_apigateway as apigateway,
  // aws_ec2 as ec2,
  aws_iam as iam,
  aws_logs as logs,
  aws_wafv2 as wafv2,
  CfnOutput,
  Duration,
  RemovalPolicy,
} from "aws-cdk-lib";
// import { Lambda } from "../constructs/lambda";
import { WafConstruct } from "../constructs/waf";
import { addIamPropertiesToBucketAutoDeleteRole } from "../utils/s3";
/*
 * import { getSubnets } from "../utils/vpc";
 * import { LambdaDynamoEventSource } from "../constructs/lambda-dynamo-event";
 */
import { DynamoDBTableIdentifiers } from "../constructs/dynamodb-table";
// import { isDefined } from "../utils/misc";
import { isLocalStack } from "../local/util";

interface CreateApiComponentsProps {
  scope: Construct;
  stage: string;
  project: string;
  isDev: boolean;
  userPoolId?: string;
  userPoolClientId?: string;
  vpcName: string;
  kafkaAuthorizedSubnetIds: string;
  tables: DynamoDBTableIdentifiers[];
  brokerString: string;
  iamPermissionsBoundary: iam.IManagedPolicy;
  iamPath: string;
}

export function createApiComponents(props: CreateApiComponentsProps) {
  const {
    scope,
    stage,
    project,
    isDev,
    /*
     * userPoolId,
     * userPoolClientId,
     */
    /*
     * vpcName,
     * kafkaAuthorizedSubnetIds,
     */
    /*
     * tables,
     * brokerString,
     */
    iamPermissionsBoundary,
    iamPath,
  } = props;

  const service = "app-api";

  /*
   * const vpc = ec2.Vpc.fromLookup(scope, "Vpc", { vpcName });
   * const kafkaAuthorizedSubnets = getSubnets(
   *   scope,
   *   kafkaAuthorizedSubnetIds ?? ""
   * );
   */

  /*
   * const kafkaSecurityGroup = new ec2.SecurityGroup(
   *   scope,
   *   "KafkaSecurityGroup",
   *   {
   *     vpc,
   *     description:
   *       "Security Group for streaming functions. Egress all is set by default.",
   *     allowAllOutbound: true,
   *   }
   * );
   */

  const logGroup = new logs.LogGroup(scope, "ApiAccessLogs", {
    removalPolicy: isDev ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
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

  /*
   * const environment = {
   *   BOOTSTRAP_BROKER_STRING_TLS: brokerString,
   *   COGNITO_USER_POOL_ID: userPoolId ?? process.env.COGNITO_USER_POOL_ID!,
   *   COGNITO_USER_POOL_CLIENT_ID:
   *     userPoolClientId ?? process.env.COGNITO_USER_POOL_CLIENT_ID!,
   *   stage,
   *   ...Object.fromEntries(
   *     tables.map((table) => [`${table.id}Table`, table.name])
   *   ),
   * };
   */

  /*
   * const additionalPolicies = [
   *   new iam.PolicyStatement({
   *     effect: iam.Effect.ALLOW,
   *     actions: [
   *       "dynamodb:BatchWriteItem",
   *       "dynamodb:DeleteItem",
   *       "dynamodb:GetItem",
   *       "dynamodb:PutItem",
   *       "dynamodb:Query",
   *       "dynamodb:Scan",
   *       "dynamodb:UpdateItem",
   *     ],
   *     resources: tables.map((table) => table.arn),
   *   }),
   */

  /*
   *   new iam.PolicyStatement({
   *     effect: iam.Effect.ALLOW,
   *     actions: [
   *       "dynamodb:DescribeStream",
   *       "dynamodb:GetRecords",
   *       "dynamodb:GetShardIterator",
   *       "dynamodb:ListShards",
   *       "dynamodb:ListStreams",
   *     ],
   *     resources: tables.map((table) => table.streamArn).filter(isDefined),
   *   }),
   *   new iam.PolicyStatement({
   *     effect: iam.Effect.ALLOW,
   *     actions: ["dynamodb:Query", "dynamodb:Scan"],
   *     resources: tables.map((table) => `${table.arn}/index/*`),
   *   }),
   *   new iam.PolicyStatement({
   *     effect: iam.Effect.ALLOW,
   *     actions: [
   *       "cognito-idp:AdminGetUser",
   *       "ses:SendEmail",
   *       "ses:SendRawEmail",
   *       "lambda:InvokeFunction",
   *     ],
   *     resources: ["*"],
   *   }),
   * ];
   */

  /*
   * const commonProps = {
   *   brokerString,
   *   stackName: `${service}-${stage}`,
   *   api,
   *   environment,
   *   additionalPolicies,
   *   iamPermissionsBoundary,
   *   iamPath,
   * };
   */

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

  addIamPropertiesToBucketAutoDeleteRole(
    scope,
    iamPermissionsBoundary.managedPolicyArn,
    iamPath
  );

  const apiGatewayRestApiUrl = api.url.slice(0, -1);

  new CfnOutput(scope, "ApiUrl", {
    value: apiGatewayRestApiUrl,
  });

  return {
    restApiId: api.restApiId,
    apiGatewayRestApiUrl,
  };
}
