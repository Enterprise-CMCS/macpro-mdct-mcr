import { Construct } from "constructs";
import {
  Aws,
  CfnOutput,
  Stack,
  StackProps,
  aws_ec2 as ec2,
  aws_s3 as s3,
} from "aws-cdk-lib";
import { DeploymentConfigProperties } from "../deployment-config";
import { createDataComponents } from "./data";
import { createUiAuthComponents } from "./ui-auth";
import { createUiComponents } from "./ui";
import { createApiComponents } from "./api";
import { deployFrontend } from "./deployFrontend";
import { createCustomResourceRole } from "./customResourceRole";
import { isLocalStack } from "../local/util";
import { getSubnets } from "../utils/vpc";
import { createTopicsComponents } from "./topics";

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

    const customResourceRole = createCustomResourceRole(commonProps);

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

    if (isLocalStack) {
      createApiComponents({
        ...commonProps,
        vpc,
        tables,
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
      return;
    }

    const { applicationEndpointUrl, distribution, uiBucket } =
      createUiComponents({
        ...commonProps,
        loggingBucket,
      });

    const {
      userPoolDomainName,
      identityPoolId,
      userPoolId,
      userPoolClientId,
      createAuthRole,
    } = createUiAuthComponents({
      ...commonProps,
      applicationEndpointUrl,
      customResourceRole,
    });

    const { apiGatewayRestApiUrl, restApiId } = createApiComponents({
      ...commonProps,
      userPoolId,
      userPoolClientId,
      tables,
      vpc,
      kafkaAuthorizedSubnets,
      mcparFormBucket,
      mlrFormBucket,
      naaarFormBucket,
    });

    createAuthRole(restApiId);

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
      customResourceRole,
    });

    new CfnOutput(this, "CloudFrontUrl", {
      value: applicationEndpointUrl,
    });

    createTopicsComponents({
      ...commonProps,
      vpc,
      kafkaAuthorizedSubnets,
      customResourceRole,
    });
  }
}
