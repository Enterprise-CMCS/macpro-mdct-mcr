import { Construct } from "constructs";
import {
  aws_cognito as cognito,
  aws_iam as iam,
  aws_wafv2 as wafv2,
  Aws,
  CfnOutput,
  Duration,
  RemovalPolicy,
  triggers,
} from "aws-cdk-lib";
import { WafConstruct } from "../constructs/waf";
import { isLocalStack } from "../local/util";
import { Lambda } from "../constructs/lambda";

interface CreateUiAuthComponentsProps {
  scope: Construct;
  project: string;
  stage: string;
  isDev: boolean;
  applicationEndpointUrl: string;
  restApiId: string;
  oktaMetadataUrl: string;
  bootstrapUsersPassword?: string;
  secureCloudfrontDomainName?: string;
  userPoolDomainPrefix?: string;
}

export function createUiAuthComponents(props: CreateUiAuthComponentsProps) {
  const {
    scope,
    project,
    stage,
    isDev,
    applicationEndpointUrl,
    restApiId,
    oktaMetadataUrl,
    bootstrapUsersPassword,
    secureCloudfrontDomainName,
    userPoolDomainPrefix,
  } = props;

  const userPool = new cognito.UserPool(scope, "UserPool", {
    userPoolName: `${stage}-user-pool`,
    signInAliases: {
      email: true,
    },
    autoVerify: {
      email: true,
    },
    selfSignUpEnabled: false,
    standardAttributes: {
      givenName: {
        required: true,
        mutable: true,
      },
      familyName: {
        required: true,
        mutable: true,
      },
    },
    customAttributes: {
      cms_roles: new cognito.StringAttribute({ mutable: true }),
      cms_state: new cognito.StringAttribute({
        mutable: true,
        minLen: 0,
        maxLen: 256,
      }),
    },
    // advancedSecurityMode: cognito.AdvancedSecurityMode.ENFORCED, DEPRECATED WE NEED FEATURE_PLAN.plus if we want to use StandardThreatProtectionMode.FULL_FUNCTION which I think is the new way to do this
    removalPolicy: isDev ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
  });

  const providerName = "Okta";

  const oktaIdp = new cognito.CfnUserPoolIdentityProvider(
    scope,
    "CognitoUserPoolIdentityProvider",
    {
      providerName,
      providerType: "SAML",
      userPoolId: userPool.userPoolId,
      providerDetails: {
        MetadataURL: oktaMetadataUrl,
      },
      attributeMapping: {
        email:
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
        family_name:
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
        given_name:
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
        "custom:cms_roles": "cmsRoles",
        "custom:cms_state": "state",
      },
      idpIdentifiers: ["IdpIdentifier"],
    }
  );

  const supportedIdentityProviders = [
    cognito.UserPoolClientIdentityProvider.custom(providerName),
  ];

  const appUrl =
    secureCloudfrontDomainName ??
    applicationEndpointUrl ??
    "http://localhost:3000/";

  const userPoolClient = new cognito.UserPoolClient(scope, "UserPoolClient", {
    userPoolClientName: `${stage}-user-pool-client`,
    userPool,
    authFlows: {
      userPassword: true,
    },
    oAuth: {
      flows: {
        authorizationCodeGrant: true,
      },
      scopes: [
        cognito.OAuthScope.EMAIL,
        cognito.OAuthScope.OPENID,
        cognito.OAuthScope.PROFILE,
      ],
      callbackUrls: [appUrl],
      defaultRedirectUri: appUrl,
      logoutUrls: [appUrl, `${appUrl}postLogout`],
    },
    supportedIdentityProviders,
    generateSecret: false,
    accessTokenValidity: Duration.minutes(30),
    idTokenValidity: Duration.minutes(30),
    refreshTokenValidity: Duration.hours(24),
  });

  userPoolClient.node.addDependency(oktaIdp);

  (
    userPoolClient.node.defaultChild as cognito.CfnUserPoolClient
  ).addPropertyOverride("ExplicitAuthFlows", ["ADMIN_NO_SRP_AUTH"]);

  const userPoolDomain = new cognito.UserPoolDomain(scope, "UserPoolDomain", {
    userPool,
    cognitoDomain: {
      domainPrefix:
        userPoolDomainPrefix ?? `${project}-${stage}-login-user-pool-client`,
    },
  });

  const identityPool = new cognito.CfnIdentityPool(
    scope,
    "CognitoIdentityPool",
    {
      identityPoolName: `${stage}-IdentityPool`,
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: userPool.userPoolProviderName,
        },
      ],
    }
  );

  const cognitoAuthRole = new iam.Role(scope, "CognitoAuthRole", {
    assumedBy: new iam.FederatedPrincipal(
      "cognito-identity.amazonaws.com",
      {
        StringEquals: {
          "cognito-identity.amazonaws.com:aud": identityPool.ref,
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "authenticated",
        },
      },
      "sts:AssumeRoleWithWebIdentity"
    ),
    inlinePolicies: {
      CognitoAuthorizedPolicy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            actions: [
              "mobileanalytics:PutEvents",
              "cognito-sync:*",
              "cognito-identity:*",
            ],
            resources: ["*"],
            effect: iam.Effect.ALLOW,
          }),
          new iam.PolicyStatement({
            actions: ["execute-api:Invoke"],
            resources: [
              `arn:aws:execute-api:${Aws.REGION}:${Aws.ACCOUNT_ID}:${restApiId}/*`,
            ],
            effect: iam.Effect.ALLOW,
          }),
        ],
      }),
    },
  });

  new cognito.CfnIdentityPoolRoleAttachment(scope, "CognitoIdentityPoolRoles", {
    identityPoolId: identityPool.ref,
    roles: { authenticated: cognitoAuthRole.roleArn },
  });

  let bootstrapUsersFunction;

  if (bootstrapUsersPassword) {
    const service = "ui-auth";
    bootstrapUsersFunction = new Lambda(scope, "bootstrapUsers", {
      stackName: `${service}-${stage}`,
      entry: "services/ui-auth/handlers/createUsers.js",
      handler: "handler",
      memorySize: 1024,
      timeout: Duration.seconds(60),
      additionalPolicies: [
        new iam.PolicyStatement({
          actions: ["*"],
          resources: [userPool.userPoolArn],
          effect: iam.Effect.ALLOW,
        }),
      ],
      environment: {
        userPoolId: userPool.userPoolId,
        bootstrapUsersPassword,
      },
      isDev,
    }).lambda;
  }

  if (!isLocalStack) {
    const waf = new WafConstruct(
      scope,
      "CognitoWafConstruct",
      { name: `${project}-${stage}-ui-auth` },
      "REGIONAL"
    );

    new wafv2.CfnWebACLAssociation(scope, "CognitoUserPoolWAFAssociation", {
      resourceArn: userPool.userPoolArn,
      webAclArn: waf.webAcl.attrArn,
    });
  }

  if (bootstrapUsersFunction) {
    new triggers.Trigger(scope, "InvokeBootstrapUsersFunction", {
      handler: bootstrapUsersFunction,
      invocationType: triggers.InvocationType.EVENT,
    });
  }

  new CfnOutput(scope, "CognitoIdentityPoolId", {
    value: identityPool.ref,
  });

  new CfnOutput(scope, "CognitoUserPoolId", {
    value: userPool.userPoolId,
  });

  new CfnOutput(scope, "CognitoUserPoolClientId", {
    value: userPoolClient.userPoolClientId,
  });

  new CfnOutput(scope, "CognitoUserPoolClientDomain", {
    value: userPoolDomain.domainName,
  });

  return {
    userPoolDomainName: userPoolDomain.domainName,
    identityPoolId: identityPool.ref,
    userPoolId: userPool.userPoolId,
    userPoolClientId: userPoolClient.userPoolClientId,
  };
}
