import { getForm, getLatestForm } from "./get";
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
          formName: "TEST",
          formId: "TEST_test-1-22",
          formJson: {},
        },
      ],
    }),
    scan: jest.fn().mockReturnValue({
      Items: [
        {
          createdAt: 1654198665696,
          formName: "TEST",
          formId: "TEST_test-1-22",
          formJson: {},
        },
        {
          createdAt: 1654198665697,
          formName: "TEST",
          formId: "TEST_test-2-22",
          formJson: {},
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
  pathParameters: { formName: "TEST", formId: "TEST_test-1-22" },
};

const testEventLatest: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { formName: "TEST" },
};

describe("Test getForm API method", () => {
  beforeEach(() => {
    process.env["FORM_TABLE_NAME"] = "fakeFormTable";
  });

  test("Test Successful Form Fetch", async () => {
    const res = await getForm(testEvent, null);

    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.formName).toContain("TEST");
    expect(body.formId).toContain("TEST_test-1-22");
    expect(body.formJson).toEqual({});
  });

  test("Test formName and formId not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await getForm(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });

  test("Test formName and formId empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { formName: "", formId: "" },
    };
    const res = await getForm(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });
});

describe("Test getFormsByState API method", () => {
  beforeEach(() => {
    process.env["FORM_TABLE_NAME"] = "fakeFormTable";
  });

  test("Test Successful latest form Fetch", async () => {
    const res = await getLatestForm(testEventLatest, null);

    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.createdAt).toBeCloseTo(1654198665697);
    expect(body.formName).toContain("TEST");
    expect(body.formId).toContain("TEST_test-2-22");
    expect(body.formJson).toEqual({});
  });
});
