import { Credentials, DynamoDB } from "aws-sdk";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";
import {
  DynamoWrite,
  DynamoDelete,
  DynamoUpdate,
  DynamoGet,
  DynamoScan,
} from "../../types";

export function createDbClient() {
  const dynamoConfig: DynamoDB.DocumentClient.DocumentClientOptions &
    ServiceConfigurationOptions &
    DynamoDB.ClientApiVersions = {};

  const endpoint = process.env.DYNAMODB_URL;
  if (endpoint) {
    dynamoConfig.endpoint = endpoint;
    dynamoConfig.credentials = new Credentials({
      accessKeyId: "LOCAL_FAKE_KEY", // pragma: allowlist secret
      secretAccessKey: "LOCAL_FAKE_SECRET", // pragma: allowlist secret
      sessionToken: "LOCAL_FAKE_SESSION", // pragma: allowlist secret
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
  put: (params: DynamoWrite) => createDbClient().put(params).promise(),
  update: (params: DynamoUpdate) => createDbClient().update(params).promise(),
  delete: (params: DynamoDelete) => createDbClient().delete(params).promise(),
};
