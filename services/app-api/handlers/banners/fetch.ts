import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
// utils
import { ok } from "../../utils/responses/response-lib";

export const fetchBanner = handler(async () => {
  const scanParams = {
    TableName: process.env.BANNER_TABLE_NAME!,
  };

  const response = await dynamoDb.scanAll(scanParams);

  return ok(response);
});
