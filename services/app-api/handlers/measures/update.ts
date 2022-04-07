import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";
import { createCompoundKey } from "../dynamoUtils/createCompoundKey";
import { getUserNameFromJwt } from "../../libs/authorization";

// eslint-disable-next-line no-unused-vars
export const editMeasure = handler(async (event, context) => {
  const { data, status, reporting = null } = JSON.parse(event!.body!);

  const dynamoKey = createCompoundKey(event);
  const lastAlteredBy = getUserNameFromJwt(event);

  const params = {
    TableName: process.env.measureTableName!,
    Key: {
      compoundKey: dynamoKey,
      coreSet: event!.pathParameters!.coreSet!,
    },
    ...convertToDynamoExpression(
      {
        status,
        reporting,
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
