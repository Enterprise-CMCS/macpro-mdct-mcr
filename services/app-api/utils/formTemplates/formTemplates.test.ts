import {
  compileValidationJsonFromRoutes,
  filterByFlag,
  flattenReportRoutesArray,
  formTemplateForReportType,
  filterFormTemplateRoutes,
  generatePCCMTemplate,
  getOrCreateFormTemplate,
  getValidationFromFormTemplate,
  isFieldElement,
  replaceQualityMeasuresRoute,
} from "./formTemplates";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import s3Lib from "../s3/s3-lib";
import dynamodbLib from "../dynamo/dynamodb-lib";
// forms
import mlr from "../../forms/mlr.json";
import mcpar from "../../forms/mcpar.json";
// utils
import {
  mockReportJson,
  mockS3PutObjectCommandOutput,
} from "../testing/setupJest";
// types
import {
  FormJson,
  ReportJson,
  ReportRoute,
  ReportType,
  isLayoutElement,
  FormField,
  FormLayoutElement,
} from "../types";
import { createHash } from "crypto";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

const programIsPCCM = true;
const programIsNotPCCM = false;

const currentMLRFormHash = createHash("md5")
  .update(JSON.stringify(mlr))
  .digest("hex");

const currentMCPARFormHash = createHash("md5")
  .update(JSON.stringify(mcpar))
  .digest("hex");

const pccmTemplate = generatePCCMTemplate(mcpar as ReportJson);
const currentPCCMFormHash = createHash("md5")
  .update(JSON.stringify(pccmTemplate))
  .digest("hex");

const modifiedTemplate = filterFormTemplateRoutes(
  mcpar as ReportJson,
  ["Access Measures"],
  ["accessMeasures"]
);

const currentModifiedFormHash = createHash("md5")
  .update(JSON.stringify(modifiedTemplate))
  .digest("hex");

let templateWithUpdatedQualityMeasures = filterFormTemplateRoutes(
  mcpar as ReportJson,
  ["VII: Quality Measures"],
  []
);
templateWithUpdatedQualityMeasures = replaceQualityMeasuresRoute(
  templateWithUpdatedQualityMeasures
);

const currentQualityMeasuresFormHash = createHash("md5")
  .update(JSON.stringify(templateWithUpdatedQualityMeasures))
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
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    const result = await getOrCreateFormTemplate(
      "local-mcpar-reports",
      ReportType.MCPAR,
      { isPccm: programIsNotPCCM, qualityMeasuresEnabled: true }
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
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    const result = await getOrCreateFormTemplate(
      "local-mcpar-reports",
      ReportType.MCPAR,
      { isPccm: programIsPCCM, qualityMeasuresEnabled: true }
    );
    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(s3PutSpy).toHaveBeenCalled();
    expect(result.formTemplate).toEqual({
      ...pccmTemplate,
      validationJson: getValidationFromFormTemplate(pccmTemplate),
    });
    expect(result.formTemplateVersion?.versionNumber).toEqual(1);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentPCCMFormHash);
  });

  it("should return the right form and formTemplateVersion if it matches the most recent form", async () => {
    const s3GetSpy = jest.spyOn(s3Lib, "get");
    s3GetSpy.mockResolvedValue(mlr);
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
      { isPccm: programIsNotPCCM, qualityMeasuresEnabled: true }
    );
    expect(dynamoPutSpy).not.toHaveBeenCalled();
    expect(s3PutSpy).not.toHaveBeenCalled();
    expect(s3GetSpy).toHaveBeenCalled();
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
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    const result = await getOrCreateFormTemplate(
      "local-mcpar-reports",
      ReportType.MCPAR,
      { isPccm: programIsNotPCCM, qualityMeasuresEnabled: true }
    );
    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(s3PutSpy).toHaveBeenCalled();
    expect(result.formTemplateVersion?.versionNumber).toEqual(4);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentMCPARFormHash);
  });

  it("should create a new form template if none exist (feature flagged version)", async () => {
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
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    const result = await getOrCreateFormTemplate(
      "local-mcpar-reports",
      ReportType.MCPAR,
      { isPccm: programIsNotPCCM, qualityMeasuresEnabled: true }
    );

    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(s3PutSpy).toHaveBeenCalled();
    expect(result.formTemplate).toEqual({
      ...mcpar,
      validationJson: getValidationFromFormTemplate(mcpar as ReportJson),
    });

    delete result.formTemplate["validationJson"];
    const ffFormHash = createHash("md5")
      .update(JSON.stringify(result.formTemplate))
      .digest("hex");

    expect(result.formTemplateVersion?.versionNumber).toEqual(1);
    expect(result.formTemplateVersion?.md5Hash).toEqual(ffFormHash);
  });

  test("should create a new form template with excluded routes and entities", async () => {
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
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    const result = await getOrCreateFormTemplate(
      "local-mcpar-reports",
      ReportType.MCPAR,
      { hasNaaarSubmission: true, qualityMeasuresEnabled: true }
    );

    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(s3PutSpy).toHaveBeenCalled();
    expect(result.formTemplate).toEqual({
      ...modifiedTemplate,
      validationJson: getValidationFromFormTemplate(modifiedTemplate),
    });
    expect(result.formTemplateVersion?.versionNumber).toEqual(1);
    expect(result.formTemplateVersion?.md5Hash).toEqual(
      currentModifiedFormHash
    );
  });

  test("should create a new form template with excluded routes and entities", async () => {
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
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    const result = await getOrCreateFormTemplate(
      "local-mcpar-reports",
      ReportType.MCPAR,
      { qualityMeasuresEnabled: false }
    );

    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(s3PutSpy).toHaveBeenCalled();
    expect(result.formTemplate).toEqual({
      ...templateWithUpdatedQualityMeasures,
      validationJson: getValidationFromFormTemplate(
        templateWithUpdatedQualityMeasures
      ),
    });
    expect(result.formTemplateVersion?.versionNumber).toEqual(1);
    expect(result.formTemplateVersion?.md5Hash).toEqual(
      currentQualityMeasuresFormHash
    );
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
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    const result = await getOrCreateFormTemplate(
      "local-mlr-reports",
      ReportType.MLR,
      { isPccm: programIsNotPCCM, qualityMeasuresEnabled: true }
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
    const s3GetSpy = jest.spyOn(s3Lib, "get");
    s3GetSpy.mockResolvedValue(mlr);
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
      { isPccm: programIsNotPCCM, qualityMeasuresEnabled: true }
    );
    expect(dynamoPutSpy).not.toHaveBeenCalled();
    expect(s3PutSpy).not.toHaveBeenCalled();
    expect(s3GetSpy).toHaveBeenCalled();
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
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    const result = await getOrCreateFormTemplate(
      "local-mlr-reports",
      ReportType.MLR,
      { isPccm: programIsNotPCCM, qualityMeasuresEnabled: true }
    );
    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(s3PutSpy).toHaveBeenCalled();
    expect(result.formTemplateVersion?.versionNumber).toEqual(4);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentMLRFormHash);
  });
});

describe("Test form contents", () => {
  const allFormTemplates = () => {
    const templates: ReportJson[] = [];
    for (let reportType of Object.values(ReportType)) {
      try {
        const formTemplate = formTemplateForReportType(
          reportType
        ) as ReportJson;
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
          const baseField = field as FormField | FormLayoutElement;
          if (isField && isLayout) {
            throw new Error(
              `Field '${baseField.id}' of type ${baseField.type} has confused the field type guards! Update them.`
            );
          } else if (!isField && !isLayout) {
            throw new Error(
              `Field '${baseField.id}' of type ${baseField.type} has confused the field type guards! Update them.`
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

describe("filterByFlag()", () => {
  it("Return whether route is allowed", () => {
    const routes: ReportRoute[] = [
      {
        name: "noFlag",
        path: "/noFlag",
      },
      {
        name: "filteredFlag",
        path: "/filteredFlag",
        flag: "filteredFlag",
      },
      {
        name: "allowedFlag",
        path: "/allowedFlag",
        flag: "allowedFlag",
      },
    ];
    const route1 = filterByFlag(routes[0], "filteredFlag");
    expect(route1).toEqual(true);

    const route2 = filterByFlag(routes[1], "filteredFlag");
    expect(route2).toEqual(false);

    const route3 = filterByFlag(routes[2], "filteredFlag");
    expect(route3).toEqual(true);
  });
});

describe("errors", () => {
  describe("formTemplateForReportType()", () => {
    test("show throw error for bad reportType", () => {
      expect(() => formTemplateForReportType("badType" as ReportType)).toThrow(
        "Not Implemented: ReportType not recognized by FormTemplateProvider"
      );
    });
  });

  describe("generatePCCMTemplate()", () => {
    test("show throw error for bad PCCM logic", () => {
      const reportJson = structuredClone(mcpar) as ReportJson;
      reportJson.routes[2].children![0].form!.fields[3].id = "bad_type";
      expect(() => generatePCCMTemplate(reportJson)).toThrow(
        "Update PCCM logic!"
      );
    });
  });
});
