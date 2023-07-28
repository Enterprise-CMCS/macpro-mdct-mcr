import { Credentials, DynamoDB } from "aws-sdk";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";
import {
  DynamoWrite,
  DynamoDelete,
  DynamoUpdate,
  DynamoGet,
  DynamoScan,
} from "../types/other";

export function createDbClient() {
  const dynamoConfig: DynamoDB.DocumentClient.DocumentClientOptions &
    ServiceConfigurationOptions &
    DynamoDB.ClientApiVersions = {};

  const endpoint = process.env.DYNAMODB_URL;
  if (endpoint) {
    dynamoConfig.endpoint = endpoint;
    dynamoConfig.credentials = new Credentials({
      accessKeyId: "LOCALFAKEKEY", // pragma: allowlist secret
      secretAccessKey: "LOCALFAKESECRET", // pragma: allowlist secret
    });
  } else {
    dynamoConfig["region"] = "us-east-1";
  }

  return new DynamoDB.DocumentClient(dynamoConfig);
}

export default {
  get: async <Result>(params: DynamoGet) => {
    const result = await createDbClient().get(params).promise();
    return { ...result, Item: result?.Item as Result | undefined };
  },
  query: (params: any) => createDbClient().query(params).promise(),
  scan: async <Result>(params: DynamoScan) => {
    const result = await createDbClient().scan(params).promise();
    return { ...result, Items: result?.Items as Result[] | undefined };
  },
  /**
   * Scan operation that continues for all results. More expensive but avoids stopping early when a index is not known.
   */
  scanAll: async <Result = any>(params: DynamoScan) => {
    const items = [];
    let complete = false;
    while (!complete) {
      const result = await createDbClient().scan(params).promise();
      items.push(...((result?.Items as Result[]) ?? []));
      params.ExclusiveStartKey = result.LastEvaluatedKey;
      complete = result.LastEvaluatedKey === undefined;
    }
    return { Items: items, Count: items.length };
  },
  put: (params: DynamoWrite) => createDbClient().put(params).promise(),
  update: (params: DynamoUpdate) => createDbClient().update(params).promise(),
  delete: (params: DynamoDelete) => createDbClient().delete(params).promise(),
};
