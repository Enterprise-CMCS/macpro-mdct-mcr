import s3Lib from "../../utils/s3/s3-lib";
import { cleanupNumericData } from "./numberFieldCleanup";
import { ExtractResult } from "./numberFieldValueCategorization";

jest.mock("../../utils/constants/constants", () => ({
  ...jest.requireActual("../../utils/constants/constants"),
  reportBuckets: {
    MCPAR: "database-local-mcpar",
  },
}));

jest.mock("../../utils/s3/s3-lib", () => ({
  ...jest.requireActual("../../utils/s3/s3-lib"),
  get: jest.fn().mockImplementation((params) => {
    switch (params.Key) {
      case "fieldData/CO/data1.json":
        return mockReport;
      default:
        throw new Error(
          `Cannot get object '${params.Key}': it has not been mocked`
        );
    }
  }),
  put: jest.fn(),
}));

const mockReport = {
  q0: "123.4", // good
  q1: "$1000", // fixable
  q3: "N/A", // good
  foos: [
    {
      q5: "i ate 5 eggs", // bad
    },
    {
      q5: "5 :1", // fixable
    },
    {
      q5: "5%", // fixable
    },
    {
      q5: " 5 ", // fixable
    },
    {
      q5: "5,555", // fixable
    },
    {
      q5: ".5", // fixable
    },
    {
      q5: "", // good
    },
    {
      q5: "5,0000", // bad
    },
  ],
};

const mockExtractResult = [
  {
    report: {
      id: "report1",
      reportType: "MCPAR",
      state: "CO",
      formTemplateId: "template1",
      fieldDataId: "data1",
    },
    fields: [
      {
        fieldId: "q1",
        index: 0,
        value: "$1000",
        level: "fixable",
      },
      {
        fieldId: "q5",
        entityType: "foos",
        index: 0,
        value: "i ate 5 eggs",
        level: "bad",
      },
      {
        fieldId: "q5",
        entityType: "foos",
        index: 1,
        value: "5 :1",
        level: "fixable",
      },
      {
        fieldId: "q5",
        entityType: "foos",
        index: 2,
        value: "5%",
        level: "fixable",
      },
      {
        fieldId: "q5",
        entityType: "foos",
        index: 3,
        value: " 5 ",
        level: "fixable",
      },
      {
        fieldId: "q5",
        entityType: "foos",
        index: 4,
        value: "5,555",
        level: "fixable",
      },
      {
        fieldId: "q5",
        entityType: "foos",
        index: 5,
        value: ".5",
        level: "fixable",
      },
      {
        fieldId: "q5",
        entityType: "foos",
        index: 7,
        value: "5,0000",
        level: "bad",
      },
    ],
  },
] as ExtractResult[];

describe("Numeric data cleanup", () => {
  const s3GetSpy = jest.spyOn(s3Lib, "get");
  const s3PutSpy = jest.spyOn(s3Lib, "put");
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should clean up all data flagged by the export", async () => {
    await cleanupNumericData(mockExtractResult);

    expect(s3PutSpy).toBeCalledTimes(1);

    expect(s3PutSpy.mock.calls[0][0].Key).toBe("fieldData/CO/data1.json");

    const cleanedReportData = JSON.parse(s3PutSpy.mock.calls[0][0].Body);
    expect(cleanedReportData.q1).toBe("1000");
    expect(cleanedReportData.foos[0].q5).toBe("i ate 5 eggs"); // not fixable
    expect(cleanedReportData.foos[1].q5).toBe("5:1");
    expect(cleanedReportData.foos[2].q5).toBe("5");
    expect(cleanedReportData.foos[3].q5).toBe("5");
    expect(cleanedReportData.foos[4].q5).toBe("5555");
    expect(cleanedReportData.foos[5].q5).toBe("0.5");
  });

  it("should not get or put reports with no fixable issues", async () => {
    await cleanupNumericData([]);

    expect(s3GetSpy).not.toBeCalled();
    expect(s3PutSpy).not.toBeCalled();
  });
});
