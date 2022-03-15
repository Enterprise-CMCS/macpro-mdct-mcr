import { deleteMeasure } from "../delete";

import dbLib from "../../../libs/dynamodb-lib";

import { APIGatewayProxyEvent } from "aws-lambda";
import { testEvent } from "../../../test-util/testEvents";

jest.mock("../../../libs/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    delete: jest.fn(),
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

describe("Test Delete Measure Handler", () => {
  test("Test Successful Run of Measure Deletion", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: `{"data": {}, "description": "sample desc"}`,
      headers: { "cognito-identity-id": "test" },
      pathParameters: { coreSet: "ACS" },
    };
    process.env.measureTableName = "SAMPLE TABLE";

    const res = await deleteMeasure(event, null);

    expect(res.statusCode).toBe(200);
    expect(res.body).toContain("FL2020ACSFUA-AD");
    expect(res.body).toContain('"coreSet":"ACS"');
    expect(dbLib.delete).toHaveBeenCalledWith({
      TableName: "SAMPLE TABLE",
      Key: {
        compoundKey: "FL2020ACSFUA-AD",
        coreSet: "ACS",
      },
    });
  });
});
