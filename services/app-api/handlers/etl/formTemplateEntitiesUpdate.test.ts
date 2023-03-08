import {
  getFormTemplateFromS3,
  initialize,
  scanTableForMetadata,
  updateFormTemplate,
  writeFormTemplateToS3,
} from "./formTemplateEntitiesUpdate";
import {
  mockDocumentClient,
  mockDynamoData,
  mockReportJson,
} from "../../utils/testing/setupJest";

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

let mockReportJsonWithId: any = mockReportJson;
mockReportJsonWithId.id = "123423452345435";

let mockReportJsonWithEntities: any = mockReportJsonWithId
mockReportJsonWithEntities.entities = ENTITIES_UPDATE_DATA

describe("Test form template entities update", () => {
  test("Test retrieve metadata from DB", async () => {
    mockDocumentClient.scan.promise.mockReturnValueOnce(mockMetaDataResponse1);
    mockDocumentClient.scan.promise.mockReturnValueOnce(mockMetaDataResponse2);

    initialize();
    let result = await scanTableForMetadata("local-mcpar-reports", true);

    expect(result[1]).toBeTruthy();
    expect(result[0]).toMatchObject(mockMetaDataResponse1.LastEvaluatedKey);

    result = await scanTableForMetadata("local-mcpar-reports", true, result[0]);

    expect(result[1]).toBeFalsy();
  });

  test("Test retrieve form template", async () => {
    mockDocumentClient.get.promise.mockReturnValueOnce(mockReportJson);
    const result = await getFormTemplateFromS3(
      mockMetaDataResponse1.Items[0].formTemplateId,
      mockMetaDataResponse1.Items[0].state
    );

    expect(result).toMatchObject(mockReportJson);
  });

  test("Test update form template", async () => {
    const result = updateFormTemplate(mockReportJson);
    expect(result.entities).toMatchObject(ENTITIES_UPDATE_DATA.entities);
  });

  test("Test write updated form template to S3", async () => {
    try {
      await writeFormTemplateToS3(mockReportJsonWithId);
    } catch (e) {
      expect(e).toBeFalsy();
    }
  });

  test("Test no metadata found", async () => {
    mockDocumentClient.scan.promise.mockReturnValueOnce(null);

    initialize();
    let results = await scanTableForMetadata("local-mcpar-reports", true);

    expect(results[0]).toBeNull();
    expect(results[2]).toBeNull();
  });

  test("Test no matching template", async () => {
    let result = getFormTemplateFromS3("fakeId", "MN");

    await expect(result).rejects.toBe("Invalid Test Key");
  });

  test("Test entities already added", async () => {
    const result = updateFormTemplate(mockReportJsonWithEntities);
    expect(result).toMatchObject(mockReportJsonWithEntities);
  });
});
