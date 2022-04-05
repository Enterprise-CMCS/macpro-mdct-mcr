import { APIGatewayProxyEvent } from "aws-lambda";

export const createCompoundKey = (event: APIGatewayProxyEvent) => {
  if (!event.pathParameters) throw new Error("No Path Parameters Object");
  console.log(event.pathParameters);
  if (
    !event.pathParameters.state ||
    !event.pathParameters.year ||
    !event.pathParameters.coreSet
  )
    throw new Error("Be sure to include state, year, and coreset in the path" + event.pathParameters);

  const state = event.pathParameters.state;
  const year = event.pathParameters.year;
  const coreSet = event.pathParameters.coreSet;
  const measure = event.pathParameters.measure ?? "";

  return `${state}${year}${coreSet}${measure}`;
};
