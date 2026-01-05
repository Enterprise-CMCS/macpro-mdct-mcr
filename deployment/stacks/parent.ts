import { Construct } from "constructs";
import {
  Aws,
  aws_ec2 as ec2,
  aws_s3 as s3,
  aws_iam as iam,
  CfnOutput,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { DeploymentConfigProperties } from "../deployment-config.js";
import { createDataComponents } from "./data.js";
import { createUiAuthComponents } from "./ui-auth.js";
import { createUiComponents } from "./ui.js";
import { createApiComponents } from "./api.js";
import { deployFrontend } from "./deployFrontend.js";
import { isLocalStack } from "../local/util.js";
import { createTopicsComponents } from "./topics.js";
import { getSubnets } from "../utils/vpc.js";

export class ParentStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps & DeploymentConfigProperties
  ) {
    const {
      isDev,
      secureCloudfrontDomainName,
      vpcName,
      kafkaAuthorizedSubnetIds,
    } = props;

    super(scope, id, {
      ...props,
      terminationProtection: !isDev,
    });

    const commonProps = {
      scope: this,
      ...props,
      isDev,
    };

    const vpc = ec2.Vpc.fromLookup(this, "Vpc", { vpcName });
    const kafkaAuthorizedSubnets = getSubnets(this, kafkaAuthorizedSubnetIds);

    const loggingBucket = s3.Bucket.fromBucketName(
      this,
      "LoggingBucket",
      `cms-cloud-${Aws.ACCOUNT_ID}-${Aws.REGION}`
    );

    const { tables, mcparFormBucket, mlrFormBucket, naaarFormBucket } =
      createDataComponents({
        ...commonProps,
        loggingBucket,
      });

    const { apiGatewayRestApiUrl, restApiId } = createApiComponents({
      ...commonProps,
      tables,
      vpc,
      kafkaAuthorizedSubnets,
      mcparFormBucket,
      mlrFormBucket,
      naaarFormBucket,
    });

    /*
     * For local dev, the LocalStack container will host the database and API.
     * The UI will self-host, so we don't need to tell CDK anything about it.
     * Also, we skip authorization locally. So we don't set up Cognito,
     * or configure the API to interact with it. Therefore, we're done.
     */
    if (isLocalStack) return;

    const { applicationEndpointUrl, distribution, uiBucket } =
      createUiComponents({ ...commonProps, loggingBucket });

    const { userPoolDomainName, identityPoolId, userPoolId, userPoolClientId } =
      createUiAuthComponents({
        ...commonProps,
        applicationEndpointUrl,
        restApiId,
      });

    deployFrontend({
      ...commonProps,
      uiBucket,
      distribution,
      apiGatewayRestApiUrl,
      applicationEndpointUrl:
        secureCloudfrontDomainName ?? applicationEndpointUrl,
      identityPoolId,
      userPoolId,
      userPoolClientId,
      userPoolClientDomain: `${userPoolDomainName}.auth.${Aws.REGION}.amazoncognito.com`,
    });

    new CfnOutput(this, "CloudFrontUrl", {
      value: applicationEndpointUrl,
    });

    createTopicsComponents({
      ...commonProps,
      vpc,
      kafkaAuthorizedSubnets,
    });

    if (isDev) {
      applyDenyCreateLogGroupPolicy(this);
    }
  }
}

function applyDenyCreateLogGroupPolicy(stack: Stack) {
  const denyCreateLogGroupPolicy = {
    PolicyName: "DenyCreateLogGroup",
    PolicyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Deny",
          Action: "logs:CreateLogGroup",
          Resource: "*",
        },
      ],
    },
  };

  const findRole = (id: string) =>
    stack.node.tryFindChild(id)?.node.tryFindChild("Role") as iam.CfnRole;

  findRole(
    "Custom::S3AutoDeleteObjectsCustomResourceProvider"
  )?.addPropertyOverride("Policies", [denyCreateLogGroupPolicy]);

  findRole(
    "AWSCDK.TriggerCustomResourceProviderCustomResourceProvider"
  )?.addPropertyOverride("Policies.1", denyCreateLogGroupPolicy);

  stack.node
    .findAll()
    .filter((c) => c.node.id.startsWith("BucketNotificationsHandler"))
    .forEach((c) => {
      (
        c.node
          .tryFindChild("Role")
          ?.node.tryFindChild("Resource") as iam.CfnRole
      )?.addPropertyOverride("Policies", [denyCreateLogGroupPolicy]);
    });
}
