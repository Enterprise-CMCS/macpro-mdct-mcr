import { createMeasure } from "../create";

import { APIGatewayProxyEvent } from "aws-lambda";
import { testEvent } from "../../../test-util/testEvents";

jest.mock("../../../libs/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    put: jest.fn(),
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

describe("Test Create Measure Handler", () => {
  test("Test Successful Run of Measure Creation with description", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: `{"data": {}, "description": "sample desc"}`,
      headers: { "cognito-identity-id": "test" },
    };

    const res = await createMeasure(event, null);

    expect(res.statusCode).toBe(200);
    expect(res.body).toContain("sample desc");
    expect(res.body).toContain("FL2020ACSFUA-AD");
  });

  test("Test Successful Run of Measure Creation without description", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: `{"data": {}}`,
      headers: { "cognito-identity-id": "test" },
    };

    const res = await createMeasure(event, null);

    expect(res.statusCode).toBe(200);
    expect(res.body).toContain("test");
    expect(res.body).toContain("FL2020ACSFUA-AD");
  });
});
