import { Construct } from "constructs";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  Effect,
  ManagedPolicy,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { isLocalStack } from "../local/util";

interface LambdaProps extends Partial<NodejsFunctionProps> {
  handler: string;
  timeout?: Duration;
  memorySize?: number;
  path?: string;
  method?: string;
  stackName: string;
  api?: apigateway.RestApi;
  additionalPolicies?: PolicyStatement[];
  requestParameters?: string[];
  requestValidator?: apigateway.IRequestValidator;
  isDev: boolean;
}

export class Lambda extends Construct {
  public readonly lambda: NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id);

    const {
      handler,
      timeout = Duration.seconds(6),
      memorySize = 1024,
      environment = {},
      api,
      path,
      method,
      additionalPolicies = [],
      stackName,
      requestParameters,
      requestValidator,
      isDev,
      ...restProps
    } = props;

    const role = new Role(this, `${id}LambdaExecutionRole`, {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaVPCAccessExecutionRole"
        ),
      ],
      inlinePolicies: {
        LambdaPolicy: new PolicyDocument({
          statements: [
            new PolicyStatement({
              effect: Effect.ALLOW,
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

    this.lambda = new NodejsFunction(this, id, {
      functionName: `${stackName}-${id}`,
      handler,
      runtime: Runtime.NODEJS_20_X,
      timeout,
      memorySize,
      role,
      bundling: {
        minify: true,
        sourceMap: true,
        nodeModules: ["jsdom"],
      },
      environment,
      ...restProps,
    });

    new LogGroup(this, `${id}LogGroup`, {
      logGroupName: `/aws/lambda/${this.lambda.functionName}`,
      removalPolicy: isDev ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
      retention: RetentionDays.THREE_YEARS, // exceeds the 30 month requirement
    });

    if (api && path && method) {
      const resource = api.root.resourceForPath(path);
      resource.addMethod(
        method,
        new apigateway.LambdaIntegration(this.lambda),
        {
          authorizationType: isLocalStack
            ? undefined
            : apigateway.AuthorizationType.IAM,
          requestParameters: requestParameters
            ? Object.fromEntries(
                requestParameters.map((item) => [
                  `method.request.path.${item}`,
                  true,
                ])
              )
            : {},
          requestValidator,
        }
      );
    }
  }
}
