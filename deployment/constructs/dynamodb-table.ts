// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { Construct } from "constructs";
import { RemovalPolicy, Tags, aws_dynamodb as dynamodb } from "aws-cdk-lib";

interface DynamoDBTableProps {
  readonly stage: string;
  readonly isDev: boolean;
  readonly name: string;
  readonly streamable?: boolean;
  readonly partitionKey: { name: string; type: dynamodb.AttributeType };
  readonly sortKey?: { name: string; type: dynamodb.AttributeType };
  readonly lsi?: {
    indexName: string;
    sortKey: { name: string; type: dynamodb.AttributeType };
  }[];
  readonly gsi?: {
    indexName: string;
    partitionKey: { name: string; type: dynamodb.AttributeType };
  };
}

export class DynamoDBTable extends Construct {
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, props: DynamoDBTableProps) {
    super(scope, id);
    const {
      stage,
      isDev,
      name,
      partitionKey,
      sortKey,
      lsi,
      gsi,
      streamable = true,
    } = props;

    const tableName = `${stage}-${name}`;
    this.table = new dynamodb.Table(this, "Table", {
      tableName,
      partitionKey,
      sortKey,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      ...(streamable && { stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES }),
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
      removalPolicy: isDev ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
    });

    Tags.of(this.table).add("AWS_Backup", "d35");

    if (lsi) {
      lsi.forEach((index) => {
        this.table.addLocalSecondaryIndex({
          indexName: index.indexName,
          sortKey: index.sortKey,
          projectionType: dynamodb.ProjectionType.ALL,
        });
      });
    }

    if (gsi) {
      this.table.addGlobalSecondaryIndex({
        indexName: gsi.indexName,
        partitionKey: gsi.partitionKey,
        projectionType: dynamodb.ProjectionType.ALL,
      });
    }
  }
}
