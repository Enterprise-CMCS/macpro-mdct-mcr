import {
  getFormTemplateFromS3,
  initialize,
  scanTableForMetadata,
  updateFormTemplate, writeFormTemplateToS3,
} from "./formTemplateEntitiesUpdate";
import {mockDocumentClient, mockDynamoData, mockReportJson} from "../../utils/testing/setupJest";

const ENTITIES_UPDATE_DATA = {
  entities: {
    sanctions: { required: false },
    accessMeasures: { required: true },
    qualityMeasures: { required: true },
    plans: { required: true },
    bssEntities: { required: true },
  },
};

let mockDynamoDataWithUUID = mockDynamoData;
mockDynamoDataWithUUID.state = "MN";
mockDynamoDataWithUUID.id = "1234123452345";

let mockDynamoData2 = mockDynamoData;
mockDynamoData2.state = "MN";
mockDynamoData2.id = "34234234534";

let mockReportJsonWithId: any = mockReportJson
mockReportJsonWithId.id = "123423452345435"

const mockMetaDataResponse1 = {
  LastEvaluatedKey: {
    id: mockDynamoDataWithUUID.id,
    state: mockDynamoDataWithUUID.state,
  },
  Items: [mockDynamoDataWithUUID],
};

const mockMetaDataResponse2 = {
  Items: [mockDynamoData2],
};

describe("Test ETL script", () => {
  test("Test initialize", async () => {
    initialize();
  });

  test("Test scanTableForMetadata", async () => {
    mockDocumentClient.scan.promise.mockReturnValueOnce(mockMetaDataResponse1);
    mockDocumentClient.scan.promise.mockReturnValueOnce(mockMetaDataResponse2);

    initialize();
    let result = await scanTableForMetadata("local-mcpar-reports", true);

    expect(result[1]).toBeTruthy();
    expect(result[0]).toMatchObject(mockMetaDataResponse1.LastEvaluatedKey);

    result = await scanTableForMetadata("local-mcpar-reports", true, result[0]);

    expect(result[1]).toBeFalsy();
  });

  test("Test getFormTemplateFromS3", async () => {
    mockDocumentClient.get.promise.mockReturnValueOnce(mockReportJson)
    const result = await getFormTemplateFromS3(
      mockMetaDataResponse1.Items[0].formTemplateId,
      mockMetaDataResponse1.Items[0].state,
    );

    expect(result).toMatchObject(mockReportJson)
  });

  test("Test updateFormTemplate", async () => {
    const result = updateFormTemplate(mockReportJson)
    expect(result.entities).toMatchObject(ENTITIES_UPDATE_DATA.entities)
  });

  test("Test writeFormTemplateToS3", async () => {
    const result = await writeFormTemplateToS3(mockReportJsonWithId)
    console.log(result)
  });
});