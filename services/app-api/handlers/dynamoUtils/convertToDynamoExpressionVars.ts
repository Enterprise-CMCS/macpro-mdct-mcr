// const listOfVars = {
//   state: "MO",
//   year: "2021",
// };
type ExpressionType = "list" | "post";

export const convertToDynamoExpression = (
  listOfVars: { [key: string]: any },
  expressionType: ExpressionType
) => {
  let expressionAttributeNames: any = {};
  let expressionAttributeValues: any = {};
  let updateExpression = "";
  let filterExpression = "";
  Object.keys(listOfVars).forEach((key, index) => {
    expressionAttributeNames[`#${key}`] = key;
    expressionAttributeValues[`:${key}`] = listOfVars[key];

    if (expressionType === "list") {
      filterExpression =
        index === 0
          ? `#${key} = :${key}`
          : `${filterExpression} AND #${key} = :${key}`;
    }
    if (expressionType === "post") {
      updateExpression =
        index === 0
          ? `set #${key}=:${key}`
          : `${updateExpression}, #${key}=:${key}`;
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
