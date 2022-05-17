import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";
import { createCompoundKey } from "../dynamoUtils/createCompoundKey";
import { getUserNameFromJwt } from "../../libs/authorization";

export const editBanner = handler(async (event, _context) => {
  const { data } = JSON.parse(event!.body!);

  const dynamoKey = createCompoundKey(event);
  const lastAlteredBy = getUserNameFromJwt(event);

  const params = {
    TableName: process.env.bannerTableName!,
    Key: {
      compoundKey: dynamoKey,
    },
    ...convertToDynamoExpression(
      {
        lastAltered: Date.now(),
        lastAlteredBy,
        data,
      },
      "post"
    ),
  };
  await dynamoDb.update(params);

  return params;
});
