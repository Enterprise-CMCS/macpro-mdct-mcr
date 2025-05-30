import { Construct } from "constructs";
import {
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as cloudfrontOrigins,
  aws_s3 as s3,
  RemovalPolicy,
  Aws,
} from "aws-cdk-lib";

interface CreateUiComponentsProps {
  scope: Construct;
  stage: string;
}

export function createUiComponents(props: CreateUiComponentsProps) {
  const { scope, stage } = props;

  const logBucket = new s3.Bucket(scope, "CloudfrontLogBucket", {
    bucketName: `ui-${stage}-cloudfront-logs-${Aws.ACCOUNT_ID}`,
    encryption: s3.BucketEncryption.S3_MANAGED,
    publicReadAccess: false,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
    removalPolicy: RemovalPolicy.RETAIN,
    versioned: true,
  });

  const distribution = new cloudfront.Distribution(
    scope,
    "CloudFrontDistribution",
    {
      defaultBehavior: {
        origin: new cloudfrontOrigins.HttpOrigin("www.example.com", {
          originId: "Default",
        }),
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      },
      logBucket,
    }
  );

  distribution.applyRemovalPolicy(RemovalPolicy.RETAIN);
}
