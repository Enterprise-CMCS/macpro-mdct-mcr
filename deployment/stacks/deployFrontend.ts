import { Construct } from "constructs";
import {
  aws_iam as iam,
  aws_cloudfront as cloudfront,
  Duration,
  aws_s3 as s3,
  aws_s3_deployment as s3_deployment,
  custom_resources as cr,
} from "aws-cdk-lib";
import path from "path";
import { execSync } from "node:child_process";

interface DeployFrontendProps {
  apiGatewayRestApiUrl: string;
  applicationEndpointUrl: string;
  distribution: cloudfront.Distribution;
  identityPoolId: string;
  launchDarklyClient: string;
  redirectSignout: string;
  scope: Construct;
  stage: string;
  uiBucket: s3.Bucket;
  userPoolClientDomain: string;
  userPoolClientId: string;
  userPoolId: string;
}

export function deployFrontend(props: DeployFrontendProps) {
  const {
    apiGatewayRestApiUrl,
    applicationEndpointUrl,
    distribution,
    identityPoolId,
    launchDarklyClient,
    redirectSignout,
    scope,
    stage,
    uiBucket,
    userPoolClientDomain,
    userPoolClientId,
    userPoolId,
  } = props;

  const reactAppPath = "./services/ui-src/";
  const buildOutputPath = path.join(reactAppPath, "build");
  const fullPath = path.resolve(reactAppPath);

  execSync("yarn run build", {
    cwd: fullPath,
    stdio: "inherit",
  });

  const deploymentRole = new iam.Role(scope, "BucketDeploymentRole", {
    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
  });

  uiBucket.grantReadWrite(deploymentRole);

  const deployWebsite = new s3_deployment.BucketDeployment(
    scope,
    "DeployWebsite",
    {
      sources: [s3_deployment.Source.asset(buildOutputPath)],
      destinationBucket: uiBucket,
      distribution,
      distributionPaths: ["/*"],
      prune: true,
      cacheControl: [
        s3_deployment.CacheControl.setPublic(),
        s3_deployment.CacheControl.maxAge(Duration.days(365)),
        s3_deployment.CacheControl.noCache(),
      ],
      role: deploymentRole,
    }
  );

  const deployTimeConfig = new s3_deployment.DeployTimeSubstitutedFile(
    scope,
    "DeployTimeConfig",
    {
      destinationBucket: uiBucket,
      destinationKey: "env-config.js",
      source: path.join("./deployment/stacks/", "env-config.template.js"),
      substitutions: {
        apiGatewayRestApiUrl,
        applicationEndpointUrl,
        identityPoolId,
        launchDarklyClient,
        redirectSignout,
        stage,
        userPoolClientDomain,
        userPoolClientId,
        userPoolId,
        timestamp: new Date().toISOString(),
      },
    }
  );

  deployTimeConfig.node.addDependency(deployWebsite);
}