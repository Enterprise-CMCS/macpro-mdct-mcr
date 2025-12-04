/* eslint-disable multiline-comment-style */
import { Construct } from "constructs";
import {
  aws_certificatemanager as acm,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as cloudfrontOrigins,
  aws_iam as iam,
  aws_s3 as s3,
  Aws,
  // aws_wafv2 as wafv2,
  Duration,
  RemovalPolicy,
} from "aws-cdk-lib";
import { WafConstruct } from "../constructs/waf";
import { isLocalStack } from "../local/util";

interface CreateUiComponentsProps {
  scope: Construct;
  stage: string;
  project: string;
  isDev: boolean;
  cloudfrontCertificateArn?: string;
  cloudfrontDomainName?: string;
  // vpnIpSetArn?: string;
  // vpnIpv6SetArn?: string;
  loggingBucket: s3.IBucket;
}

export function createUiComponents(props: CreateUiComponentsProps) {
  const {
    scope,
    stage,
    project,
    isDev,
    cloudfrontCertificateArn,
    cloudfrontDomainName,
    // vpnIpSetArn,
    // vpnIpv6SetArn,
    loggingBucket,
  } = props;

  const uiBucket = new s3.Bucket(scope, "uiBucket", {
    encryption: s3.BucketEncryption.S3_MANAGED,
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
    enforceSSL: true,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    versioned: true,
    serverAccessLogsBucket: loggingBucket,
    serverAccessLogsPrefix: `AWSLogs/${Aws.ACCOUNT_ID}/s3/`,
  });

  let loggingConfig:
    | { enableLogging: boolean; logBucket: s3.Bucket; logFilePrefix: string }
    | undefined;
  if (!isDev) {
    // this bucket is not created for ephemeral environments because the delete of the bucket often fails because it doesn't decouple from the distribution gracefully
    // should you need to test these parts of the infrastructure out the easiest method is to add your branch's name to the isDev definition in deployment-config.ts
    const logBucket = new s3.Bucket(scope, "CloudfrontLogBucket", {
      bucketName: `ui-${stage}-cloudfront-logs-${Aws.ACCOUNT_ID}`,
      encryption: s3.BucketEncryption.S3_MANAGED,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
      removalPolicy: RemovalPolicy.RETAIN,
      enforceSSL: true,
      versioned: true,
      serverAccessLogsBucket: loggingBucket,
      serverAccessLogsPrefix: `AWSLogs/${Aws.ACCOUNT_ID}/s3/`,
      lifecycleRules: [
        {
          expiration: Duration.days(1095),
          noncurrentVersionExpiration: Duration.days(1095),
        },
      ],
    });

    logBucket.grantPut(new iam.ServicePrincipal("cloudfront.amazonaws.com"));

    loggingConfig = {
      enableLogging: true,
      logBucket,
      logFilePrefix: `AWSLogs/CLOUDFRONT/${stage}/`,
    };
  }

  const securityHeadersPolicy = new cloudfront.ResponseHeadersPolicy(
    scope,
    "CloudFrontHeadersPolicy",
    {
      responseHeadersPolicyName: `Headers-Policy-${stage}`,
      comment: "Add Security Headers",
      securityHeadersBehavior: {
        contentTypeOptions: {
          override: true,
        },
        strictTransportSecurity: {
          accessControlMaxAge: Duration.days(730),
          includeSubdomains: true,
          preload: true,
          override: true,
        },
        frameOptions: {
          frameOption: cloudfront.HeadersFrameOption.DENY,
          override: true,
        },
        contentSecurityPolicy: {
          contentSecurityPolicy: [
            "default-src 'self'",
            "img-src 'self' data: https://www.google-analytics.com",
            "script-src 'self' https://www.google-analytics.com https://ssl.google-analytics.com https://www.googletagmanager.com tags.tiqcdn.com tags.tiqcdn.cn tags-eu.tiqcdn.com https://tealium-tags.cms.gov tealium-tags.cms.gov https://dap.digitalgov.gov dap.digitalgov.gov https://*.adoberesources.net 'unsafe-inline'",
            "style-src 'self' maxcdn.bootstrapcdn.com fonts.googleapis.com 'unsafe-inline'",
            "font-src 'self' maxcdn.bootstrapcdn.com fonts.gstatic.com",
            "connect-src https://*.amazonaws.com/ https://*.amazoncognito.com https://www.google-analytics.com https://*.launchdarkly.us https://adobe-ep.cms.gov https://adobedc.demdex.net https://dap.digitalgov.gov",
            "frame-ancestors 'none'",
            "object-src 'none'",
          ].join("; "),
          override: true,
        },
        xssProtection: {
          protection: false,
          override: true,
        },
      },
    }
  );

  const cachePolicy = new cloudfront.CachePolicy(scope, "CustomCachePolicy", {
    queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
    cookieBehavior: cloudfront.CacheCookieBehavior.none(),
  });

  const distribution = new cloudfront.Distribution(
    scope,
    "CloudFrontDistribution",
    {
      certificate: cloudfrontCertificateArn
        ? acm.Certificate.fromCertificateArn(
            scope,
            "certArn",
            cloudfrontCertificateArn
          )
        : undefined,
      domainNames: cloudfrontDomainName ? [cloudfrontDomainName] : [],
      defaultBehavior: {
        origin:
          cloudfrontOrigins.S3BucketOrigin.withOriginAccessControl(uiBucket),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy,
        compress: true,
        responseHeadersPolicy: securityHeadersPolicy,
      },
      defaultRootObject: "index.html",
      ...loggingConfig,
      httpVersion: cloudfront.HttpVersion.HTTP2,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
    }
  );

  distribution.applyRemovalPolicy(
    isDev ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN
  );

  if (!isLocalStack) {
    const waf = setupWaf(
      scope,
      stage,
      project
      // vpnIpSetArn,
      // vpnIpv6SetArn
    );
    distribution.attachWebAclId(waf.webAcl.attrArn);
  }

  const applicationEndpointUrl = `https://${distribution.distributionDomainName}/`;

  return {
    distribution,
    applicationEndpointUrl,
    uiBucket,
  };
}

function setupWaf(
  scope: Construct,
  stage: string,
  project: string
  //  vpnIpSetArn?: string,
  //  vpnIpv6SetArn?: string
) {
  return new WafConstruct(
    scope,
    "CloudfrontWafConstruct",
    {
      name: `${project}-${stage}-ui`,
    },
    "CLOUDFRONT"
  );
}
