import { getFormTemplate } from "./get";
import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import { NO_KEY_ERROR_MESSAGE } from "../../utils/constants/constants";

jest.mock("../../utils/dynamo/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    query: jest.fn().mockReturnValue({
      Items: [
        {
          createdAt: 1654198665696,
          formTemplateId: "TEST_test-1-22",
          formTemplate: {},
        },
      ],
    }),
  },
}));

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
  hasPermissions: jest.fn().mockReturnValue(true),
}));

jest.mock("../../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  flush: jest.fn(),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { formTemplateId: "TEST_test-1-22" },
};

describe("Test getFormTemplate API method", () => {
  beforeEach(() => {
    process.env["FORM_TEMPLATE_TABLE_NAME"] = "fakeFormTemplateTable";
  });

  test("Test Successful Form Template Fetch", async () => {
    const res = await getFormTemplate(testEvent, null);

    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.formTemplateId).toContain("TEST_test-1-22");
    expect(body.formTemplate).toEqual({});
  });

  test("Test formTemplateId not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await getFormTemplate(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });

  test("Test formTemplateId empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { formTemplateId: "" },
    };
    const res = await getFormTemplate(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });
});
