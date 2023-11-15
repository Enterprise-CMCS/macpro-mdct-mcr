import { addPccmHandler } from "./addPccmToPastMcpar";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";
import { ReportStatus } from "../../utils/types";

jest.mock("../../utils/constants/constants", () => ({
  ...jest.requireActual("../../utils/constants/constants"),
  reportTables: {
    MCPAR: "local-mcpar-reports",
  },
}));

jest.mock("../../utils/dynamo/dynamodb-lib", () => ({
  scanIterator: jest.fn(),
  put: jest.fn(),
}));

describe("addPccmHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should add pccm as no to reports without them", async () => {
    (dynamodbLib.scanIterator as jest.Mock).mockReturnValue([
      {
        reportId: "mock-id-1",
        status: ReportStatus.SUBMITTED,
        programIsPCCM: [
          {
            value: "Yes",
            key: "programIsPCCM-yes_programIsPCCM",
          },
        ],
      },
      {
        reportId: "mock-id-2",
        status: ReportStatus.IN_PROGRESS,
        programIsPCCM: [
          {
            value: "No",
            key: "programIsPCCM-no_programIsNotPCCM",
          },
        ],
      },
      {
        reportId: "mock-id-3",
        status: ReportStatus.NOT_STARTED,
      },
    ]);

    const result = await addPccmHandler();

    expect(result.statusCode).toBe(200);
    const mockedPut = dynamodbLib.put as jest.Mock;
    expect(mockedPut).toBeCalledTimes(1);
    expect(mockedPut.mock.calls[0][0]).toEqual({
      TableName: "local-mcpar-reports",
      Item: {
        reportId: "mock-id-3",
        status: ReportStatus.NOT_STARTED,
        programIsPCCM: [
          {
            value: "No",
            key: "programIsPCCM-no_programIsNotPCCM",
          },
        ],
      },
    });
  });

  test("should return 500 if dynamo errors", async () => {
    jest.spyOn(console, "error").mockImplementationOnce(() => undefined);

    (dynamodbLib.scanIterator as jest.Mock).mockImplementationOnce(() => {
      throw new Error("no DB for you");
    });

    const result = await addPccmHandler();

    expect(result.statusCode).toBe(500);
  });
});
