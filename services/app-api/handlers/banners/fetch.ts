import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
// utils
import { ok } from "../../utils/responses/response-lib";

export const fetchBanner = handler(async () => {
  const scanParams = {
    TableName: process.env.BannerTable!,
  };

  const response = await dynamoDb.scanAll(scanParams);

  return ok(response);
});
