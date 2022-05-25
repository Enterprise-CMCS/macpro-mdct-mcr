import { getMeasure, listMeasures } from "../get";

import dbLib from "../../../utils/dynamo/dynamodb-lib";

import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../../utils/testing/proxyEvent";
import { convertToDynamoExpression } from "../../../utils/dynamo/convertToDynamoExpressionVars";

jest.mock("../../../libs/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockReturnValue("single measure"),
    scan: jest.fn().mockReturnValue(["array", "of", "measures"]),
  },
}));

jest.mock("../../../libs/authorization", () => ({
  __esModule: true,
  isAuthorized: jest.fn().mockReturnValue(true),
}));

jest.mock("../../../libs/debug-lib", () => ({
  __esModule: true,
  init: jest.fn(),
  flush: jest.fn(),
}));

jest.mock("../../dynamoUtils/createCompoundKey", () => ({
  __esModule: true,
  createCompoundKey: jest.fn().mockReturnValue("FL2020ACSFUA-AD"),
}));

jest.mock("../../dynamoUtils/convertToDynamoExpressionVars", () => ({
  __esModule: true,
  convertToDynamoExpression: jest.fn().mockReturnValue({ testValue: "test" }),
}));

describe("Test Get Measure Handlers", () => {
  test("Test Fetching a Measure", async () => {
    const event: APIGatewayProxyEvent = {
      ...proxyEvent,
      body: `{"data": {}, "description": "sample desc"}`,
      headers: { "cognito-identity-id": "test" },
      pathParameters: { coreSet: "ACS" },
    };
    process.env.measureTableName = "SAMPLE TABLE";

    const res = await getMeasure(event, null);

    expect(res.statusCode).toBe(200);
    expect(res.body).toContain("single measure");
    expect(dbLib.get).toHaveBeenCalledWith({
      TableName: "SAMPLE TABLE",
      Key: {
        compoundKey: "FL2020ACSFUA-AD",
        coreSet: "ACS",
      },
    });
  });

  test("Test Successfully Fetching a List of Measures", async () => {
    const event: APIGatewayProxyEvent = {
      ...proxyEvent,
      body: `{"data": {}, "description": "sample desc"}`,
      headers: { "cognito-identity-id": "test" },
      pathParameters: { coreSet: "ACS", state: "FL", year: "2020" },
    };
    process.env.measureTableName = "SAMPLE TABLE";

    const res = await listMeasures(event, null);

    expect(res.statusCode).toBe(200);
    expect(res.body).toContain("array");
    expect(res.body).toContain("of");
    expect(res.body).toContain("measures");
    expect(dbLib.scan).toHaveBeenCalledWith({
      TableName: "SAMPLE TABLE",
      testValue: "test",
    });
  });

  test("Test Fetching a List of Measures with no Path Parameters", async () => {
    const event: APIGatewayProxyEvent = {
      ...proxyEvent,
      body: `{"data": {}, "description": "sample desc"}`,
      headers: { "cognito-identity-id": "test" },
      pathParameters: null,
    };
    process.env.measureTableName = "SAMPLE TABLE";

    const res = await listMeasures(event, null);

    expect(res.statusCode).toBe(200);
    expect(convertToDynamoExpression).toHaveBeenCalledWith(
      { state: undefined, year: NaN, coreSet: undefined },
      "list"
    );
  });
});
