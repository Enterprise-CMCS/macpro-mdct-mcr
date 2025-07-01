import { Construct } from "constructs";
import { aws_dynamodb as dynamodb, aws_s3 as s3 } from "aws-cdk-lib";
import { DynamoDBTable } from "../../constructs/dynamodb-table";

interface CreateDataComponentsProps {
  scope: Construct;
  stage: string;
  isDev: boolean;
}

export function createDataComponents(props: CreateDataComponentsProps) {
  const { scope, stage, isDev } = props;

  new DynamoDBTable(scope, "Banner", {
    stage,
    isDev,
    name: "banners",
    partitionKey: { name: "key", type: dynamodb.AttributeType.STRING },
  });

  new DynamoDBTable(scope, "FormTemplateVersions", {
    stage,
    isDev,
    name: "form-template-versions",
    partitionKey: { name: "reportType", type: dynamodb.AttributeType.STRING },
    sortKey: { name: "versionNumber", type: dynamodb.AttributeType.NUMBER },
    lsi: [
      {
        indexName: "LastAlteredIndex",
        sortKey: { name: "lastAltered", type: dynamodb.AttributeType.STRING },
      },
      {
        indexName: "IdIndex",
        sortKey: { name: "id", type: dynamodb.AttributeType.STRING },
      },
      {
        indexName: "HashIndex",
        sortKey: { name: "md5Hash", type: dynamodb.AttributeType.STRING },
      },
    ],
  });

  new DynamoDBTable(scope, "McparReports", {
    stage,
    isDev,
    name: "mcpar-reports",
    partitionKey: { name: "state", type: dynamodb.AttributeType.STRING },
    sortKey: { name: "id", type: dynamodb.AttributeType.STRING },
  });

  new DynamoDBTable(scope, "MlrReports", {
    stage,
    isDev,
    name: "mlr-reports",
    partitionKey: { name: "state", type: dynamodb.AttributeType.STRING },
    sortKey: { name: "id", type: dynamodb.AttributeType.STRING },
  });

  new DynamoDBTable(scope, "NaaarReports", {
    stage,
    isDev,
    name: "naaar-reports",
    partitionKey: { name: "state", type: dynamodb.AttributeType.STRING },
    sortKey: { name: "id", type: dynamodb.AttributeType.STRING },
  });

  const mcparFormBucket = new s3.Bucket(scope, "McparFormBucket", {
    bucketName: `database-${stage}-mcpar`,
    encryption: s3.BucketEncryption.S3_MANAGED,
    versioned: true,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  });

  const mlrFormBucket = new s3.Bucket(scope, "MlrFormBucket", {
    bucketName: `database-${stage}-mlr`,
    encryption: s3.BucketEncryption.S3_MANAGED,
    versioned: true,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  });

  const naaarFormBucket = new s3.Bucket(scope, "NaaarFormBucket", {
    bucketName: `database-${stage}-naaar`,
    encryption: s3.BucketEncryption.S3_MANAGED,
    versioned: true,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  });
}
