import { fetchReport } from "./fetch";
import { updateReport, calculateCompletionStatus } from "./update";
import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import {
  mockDynamoData,
  mockReport,
  mockReportFieldData,
} from "../../utils/testing/setupJest";
import { error } from "../../utils/constants/constants";

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockResolvedValue(true),
  hasPermissions: jest.fn(() => {}),
}));
const mockAuthUtil = require("../../utils/auth/authorization");

jest.mock("../../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  flush: jest.fn(),
}));

jest.mock("./fetch");
const mockedFetchReport = fetchReport as jest.MockedFunction<
  typeof fetchReport
>;

const mockProxyEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB", id: "testReportId" },
  body: JSON.stringify(mockReport),
};

const updateEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({
    ...mockReport,
    metadata: {
      status: "in progress",
    },
    fieldData: { ...mockReportFieldData, number: 1 },
  }),
};

const submissionEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({
    ...mockReport,
    metadata: {
      status: "submitted",
    },
    submittedBy: mockReport.metadata.lastAlteredBy,
    submittedOnDate: Date.now(),
    fieldData: { ...mockReportFieldData, number: 2 },
  }),
};

const invalidFieldDataSubmissionEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({
    ...mockReport,
    metadata: {
      status: "submitted",
    },
    submittedBy: mockReport.metadata.lastAlteredBy,
    submittedOnDate: Date.now(),
    fieldData: { ...mockReportFieldData, number: "NAN" },
  }),
};

const updateEventWithInvalidData: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: `{"programName":{}}`,
};

describe("Statusing Tests", () => {
  describe("Test updateReport and archiveReport unauthorized calls", () => {
    test("Test unauthorized report update throws 403 error", async () => {
      // fail both state and admin auth checks
      mockAuthUtil.hasPermissions.mockReturnValue(false);
      const res = await updateReport(updateEvent, null);

      expect(res.statusCode).toBe(403);
      expect(res.body).toContain(error.UNAUTHORIZED);
      jest.clearAllMocks();
    });
  });

  describe("Test Completion Status of Report", () => {
    test("Basic Standard Form No Fields", async () => {
      jest.clearAllMocks();

      const testData = {};
      const formTemplate = {
        routes: [
          {
            name: "A: Program Information",
            path: "/mcpar/program-information",
            children: [
              {
                name: "Point of Contact",
                path: "/mcpar/program-information/point-of-contact",
                pageType: "standard",
                form: { fields: [] },
              },
            ],
          },
        ],
      };
      const result = await calculateCompletionStatus(
        testData,
        formTemplate.routes,
        null
      );
      expect(result).toStrictEqual({
        "/mcpar/program-information": {
          "/mcpar/program-information/point-of-contact": false,
        },
      });
    });

    test("Basic Standard Form With Fields", async () => {
      jest.clearAllMocks();

      const testData = {};
      const formTemplate = {
        routes: [
          {
            name: "A: Program Information",
            path: "/mcpar/program-information",
            children: [
              {
                name: "Point of Contact",
                path: "/mcpar/program-information/point-of-contact",
                pageType: "standard",
                form: {
                  fields: [
                    {
                      id: "stateName",
                      type: "text",
                      validation: "text",
                      props: {
                        label: "A.1 State name",
                        hint: "Auto-populated from your account profile.",
                        disabled: true,
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      };
      const result = await calculateCompletionStatus(
        testData,
        formTemplate.routes,
        null
      );
      expect(result).toStrictEqual({
        "/mcpar/program-information": {
          "/mcpar/program-information/point-of-contact": false,
        },
      });
    });
  });

  describe("Fixture Testing", () => {
    const runs = [
      {
        description: "Completed MCPAR Report",
        testData: "mcpar-data-complete",
        expectedResult: "mcpar-status-result-complete",
        formTemplate: "mcpar-template",
      },
      {
        description: "New Incomplete MCPAR Report",
        testData: "mcpar-data-incomplete",
        expectedResult: "mcpar-status-result-incomplete",
        formTemplate: "mcpar-template",
      },
      {
        description: "New MCPAR Report With Incomplete Drawer",
        testData: "mcpar-data-incomplete",
        expectedResult: "mcpar-status-result-incomplete",
        formTemplate: "mcpar-template",
      },
      {
        description: "MCPAR Report With 2 Plans, 1 complete and 1 incomplete",
        testData: "mcpar-data-2plans-incomplete",
        expectedResult: "mcpar-status-result-2plans-incomplete",
        formTemplate: "mcpar-template",
      },
      {
        description: "New Incomplete MCPAR Report", //TODO: This doesn't look right
        testData: "mcpar-data-complete",
        expectedResult: "mcpar-data-partially-complete",
        formTemplate: "mcpar-template",
      },
    ];
    runs.forEach((run) => {
      test(run.description, async () => {
        const testData = require(`../../utils/testing/fixtures/${run.testData}.json`);
        const expectedResult = require(`../../utils/testing/fixtures/${run.expectedResult}.json`);
        const formTemplate = require(`../../utils/testing/fixtures/${run.formTemplate}.json`);
        const result = await calculateCompletionStatus(
          testData,
          formTemplate.routes,
          formTemplate.validationJson
        );
        expect(result).toMatchObject(expectedResult);
      });
    });
    test("Fixture Testbed", async () => {
      //TODO: Delete this when fixtures are done
      const run = {
        description: "MCPAR Report With 2 Plans, 1 complete and 1 incomplete",
        testData: "mcpar-data-2plans-incomplete",
        expectedResult: "mcpar-status-result-2plans-incomplete",
        formTemplate: "mcpar-template",
      };
      const testData = require(`../../utils/testing/fixtures/${run.testData}.json`);
      const expectedResult = require(`../../utils/testing/fixtures/${run.expectedResult}.json`);
      const formTemplate = require(`../../utils/testing/fixtures/${run.formTemplate}.json`);
      const result = await calculateCompletionStatus(
        testData,
        formTemplate.routes,
        formTemplate.validationJson
      );
      expect(result).toMatchObject(expectedResult);
    });
  });
});

describe("Test updateReport API method", () => {
  beforeAll(() => {
    // pass state auth check
    mockAuthUtil.hasPermissions.mockReturnValue(true);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("Test Successful Run of report update", async () => {
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(mockDynamoData),
    });
    const res = await updateReport(updateEvent, null);
    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.status).toContain("in progress");
    expect(body.fieldData.number).toBe("1");
  });

  test("Test report update submission succeeds", async () => {
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(mockDynamoData),
    });
    const response = await updateReport(submissionEvent, null);
    const body = JSON.parse(response.body);
    expect(body.status).toContain("submitted");
    expect(body.fieldData.number).toBe("2");
    expect(response.statusCode).toBe(StatusCodes.SUCCESS);
  });

  test("Test report update with invalid fieldData fails", async () => {
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(mockDynamoData),
    });
    const response = await updateReport(invalidFieldDataSubmissionEvent, null);
    expect(response.statusCode).toBe(StatusCodes.SERVER_ERROR);
    expect(response.body).toContain(error.INVALID_DATA);
  });

  test("Test attempted report update with invalid data throws 400", async () => {
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(mockReport),
    });
    const res = await updateReport(updateEventWithInvalidData, null);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toContain(error.MISSING_DATA);
  });

  test("Test attempted report update with no existing record throws 404", async () => {
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: undefined!,
    });
    const res = await updateReport(updateEventWithInvalidData, null);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test attempted report update to an archived report throws 403 error", async () => {
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ ...mockDynamoData, archived: true }),
    });
    const res = await updateReport(updateEvent, null);

    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test reportKey not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...updateEvent,
      pathParameters: {},
    };
    const res = await updateReport(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKey empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...updateEvent,
      pathParameters: { state: "", id: "" },
    };
    const res = await updateReport(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(error.NO_KEY);
  });
});
