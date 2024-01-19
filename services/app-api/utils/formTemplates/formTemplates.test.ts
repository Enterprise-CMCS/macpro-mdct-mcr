import {
  compileValidationJsonFromRoutes,
  flattenReportRoutesArray,
  formTemplateForReportType,
  generatePCCMTemplate,
  getOrCreateFormTemplate,
  getValidationFromFormTemplate,
  isFieldElement,
  isLayoutElement,
} from "./formTemplates";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import s3Lib from "../s3/s3-lib";
import dynamodbLib from "../dynamo/dynamodb-lib";
// forms
import mlr from "../../forms/mlr.json";
import mcpar from "../../forms/mcpar.json";
// utils
import { mockReportJson } from "../testing/setupJest";
// types
import { FormJson, ReportJson, ReportRoute, ReportType } from "../types";
import { createHash } from "crypto";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

const programIsPCCM = true;
const programIsNotPCCM = false;

global.structuredClone = (val: any) => JSON.parse(JSON.stringify(val));

const currentMLRFormHash = createHash("md5")
  .update(JSON.stringify(mlr))
  .digest("hex");

const currentMCPARFormHash = createHash("md5")
  .update(JSON.stringify(mcpar))
  .digest("hex");

const pccmTemplate = generatePCCMTemplate(mcpar);
const currentPCCMFormHash = createHash("md5")
  .update(JSON.stringify(pccmTemplate))
  .digest("hex");

describe("Test getOrCreateFormTemplate MCPAR", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    dynamoClientMock.reset();
  });
  it("should create a new form template if none exist", async () => {
    dynamoClientMock
      .on(QueryCommand)
      // mocked once for search by hash
      .resolvesOnce({
        Items: [],
      })
      // mocked again for search for latest report
      .resolvesOnce({
        Items: [],
      });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-mcpar-reports",
      ReportType.MCPAR,
      programIsNotPCCM
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

  it("should create a new form template for PCCM if none exist", async () => {
    dynamoClientMock
      .on(QueryCommand)
      // mocked once for search by hash
      .resolvesOnce({
        Items: [],
      })
      // mocked again for search for latest report
      .resolvesOnce({
        Items: [],
      });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-mcpar-reports",
      ReportType.MCPAR,
      programIsPCCM
    );
    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(s3PutSpy).toHaveBeenCalled();
    expect(result.formTemplate).toEqual({
      ...pccmTemplate,
      validationJson: getValidationFromFormTemplate(pccmTemplate as ReportJson),
    });
    expect(result.formTemplateVersion?.versionNumber).toEqual(1);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentPCCMFormHash);
  });

  it("should return the right form and formTemplateVersion if it matches the most recent form", async () => {
    // mocked once for search by hash
    dynamoClientMock.on(QueryCommand).resolvesOnce({
      Items: [
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentMCPARFormHash,
          versionNumber: 3,
        },
      ],
    });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-mcpar-reports",
      ReportType.MCPAR,
      programIsNotPCCM
    );
    expect(dynamoPutSpy).not.toHaveBeenCalled();
    expect(s3PutSpy).not.toHaveBeenCalled();
    expect(result.formTemplateVersion?.versionNumber).toEqual(3);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentMCPARFormHash);
  });

  it("should create a new form if it doesn't match the most recent form", async () => {
    dynamoClientMock
      .on(QueryCommand)
      // mocked once for search by hash
      .resolvesOnce({
        Items: [],
      })
      // mocked again for search for latest report
      .resolvesOnce({
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
      ReportType.MCPAR,
      programIsNotPCCM
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
    dynamoClientMock.reset();
  });
  it("should create a new form template if none exist", async () => {
    dynamoClientMock
      .on(QueryCommand)
      // mocked once for search by hash
      .resolvesOnce({
        Items: [],
      })
      // mocked again for search for latest report
      .resolvesOnce({ Items: [] });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-mlr-reports",
      ReportType.MLR,
      programIsNotPCCM
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
    // mocked once for search by hash
    dynamoClientMock.on(QueryCommand).resolvesOnce({
      Items: [
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentMLRFormHash,
          versionNumber: 3,
        },
      ],
    });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-mlr-reports",
      ReportType.MLR,
      programIsNotPCCM
    );
    expect(dynamoPutSpy).not.toHaveBeenCalled();
    expect(s3PutSpy).not.toHaveBeenCalled();
    expect(result.formTemplateVersion?.versionNumber).toEqual(3);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentMLRFormHash);
  });

  it("should create a new form if it doesn't match the most recent form", async () => {
    dynamoClientMock
      .on(QueryCommand)
      // mocked once for search by hash
      .resolvesOnce({
        Items: [],
      })
      // mocked again for search for latest report
      .resolvesOnce({
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
      "local-mlr-reports",
      ReportType.MLR,
      programIsNotPCCM
    );
    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(s3PutSpy).toHaveBeenCalled();
    expect(result.formTemplateVersion?.versionNumber).toEqual(4);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentMLRFormHash);
  });
});

describe("Test form contents", () => {
  const allFormTemplates = () => {
    const templates = [];
    for (let reportType of Object.values(ReportType)) {
      try {
        const formTemplate = formTemplateForReportType(reportType);
        templates.push(formTemplate);
      } catch (error: any) {
        if (!/not implemented/i.test(error.message)) {
          throw error;
        }
      }
    }
    return templates;
  };

  const flattenRoutes = (routes: ReportRoute[]) => {
    let flatRoutes: ReportRoute[] = [];
    for (let route of routes) {
      flatRoutes.push(route);
      if (route.children) {
        flatRoutes = flatRoutes.concat(flattenRoutes(route.children));
      }
    }
    return flatRoutes;
  };

  const allFormsIn = (formTemplate: ReportJson) => {
    const forms: FormJson[] = [];
    for (let route of flattenRoutes(formTemplate.routes)) {
      for (let possibleForm of Object.values(route)) {
        // This covers route.form, route.modalForm, etc
        if (possibleForm?.fields) {
          forms.push(possibleForm);
        }
      }
    }
    return forms;
  };

  /*
   * Every field is either a field (like a textbox, or a date), or not a field
   * (like a section header). But our type guards are not particularly robust.
   * When a new field type is added, the type guards may need to be updated.
   * That will happen rarely enough that we will forget to do so;
   * this test is here to remind us.
   */
  it("Should contain fields of known types", () => {
    for (let formTemplate of allFormTemplates()) {
      for (let form of allFormsIn(formTemplate)) {
        for (let field of form.fields) {
          const isField = isFieldElement(field);
          const isLayout = isLayoutElement(field);
          if (isField && isLayout) {
            throw new Error(
              `Field '${field.id}' of type ${field.type} has confused the field type guards! Update them.`
            );
          } else if (!isField && !isLayout) {
            throw new Error(
              `Field '${field.id}' of type ${field.type} has confused the field type guards! Update them.`
            );
          }
        }
      }
    }
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
