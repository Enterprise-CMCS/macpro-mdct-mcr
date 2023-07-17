import {
  compileValidationJsonFromRoutes,
  copyAdminDisabledStatusToForms,
  flattenReportRoutesArray,
  getOrCreateFormTemplate,
  getValidationFromFormTemplate,
} from "./formTemplates";
import mlr from "../../forms/mlr.json";
import mcpar from "../../forms/mcpar.json";
import { createHash } from "crypto";
import { ModalOverlayReportPageShape, ReportJson, ReportType } from "../types";
import { mockDocumentClient, mockReportJson } from "../testing/setupJest";
import s3Lib from "../s3/s3-lib";
import dynamodbLib from "../dynamo/dynamodb-lib";

const currentMLRFormHash = createHash("md5")
  .update(JSON.stringify(copyAdminDisabledStatusToForms(mlr as ReportJson)))
  .digest("hex");

const currentMCPARFormHash = createHash("md5")
  .update(JSON.stringify(copyAdminDisabledStatusToForms(mcpar as ReportJson)))
  .digest("hex");

describe("Test getOrCreateFormTemplate MCPAR", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it("should create a new form template if none exist", async () => {
    mockDocumentClient.query.promise.mockReturnValueOnce({
      Items: [],
    });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-mcpar-reports",
      ReportType.MCPAR
    );
    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(s3PutSpy).toHaveBeenCalled();
    expect(result.formTemplate).toEqual({
      ...mcpar,
      validationJson: getValidationFromFormTemplate(mcpar as ReportJson),
    });
    expect(result.formTemplateVersion?.versionNumber).toEqual(1);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentMCPARFormHash);
  });

  it("should return the right form and formTemplateVersion if it matches the most recent form", async () => {
    mockDocumentClient.query.promise.mockReturnValueOnce({
      Items: [
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentMCPARFormHash,
          versionNumber: 3,
        },
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentMCPARFormHash + "111",
          versionNumber: 2,
        },
      ],
    });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-mcpar-reports",
      ReportType.MCPAR
    );
    expect(dynamoPutSpy).not.toHaveBeenCalled();
    expect(s3PutSpy).not.toHaveBeenCalled();
    expect(result.formTemplateVersion?.versionNumber).toEqual(3);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentMCPARFormHash);
  });

  it("should create a new form if it doesn't match the most recent form", async () => {
    mockDocumentClient.query.promise.mockReturnValueOnce({
      Items: [
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentMCPARFormHash + "111111",
          versionNumber: 3,
        },
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentMCPARFormHash + "111",
          versionNumber: 2,
        },
      ],
    });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-mcpar-reports",
      ReportType.MCPAR
    );
    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(s3PutSpy).toHaveBeenCalled();
    expect(result.formTemplateVersion?.versionNumber).toEqual(4);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentMCPARFormHash);
  });
});
describe("Test getOrCreateFormTemplate MLR", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it("should create a new form template if none exist", async () => {
    mockDocumentClient.query.promise.mockReturnValueOnce({
      Items: [],
    });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-mlr-reports",
      ReportType.MLR
    );
    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(s3PutSpy).toHaveBeenCalled();
    expect(result.formTemplate).toEqual({
      ...mlr,
      validationJson: getValidationFromFormTemplate(mlr as ReportJson),
    });
    expect(result.formTemplateVersion?.versionNumber).toEqual(1);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentMLRFormHash);
  });

  it("should return the right form and formTemplateVersion if it matches the most recent form", async () => {
    mockDocumentClient.query.promise.mockReturnValueOnce({
      Items: [
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentMLRFormHash,
          versionNumber: 3,
        },
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentMLRFormHash + "111",
          versionNumber: 2,
        },
      ],
    });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-mlr-reports",
      ReportType.MLR
    );
    expect(dynamoPutSpy).not.toHaveBeenCalled();
    expect(s3PutSpy).not.toHaveBeenCalled();
    expect(result.formTemplateVersion?.versionNumber).toEqual(3);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentMLRFormHash);
  });

  it("should create a new form if it doesn't match the most recent form", async () => {
    mockDocumentClient.query.promise.mockReturnValueOnce({
      Items: [
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentMLRFormHash + "111111",
          versionNumber: 3,
        },
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentMLRFormHash + "111",
          versionNumber: 2,
        },
      ],
    });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-mlr-reports",
      ReportType.MLR
    );
    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(s3PutSpy).toHaveBeenCalled();
    expect(result.formTemplateVersion?.versionNumber).toEqual(4);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentMLRFormHash);
  });
});

describe("Test copyAdminDisabledStatusToForms", () => {
  it("Copies disabled status to nested forms of any kind", () => {
    const mockAdminDisabledReportJson = {
      ...mockReportJson,
      adminDisabled: true,
    };
    const result = copyAdminDisabledStatusToForms(mockAdminDisabledReportJson);

    const testStandardPageForm = result.routes[0].form;
    const testDrawerPageForm = result.routes[1].children![0].drawerForm!;
    const testModalDrawerPageModalForm =
      result.routes[1].children![1].modalForm!;
    const testModalDrawerPageDrawerForm =
      result.routes[1].children![1].drawerForm!;
    const testModalOverlayPageForm = (
      result.routes[2] as ModalOverlayReportPageShape
    ).overlayForm!;

    expect(testStandardPageForm!.adminDisabled).toBeTruthy();
    expect(testDrawerPageForm!.adminDisabled).toBeTruthy();
    expect(testModalDrawerPageModalForm!.adminDisabled).toBeTruthy();
    expect(testModalDrawerPageDrawerForm!.adminDisabled).toBeTruthy();
    expect(testModalOverlayPageForm!.adminDisabled).toBeTruthy();
  });
});

describe("Test compileValidationJsonFromRoutes", () => {
  it("Compiles validation from forms of any kind", () => {
    const result = compileValidationJsonFromRoutes(
      flattenReportRoutesArray(mockReportJson.routes)
    );
    expect(result).toEqual({
      accessMeasures: "objectArray",
      program: "objectArray",
      "mock-text-field": "text",
      "mock-drawer-text-field": "text",
      "mock-modal-text-field": "text",
      "mock-modal-overlay-text-field": "text",
      "mock-optional-text-field": "textOptional",
      "with-label": "text",
      "mock-nested-field": "radio",
    });
  });
});
