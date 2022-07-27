export const convertToDynamoExpression = (
  listOfVars: { [key: string]: any },
  expressionType: "list" | "post"
) => {
  let expressionAttributeNames: any = {};
  let expressionAttributeValues: any = {};
  let updateExpression = "";
  let filterExpression = "";
  let alphaNumKey = "";
  Object.keys(listOfVars).forEach((key, index) => {
    alphaNumKey = key.replace(/[^a-zA-Z0-9 ]/g, "");

    expressionAttributeNames[`#${alphaNumKey}`] = alphaNumKey;
    expressionAttributeValues[`:${alphaNumKey}`] = listOfVars[key];

    if (expressionType === "list") {
      filterExpression =
        index === 0
          ? `#${alphaNumKey} = :${alphaNumKey}`
          : `${filterExpression} AND #${alphaNumKey} = :${alphaNumKey}`;
    }
    if (expressionType === "post") {
      updateExpression =
        index === 0
          ? `set #${alphaNumKey}=:${alphaNumKey}`
          : `${updateExpression}, #${alphaNumKey}=:${alphaNumKey}`;
    }
  });
  if (expressionType === "post") {
    return {
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    };
  }
  return {
    FilterExpression: filterExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  };
};
