import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { createCompoundKey } from "../dynamoUtils/createCompoundKey";

export const deleteMeasure = handler(async (event, _context) => {
  const dynamoKey = createCompoundKey(event);
  const params = {
    TableName: process.env.measureTableName!,
    Key: {
      compoundKey: dynamoKey,
      coreSet: event!.pathParameters!.coreSet!,
    },
  };

  await dynamoDb.delete(params);

  return params;
});
