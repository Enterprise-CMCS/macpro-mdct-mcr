import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  GetCommandInput,
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
  PutCommand,
  PutCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { logger } from "../debugging/debug-lib";

const localConfig = {
  endpoint: process.env.DYNAMODB_URL,
  region: "localhost",
  credentials: {
    accessKeyId: "LOCALFAKEKEY", // pragma: allowlist secret
    secretAccessKey: "LOCALFAKESECRET", // pragma: allowlist secret
  },
  logger,
};

const awsConfig = {
  region: "us-east-1",
  logger,
};

export const getConfig = () => {
  return process.env.DYNAMODB_URL ? localConfig : awsConfig;
};

const client = DynamoDBDocumentClient.from(new DynamoDBClient(getConfig()));

export default {
  get: async (params: GetCommandInput) => {
    return await client.send(new GetCommand(params));
  },
  query: async (params: QueryCommandInput) =>
    await client.send(new QueryCommand(params)),
  put: async (params: PutCommandInput) =>
    await client.send(new PutCommand(params)),
  delete: async (params: DeleteCommandInput) =>
    await client.send(new DeleteCommand(params)),
};
