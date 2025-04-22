import { Construct } from "constructs";
import { Stack, StackProps } from "aws-cdk-lib";
import { DeploymentConfigProperties } from "../../deployment-config";
import { createDataComponents } from "./data";
import { createUiComponents } from "./ui";
import { createUiAuthComponents } from "./ui-auth";

export class ImportsIncludedParentStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps & DeploymentConfigProperties
  ) {
    super(scope, id, props);

    const { stage } = props;

    const isDev = false; // imports are only being done on persistent environments.

    createDataComponents({
      scope: this,
      stage,
      isDev,
    });
    createUiComponents({ scope: this, stage });
    createUiAuthComponents({
      scope: this,
      stage,
    });
  }
}
