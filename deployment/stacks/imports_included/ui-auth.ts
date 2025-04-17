import { Construct } from "constructs";
import { aws_cognito as cognito, RemovalPolicy } from "aws-cdk-lib";

interface CreateUiAuthComponentsProps {
  scope: Construct;
  stage: string;
  isDev: boolean;
}

export function createUiAuthComponents(props: CreateUiAuthComponentsProps) {
  const { scope, stage, isDev } = props;

  new cognito.UserPool(scope, "UserPool", {
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
}
