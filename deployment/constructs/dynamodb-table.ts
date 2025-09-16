import { Construct } from "constructs";
import { RemovalPolicy, Tags } from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

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

export interface DynamoDBTableIdentifiers {
  /** The invariant identifier for the table. Example: "FormAnswers" */
  id: string;
  /** The name of the table within the environment. Example: "production-form-answers" */
  name: string;
  /** The table's TableArn */
  arn: string;
  /** The table's TableStreamArn (if it has one) */
  streamArn: string | undefined;
}

export class DynamoDBTable extends Construct {
  public readonly table: dynamodb.Table;
  public readonly identifiers: DynamoDBTableIdentifiers;

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

    this.identifiers = {
      id,
      name: tableName,
      arn: this.table.tableArn,
      streamArn: this.table.tableStreamArn,
    };

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
