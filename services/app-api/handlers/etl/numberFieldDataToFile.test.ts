//lambda functions
import {
  extractAllNumericFieldValues,
  extractNumericalData,
  iterateOverNumericFields,
  fieldValueById,
  getDataFromS3,
  writeDataToS3,
  scanTable,
  check,
  S3Route,
  FieldData,
} from "./numberFieldDataToFile";
//aws
import { APIGatewayProxyEvent, Context } from "aws-lambda";
//testing
import {
  mockDocumentClient,
  mockDynamoData,
  mockReportFieldData2,
  mockReportJson2,
} from "../../utils/testing/setupJest";
import { proxyEvent } from "../../utils/testing/proxyEvent";

//mock data
let mockDynamoDataWithUUID = mockDynamoData;
mockDynamoDataWithUUID.state = "AK";
mockDynamoDataWithUUID.id = "1234123452345";

const mockMetaDataResponse1 = {
  LastEvaluatedKey: {
    id: mockDynamoDataWithUUID.id,
    state: mockDynamoDataWithUUID.state,
  },
  Items: [mockDynamoDataWithUUID],
};

let mockDynamoData2 = mockDynamoData;
mockDynamoData2.state = "AK";
mockDynamoData2.id = "34234234534";

const mockMetaDataResponse2 = {
  Items: [mockDynamoData2],
};

let mockReportJsonWithId: any = mockReportJson2;
mockReportJsonWithId.id = "123423452345435";

const mockProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "MCPAR", state: "AB" },
};

const mockEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: "",
};

const mockContext: Context = {
  awsRequestId: "1234567890",
  callbackWaitsForEmptyEventLoop: true,
  clientContext: undefined,
  functionName: "app-api-local-numberFieldDataToFile",
  functionVersion: "$LATEST",
  identity: undefined,
  invokedFunctionArn: "",
  logGroupName: "",
  logStreamName: "",
  memoryLimitInMB: "1024",
  getRemainingTimeInMillis: () => 123,
  done: () => {},
  fail: () => {},
  succeed: () => {},
};

let route: S3Route = {
  state: "MN",
  bucket: "bucket",
  type: "type",
};

describe("Test database scan", () => {
  test("Test retrieval of metadata", async () => {
    mockDocumentClient.scan.promise.mockReturnValueOnce(mockMetaDataResponse1);
    let results = await scanTable("local-mcpar-reports", true);
    expect(results.Items).toHaveLength(1);
  });

  test("Test metadata error", async () => {
    mockDocumentClient.scan.promise.mockRejectedValue(null);
    expect.assertions(1);
    try {
      await scanTable("local-mcpar-reports", true);
    } catch (e) {
      expect(e).toEqual(null);
    }
  });
});

describe("Test s3 bucket put & get", () => {
  test("Test write updated form template to S3", async () => {
    try {
      await writeDataToS3(mockReportJsonWithId, route);
    } catch (e) {
      expect(e).toBeFalsy();
    }
  });

  test("Test get data from S3", async () => {
    mockDocumentClient.get.promise.mockReturnValueOnce(mockReportJson2);
    const result = await getDataFromS3("mockReportJson2", route);

    expect(result).toMatchObject(mockReportJson2);
  });
});

describe("Test extraction of numerical data from field data", () => {
  test("Test iterating and pulling fields", () => {
    let numericFields: any[] = [];
    iterateOverNumericFields(mockReportJson2.routes, numericFields);
    expect(numericFields).toHaveLength(2);
  });

  test("Test find value by id", () => {
    let extractedFieldData: FieldData[] = [];
    fieldValueById(mockReportFieldData2, "report_number", extractedFieldData);
    expect(extractedFieldData).toHaveLength(1);
  });

  test("Test extracting data from formTemplate & fieldData", () => {
    let numericalData = extractNumericalData(
      mockReportJson2,
      mockReportFieldData2
    );
    expect(numericalData).toHaveLength(1);
  });

  test("Test extract and storing of data", async () => {
    mockDocumentClient.scan.promise.mockReturnValueOnce(mockMetaDataResponse2);
    //not sure how to check functions with no returns
    await extractAllNumericFieldValues("local-mcpar-reports", "bucket");
  });

  test("Test lambda", async () => {
    mockDocumentClient.scan.promise.mockReturnValueOnce(mockMetaDataResponse2);
    let results = await check(mockEvent, mockContext);
    expect(results.statusCode).toBe(200);
  });
});
