import { addRevisionsHandler } from "./addRevisionsToMcpar";
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

describe("addRevisionsHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should add previousRevisions to reports without them", async () => {
    (dynamodbLib.scanIterator as jest.Mock).mockReturnValue([
      {
        reportId: "mock-id-1",
        status: ReportStatus.SUBMITTED,
      },
      {
        reportId: "mock-id-2",
        status: ReportStatus.IN_PROGRESS,
      },
      {
        reportId: "mock-id-3",
        status: ReportStatus.NOT_STARTED,
        previousRevisions: [],
        submissionCount: 0,
        locked: false,
      },
    ]);

    const result = await addRevisionsHandler();

    expect(result.statusCode).toBe(200);
    const mockedPut = dynamodbLib.put as jest.Mock;
    expect(mockedPut).toBeCalledTimes(2);
    expect(mockedPut.mock.calls[0][0]).toEqual({
      TableName: "local-mcpar-reports",
      Item: {
        reportId: "mock-id-1",
        status: ReportStatus.SUBMITTED,
        previousRevisions: [],
        submissionCount: 1,
        locked: true,
      },
    });
    expect(mockedPut.mock.calls[1][0]).toEqual({
      TableName: "local-mcpar-reports",
      Item: {
        reportId: "mock-id-2",
        status: ReportStatus.IN_PROGRESS,
        previousRevisions: [],
        submissionCount: 0,
        locked: false,
      },
    });
  });

  test("should return 500 if dynamo errors", async () => {
    jest.spyOn(console, "error").mockImplementationOnce(() => undefined);

    (dynamodbLib.scanIterator as jest.Mock).mockImplementationOnce(() => {
      throw new Error("no DB for you");
    });

    const result = await addRevisionsHandler();

    expect(result.statusCode).toBe(500);
  });
});
