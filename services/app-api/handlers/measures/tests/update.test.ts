import { editMeasure } from "../update";

import dbLib from "../../../libs/dynamodb-lib";

import { APIGatewayProxyEvent } from "aws-lambda";
import { testEvent } from "../../../test-util/testEvents";
import { convertToDynamoExpression } from "../../dynamoUtils/convertToDynamoExpressionVars";

jest.mock("../../../libs/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    update: jest.fn(),
  },
}));

jest.mock("../../../libs/authorization", () => ({
  __esModule: true,
  isAuthorized: jest.fn().mockReturnValue(true),
  getUserNameFromJwt: jest.fn().mockReturnValue("branchUser"),
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

describe("Test Update Measure Handler", () => {
  test("Test Successful Run of Measure Update with Cognito ID", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: `{"data": {}, "status": "status"}`,
      headers: { "cognito-identity-id": "test" },
      pathParameters: { coreSet: "ACS" },
    };
    process.env.measureTableName = "SAMPLE TABLE";
    Date.now = jest.fn(() => 20);

    const res = await editMeasure(event, null);

    expect(res.statusCode).toBe(200);
    expect(res.body).toContain("FL2020ACSFUA-AD");
    expect(res.body).toContain('"coreSet":"ACS"');
    expect(convertToDynamoExpression).toHaveBeenCalledWith(
      {
        status: "status",
        lastAltered: 20,
        lastAlteredBy: "branchUser",
        reporting: null,
        data: {},
      },
      "post"
    );
    expect(dbLib.update).toHaveBeenCalledWith({
      TableName: "SAMPLE TABLE",
      Key: {
        compoundKey: "FL2020ACSFUA-AD",
        coreSet: "ACS",
      },
      testValue: "test",
    });
  });

  test("Test Successful Run of Measure Update without Cognito ID", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: `{"data": {}, "status": "status"}`,
      pathParameters: { coreSet: "ACS" },
    };
    process.env.measureTableName = "SAMPLE TABLE";
    Date.now = jest.fn(() => 20);

    const res = await editMeasure(event, null);

    expect(res.statusCode).toBe(200);
    expect(res.body).toContain("FL2020ACSFUA-AD");
    expect(res.body).toContain('"coreSet":"ACS"');
    expect(convertToDynamoExpression).toHaveBeenCalledWith(
      {
        status: "status",
        lastAltered: 20,
        lastAlteredBy: "branchUser",
        reporting: null,
        data: {},
      },
      "post"
    );
    expect(dbLib.update).toHaveBeenCalledWith({
      TableName: "SAMPLE TABLE",
      Key: {
        compoundKey: "FL2020ACSFUA-AD",
        coreSet: "ACS",
      },
      testValue: "test",
    });
  });
});
