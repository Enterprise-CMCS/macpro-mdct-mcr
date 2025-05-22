import { Construct } from "constructs";
import { Stack, StackProps } from "aws-cdk-lib";
import { DeploymentConfigProperties } from "../../deployment-config";

export class EmptyParentStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps & DeploymentConfigProperties
  ) {
    super(scope, id, props);
  }
}
