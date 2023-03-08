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

describe("Test Form Template Entities Update", () => {

  test("Test Retrieve Metadata", async () => {
    mockDocumentClient.scan.promise.mockReturnValueOnce(mockMetaDataResponse1);
    mockDocumentClient.scan.promise.mockReturnValueOnce(mockMetaDataResponse2);

    initialize();
    let result = await scanTableForMetadata("local-mcpar-reports", true);

    expect(result[1]).toBeTruthy();
    expect(result[0]).toMatchObject(mockMetaDataResponse1.LastEvaluatedKey);

    result = await scanTableForMetadata("local-mcpar-reports", true, result[0]);

    expect(result[1]).toBeFalsy();
  });

  test("Test Retrieve Form Template", async () => {
    mockDocumentClient.get.promise.mockReturnValueOnce(mockReportJson)
    const result = await getFormTemplateFromS3(
      mockMetaDataResponse1.Items[0].formTemplateId,
      mockMetaDataResponse1.Items[0].state,
    );

    expect(result).toMatchObject(mockReportJson)
  });

  test("Test Update Form Template", async () => {
    const result = updateFormTemplate(mockReportJson)
    expect(result.entities).toMatchObject(ENTITIES_UPDATE_DATA.entities)
  });

  test("Test Write Updated Form Template To S3", async () => {
    try {
      await writeFormTemplateToS3(mockReportJsonWithId)
    }
    catch (e) {
      expect(e).toBeFalsy()
    }
  });

  test("Test No Metadata Found", async () => {
    mockDocumentClient.scan.promise.mockReturnValueOnce(null);

    initialize();
    let results = await scanTableForMetadata("local-mcpar-reports", true);

    expect(results[0]).toBeNull();
    expect(results[2]).toBeNull();
  });

  test("Test No Matching Template", async () => {
    // const result = getFormTemplateFromS3(
    //   "fakeId",
    //   "MN",
    // );

    // expect(result).toThrowError();
    // expect(async () => {
    //   await getFormTemplateFromS3(
    //     "fakeId",
    //     "MN",
    //   );
    // }).toThrowError();


    // expect(() => {
    //   getFormTemplateFromS3(
    //     'fakeId', 'MN'
    //   )
    // }).toThrow();

    await expect( () => {
      getFormTemplateFromS3(
        'fakeId', 'MN'
      );
    }).rejects.toThrow()
  });

  test("Test Entities Already Added", async () => {

  });
});