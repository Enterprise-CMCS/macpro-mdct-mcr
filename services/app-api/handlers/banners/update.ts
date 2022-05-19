import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";
import { getUserNameFromJwt } from "../../libs/authorization";

export const editBanner = handler(async (event, _context) => {
  const { data } = JSON.parse(event!.body!);

  const lastAlteredBy = getUserNameFromJwt(event);

  const params = {
    TableName: process.env.BANNER_TABLE_NAME!,
    Key: {
      key: process.env.BANNER_ID!,
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
