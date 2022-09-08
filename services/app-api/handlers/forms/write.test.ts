import { writeForm } from "./write";
import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import {
  MISSING_DATA_ERROR_MESSAGE,
  NO_KEY_ERROR_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../../utils/constants/constants";

jest.mock("../../utils/dynamo/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    put: jest.fn(),
  },
}));

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
  hasPermissions: jest.fn().mockReturnValueOnce(false).mockReturnValue(true),
}));

jest.mock("../../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  flush: jest.fn(),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"formId":"testFormId","formTemplate":{"info":"test","forms":"etc"}}`,
  headers: { "cognito-identity-id": "test" },
};

describe("Test writeForm API method", () => {
  beforeEach(() => {
    process.env["FORM_TABLE_NAME"] = "fakeFormTemplateTable";
  });

  test("Test unauthorized form creation throws 403 error", async () => {
    const res = await writeForm(testEvent, null);

    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(UNAUTHORIZED_MESSAGE);
  });

  test("Test Successful Run of form Creation", async () => {
    const res = await writeForm(testEvent, null);

    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(res.body).toContain("testFormId");
    expect(res.body).toContain("etc");
  });

  test("Test formId not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      body: `{"formTemplate":{"info":"test","forms":"etc"}}`,
    };
    const res = await writeForm(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });

  test("Test formTemplate not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      body: `{"formId":"testFormId"}`,
    };
    const res = await writeForm(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(MISSING_DATA_ERROR_MESSAGE);
  });
});
