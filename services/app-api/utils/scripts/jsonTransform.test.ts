import {initialize, scanTableForMetadata} from "./jsonTransform";
import { mockDocumentClient, mockDynamoData } from "../testing/setupJest";


let mockDynamoDataWithUUID = mockDynamoData
mockDynamoDataWithUUID.state = "MN"
mockDynamoDataWithUUID.id = "1234123452345"

const mockDynamoData2 = mockDynamoData
mockDynamoData2.state = "MN"
mockDynamoData2.id = "34234234534"

const mockMetaDataResponse1 = {
  LastEvaluatedKey: {
    id: mockDynamoDataWithUUID.id,
    state: mockDynamoDataWithUUID.state,
  },
  Items: [
    mockDynamoDataWithUUID,
  ]
}

const mockMetaDataResponse2 = {
  Items: [
    mockDynamoData2,
  ]
}
describe("Test ETL script", () => {
  test("initialize", async () => {
    initialize()
  });

  test("scanTable", async () => {
    mockDocumentClient.scan.promise.mockReturnValueOnce(mockMetaDataResponse1);
    mockDocumentClient.scan.promise.mockReturnValueOnce(mockMetaDataResponse2);

    initialize()
    let result = await scanTableForMetadata("local-mcpar-reports", true)

    expect(result[1]).toBeTruthy();
    expect(result[0]).toMatchObject(mockMetaDataResponse1.LastEvaluatedKey);

    result = await scanTableForMetadata("local-mcpar-reports", true, result[0])

    expect(result[1]).toBeFalsy();

  });

  test("handler", async () => {

    mockDocumentClient.scan.promise.mockReturnValueOnce(mockMetaDataResponse1);
    mockDocumentClient.scan.promise.mockReturnValueOnce(mockMetaDataResponse2);

    initialize()

    let [, , results] = await scanTableForMetadata(
      "local-mcpar-reports",
      true,
    );

  })
});