import { QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import dynamodbLib from "../dynamo/dynamodb-lib";
import s3Lib, { getFormTemplateKey } from "../s3/s3-lib";
import KSUID from "ksuid";
import { logger } from "../debugging/debug-lib";
import { createHash } from "crypto";
// forms
import mlrForm from "../../forms/mlr.json";
import mcparForm from "../../forms/mcpar.json";
import naaarForm from "../../forms/naaar.json";
// types
import {
  AnyObject,
  assertExhaustive,
  FieldChoice,
  FormField,
  FormLayoutElement,
  FormTemplate,
  ModalOverlayReportPageShape,
  ReportJson,
  ReportRoute,
  ReportType,
} from "../types";
// utils
import { getTemplate } from "../../handlers/formTemplates/populateTemplatesTable";

export async function getNewestTemplateVersion(reportType: ReportType) {
  const queryParams: QueryCommandInput = {
    TableName: process.env.FORM_TEMPLATE_TABLE_NAME!,
    KeyConditionExpression: `reportType = :reportType`,
    ExpressionAttributeValues: {
      ":reportType": reportType,
    },
    Limit: 1,
    ScanIndexForward: false, // true = ascending, false = descending
  };
  const result = await dynamodbLib.query(queryParams);
  return result.Items?.[0];
}

export async function getTemplateVersionByHash(
  reportType: ReportType,
  hash: string
) {
  const queryParams: QueryCommandInput = {
    TableName: process.env.FORM_TEMPLATE_TABLE_NAME!,
    IndexName: "HashIndex",
    KeyConditionExpression: "reportType = :reportType AND md5Hash = :md5Hash",
    Limit: 1,
    ExpressionAttributeValues: {
      ":md5Hash": hash,
      ":reportType": reportType,
    },
  };
  const result = await dynamodbLib.query(queryParams);
  return result.Items?.[0];
}

export const formTemplateForReportType = (reportType: ReportType) => {
  switch (reportType) {
    case ReportType.MCPAR:
      return mcparForm as ReportJson;
    case ReportType.MLR:
      return mlrForm as ReportJson;
    case ReportType.NAAAR:
      return naaarForm as ReportJson;
    default:
      assertExhaustive(reportType);
      throw new Error(
        "Not Implemented: ReportType not recognized by FormTemplateProvider"
      );
  }
};

export async function getOrCreateFormTemplate(
  reportBucket: string,
  reportType: ReportType,
  isProgramPCCM: boolean
) {
  let currentFormTemplate = formTemplateForReportType(reportType);

  if (isProgramPCCM) {
    currentFormTemplate = generatePCCMTemplate(currentFormTemplate);
  }

  const stringifiedTemplate = JSON.stringify(currentFormTemplate);
  const currentTemplateHash = createHash("md5")
    .update(stringifiedTemplate)
    .digest("hex");

  const matchingTemplateMetadata = await getTemplateVersionByHash(
    reportType,
    currentTemplateHash
  );

  if (matchingTemplateMetadata) {
    return {
      formTemplate: await getTemplate(
        reportBucket,
        getFormTemplateKey(matchingTemplateMetadata?.id)
      ),
      formTemplateVersion: matchingTemplateMetadata,
    };
  } else {
    const newFormTemplateId = KSUID.randomSync().string;
    const formTemplateWithValidationJson = {
      ...currentFormTemplate,
      validationJson: getValidationFromFormTemplate(currentFormTemplate),
    };
    try {
      await s3Lib.put({
        Key: getFormTemplateKey(newFormTemplateId),
        Body: JSON.stringify(formTemplateWithValidationJson),
        ContentType: "application/json",
        Bucket: reportBucket,
      });
    } catch (err) {
      logger.error(err, "Error uploading new form template to S3");
      throw err;
    }

    const newestTemplateMetadata = await getNewestTemplateVersion(reportType);

    // If we didn't find any form templates, start version at 1.
    const newFormTemplateVersionItem: FormTemplate = {
      versionNumber: newestTemplateMetadata?.versionNumber
        ? (newestTemplateMetadata.versionNumber += 1)
        : 1,
      md5Hash: currentTemplateHash,
      id: newFormTemplateId,
      lastAltered: new Date().toISOString(),
      reportType,
    };

    try {
      await dynamodbLib.put({
        TableName: process.env.FORM_TEMPLATE_TABLE_NAME!,
        Item: newFormTemplateVersionItem,
      });
    } catch (err) {
      logger.error(
        err,
        "Error writing a new form template version to DynamoDB."
      );
      throw err;
    }

    return {
      formTemplate: formTemplateWithValidationJson,
      formTemplateVersion: newFormTemplateVersionItem,
    };
  }
}

// returns flattened array of valid routes for given reportJson
export const flattenReportRoutesArray = (
  reportJson: ReportRoute[]
): ReportRoute[] => {
  const routesArray: ReportRoute[] = [];
  const mapRoutesToArray = (reportRoutes: ReportRoute[]) => {
    reportRoutes.map((route: ReportRoute) => {
      // if children, recurse; if none, push to routes array
      if (route?.children) {
        mapRoutesToArray(route.children);
      } else {
        routesArray.push(route);
      }
    });
  };
  mapRoutesToArray(reportJson);
  return routesArray;
};

// returns validation schema object for array of fields
export const compileValidationJsonFromFields = (
  fieldArray: FormField[],
  parentOption?: any
): AnyObject => {
  const validationSchema: AnyObject = {};
  fieldArray.forEach((field: FormField) => {
    // if field has a parent option, add option name to validation object
    if (
      typeof field.validation === "object" &&
      !field.validation.parentOptionId
    ) {
      field.validation.parentOptionId = parentOption?.name;
    }
    // compile field's validation schema
    validationSchema[field.id] = field.validation;
    // if field has choices/options (ie could have nested children)
    const fieldChoices = field.props?.choices;
    if (fieldChoices) {
      fieldChoices.forEach((choice: FieldChoice) => {
        // if given field choice has nested children
        const nestedChildFields = choice.children;
        if (nestedChildFields) {
          Object.assign(
            validationSchema,
            compileValidationJsonFromFields(nestedChildFields, choice)
          );
        }
      });
    }
  });
  return validationSchema;
};

// traverse routes and compile all field validation schema into one object
export const compileValidationJsonFromRoutes = (
  routeArray: ReportRoute[]
): AnyObject => {
  const validationSchema: AnyObject = {};
  const addValidationToAccumulator = (formFields: FormField[]) => {
    Object.assign(
      validationSchema,
      compileValidationJsonFromFields(formFields)
    );
  };
  routeArray.forEach((route: ReportRoute) => {
    // check for non-standard needed validation objects
    if (
      (route.pageType === "modalDrawer" || route.pageType === "modalOverlay") &&
      route.entityType
    ) {
      Object.assign(validationSchema, { [route.entityType]: "objectArray" });
    }
    // if standard form present, add validation to schema
    const standardFormFields = route.form?.fields.filter(isFieldElement);
    if (standardFormFields) addValidationToAccumulator(standardFormFields);
    // if modal form present, add validation to schema
    const modalFormFields = route.modalForm?.fields.filter(isFieldElement);
    if (modalFormFields) addValidationToAccumulator(modalFormFields);
    // if drawer form present, add validation to schema
    const drawerFormFields = route.drawerForm?.fields.filter(isFieldElement);
    if (drawerFormFields) addValidationToAccumulator(drawerFormFields);
    if (route.pageType === "modalOverlay") {
      const overlayFormFields = (
        route as ModalOverlayReportPageShape
      ).overlayForm?.fields.filter(isFieldElement);
      if (overlayFormFields) addValidationToAccumulator(overlayFormFields);
    }
  });
  return validationSchema;
};

export function isFieldElement(
  field: FormField | FormLayoutElement
): field is FormField {
  /*
   * This function is duplicated in ui-src/src/types/formFields.ts
   * If you change it here, change it there!
   */
  const formLayoutElementTypes = ["sectionHeader", "sectionContent"];
  return !formLayoutElementTypes.includes(field.type);
}

export function getValidationFromFormTemplate(reportJson: ReportJson) {
  return compileValidationJsonFromRoutes(
    flattenReportRoutesArray(reportJson.routes)
  );
}

export function getPossibleFieldsFromFormTemplate(reportJson: ReportJson) {
  return Object.keys(getValidationFromFormTemplate(reportJson));
}

const routesToIncludeInPCCM = {
  "A: Program Information": [
    "Point of Contact",
    "Reporting Period",
    "Add Plans",
  ],
  "B: State-Level Indicators": ["I: Program Characteristics"],
  "C: Program-Level Indicators": ["I: Program Characteristics"],
  "D: Plan-Level Indicators": ["I: Program Characteristics", "VIII: Sanctions"],
  "Review & Submit": [],
} as { [key: string]: string[] };

const entitiesToIncludeInPCCM = ["plans", "sanctions"];

export const generatePCCMTemplate = (originalReportTemplate: any) => {
  const reportTemplate = structuredClone(originalReportTemplate);
  // remove top level sections not in include list
  reportTemplate.routes = reportTemplate.routes.filter(
    (route: ReportRoute) => !!routesToIncludeInPCCM[route.name]
  );

  // only include listed subsections
  for (let route of reportTemplate.routes) {
    if (route?.children) {
      route.children = route.children.filter((childRoute: ReportRoute) =>
        routesToIncludeInPCCM[route.name].includes(childRoute.name)
      );
    }
  }

  // Any entity not in the allow list must be removed.
  for (let entityType of Object.keys(reportTemplate.entities)) {
    if (!entitiesToIncludeInPCCM.includes(entityType)) {
      delete reportTemplate.entities[entityType];
    }
  }

  // make additional form modifications as necessary
  makePCCMTemplateModifications(reportTemplate);

  return reportTemplate;
};

const makePCCMTemplateModifications = (reportTemplate: ReportJson) => {
  // Find Question C1.I.3 Program type in Section C.I and disable it
  const programTypeQuestion =
    reportTemplate.routes[2].children![0].form!.fields[3];
  if (programTypeQuestion.id !== "program_type") {
    throw new Error("Update PCCM logic!");
  }
  programTypeQuestion.props!.disabled = true;
};

export const filterByFlag = (route: ReportRoute, flag: string) => {
  return route?.flag !== flag;
};
