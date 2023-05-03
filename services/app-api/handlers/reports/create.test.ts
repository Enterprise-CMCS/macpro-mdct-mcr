import { createReport } from "./create";
import { APIGatewayProxyEvent } from "aws-lambda";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { mockMcparReport } from "../../utils/testing/setupJest";
import { error } from "../../utils/constants/constants";
// types
import { StatusCodes } from "../../utils/types";

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockResolvedValue(true),
  hasPermissions: jest.fn().mockReturnValueOnce(false).mockReturnValue(true),
}));

jest.mock("../../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  flush: jest.fn(),
}));

const mockProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "MCPAR", state: "AB" },
};

const creationEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify(mockMcparReport),
};

const creationEventWithNoFieldData: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({ ...mockMcparReport, fieldData: undefined }),
};

const creationEventWithInvalidData: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({ ...mockMcparReport, fieldData: { number: "NAN" } }),
};

describe("Test createReport API method", () => {
  test("Test unauthorized report creation throws 403 error", async () => {
    const res = await createReport(creationEvent, null);

    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test Successful Run of report creation", async () => {
    const res = await createReport(creationEvent, null);

    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(body.status).toContain("Not started");
    expect(body.fieldDataId).toBeDefined;
    expect(body.fieldDataId).not.toEqual(mockMcparReport.metadata.fieldDataId);
    expect(body.formTemplateId).toBeDefined;
    expect(body.formTemplateId).not.toEqual(
      mockMcparReport.metadata.formTemplateId
    );
    expect(body.fieldData.number).toBe(
      mockMcparReport.fieldData.number.toString()
    );
    expect(body.fieldData.text).toBe(mockMcparReport.fieldData.text);

    expect(body.formTemplate.name).toBe("mock-report");
    expect(body.formTemplate.basePath).toBe("/mock");
    expect(body.formTemplate.routes).toHaveLength(0);
    expect(body.formTemplate.validationJson).toMatchObject({
      text: "text",
      number: "number",
    });
  });

  test("Test attempted report creation with invalid data fails", async () => {
    const res = await createReport(creationEventWithInvalidData, null);
    expect(res.statusCode).toBe(StatusCodes.SERVER_ERROR);
    expect(res.body).toContain(error.INVALID_DATA);
  });

  test("Test attempted report creation without field data throws 400 error", async () => {
    const res = await createReport(creationEventWithNoFieldData, null);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toContain(error.MISSING_DATA);
  });

  test("Test reportKey not provided throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...creationEvent,
      pathParameters: {},
    };
    const res = await createReport(noKeyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKey empty throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...creationEvent,
      pathParameters: { state: "" },
    };
    const res = await createReport(noKeyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toContain(error.NO_KEY);
  });
});
