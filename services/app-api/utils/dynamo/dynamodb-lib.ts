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
  ScanCommandInput,
  paginateScan,
} from "@aws-sdk/lib-dynamodb";
// utils
import { logger } from "../debugging/debug-lib";
// types
import { AnyObject } from "../types";

export const awsConfig = {
  region: "us-east-1",
  logger,
  endpoint: process.env.AWS_ENDPOINT_URL,
};

const client = DynamoDBDocumentClient.from(new DynamoDBClient(awsConfig));

export default {
  get: async (params: GetCommandInput) => {
    return await client.send(new GetCommand(params));
  },
  query: async (params: QueryCommandInput) =>
    await client.send(new QueryCommand(params)),
  queryAll: async (params: Omit<QueryCommandInput, "ExclusiveStartKey">) => {
    let items: AnyObject[] = [];
    let ExclusiveStartKey: Record<string, any> | undefined;

    do {
      const command = new QueryCommand({ ...params, ExclusiveStartKey });
      const result = await client.send(command);
      items = items.concat(result.Items ?? []);
      ExclusiveStartKey = result.LastEvaluatedKey;
    } while (ExclusiveStartKey);

    return items;
  },
  scanAll: async (params: Omit<ScanCommandInput, "ExclusiveStartKey">) => {
    let items: AnyObject[] = [];
    for await (const page of paginateScan({ client }, params)) {
      items = items.concat(page.Items ?? []);
    }

    return items;
  },
  put: async (params: PutCommandInput) =>
    await client.send(new PutCommand(params)),
  delete: async (params: DeleteCommandInput) =>
    await client.send(new DeleteCommand(params)),
};
