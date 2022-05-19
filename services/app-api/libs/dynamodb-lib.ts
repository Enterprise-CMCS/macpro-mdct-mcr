import { Credentials, DynamoDB } from "aws-sdk";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";
import {
  BannerData,
  DynamoCreate,
  DynamoDelete,
  DynamoUpdate,
  DynamoGet,
  DynamoScan,
} from "../types";

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

const client = createDbClient();

export default {
  get: async <Result = BannerData>(params: DynamoGet) => {
    const result = await client.get(params).promise();
    return { ...result, Item: result?.Item as Result | undefined };
  },
  query: (params: any) => client.query(params).promise(),
  scan: async <Result = BannerData>(params: DynamoScan) => {
    const result = await client.scan(params).promise();
    return { ...result, Items: result?.Items as Result[] | undefined };
  },
  put: (params: DynamoCreate) => client.put(params).promise(),
  update: (params: DynamoUpdate) => client.update(params).promise(),
  delete: (params: DynamoDelete) => client.delete(params).promise(),
};
