import { Construct } from "constructs";
/*
 * import { aws_dynamodb as dynamodb } from "aws-cdk-lib";
 * import { DynamoDBTable } from "../../constructs/dynamodb-table";
 */

interface CreateDataComponentsProps {
  scope: Construct;
  stage: string;
  isDev: boolean;
}

export function createDataComponents(_props: CreateDataComponentsProps) {
  // const { scope, stage, isDev } = props;
}
