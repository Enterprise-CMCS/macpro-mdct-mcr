import { AttributeValue, QueryInput } from "aws-sdk/clients/dynamodb";
import dynamodbLib from "../dynamo/dynamodb-lib";
import mlrForm from "../../forms/mlr.json";
import mcparForm from "../../forms/mcpar.json";
import s3Lib, { getFormTemplateKey } from "../s3/s3-lib";
import KSUID from "ksuid";
import { logger } from "../logging";
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
import { getTemplate } from "../../handlers/formTemplates/populateTemplatesTable";
import { createHash } from "crypto";

export async function getNewestTemplateVersion(reportType: ReportType) {
  const queryParams: QueryInput = {
    TableName: process.env.FORM_TEMPLATE_TABLE_NAME!,
    KeyConditionExpression: `reportType = :reportType`,
    ExpressionAttributeValues: {
      ":reportType": reportType as unknown as AttributeValue,
    },
    Limit: 1,
    ScanIndexForward: false, // true = ascending, false = descending
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
      throw new Error(
        "Not Implemented: NAAAR form template JSON must be added to FormTemplateProvider"
      );
    default:
      assertExhaustive(reportType);
      throw new Error(
        "Not Implemented: ReportType not recognized by FormTemplateProvider"
      );
  }
};

export async function getOrCreateFormTemplate(
  reportBucket: string,
  reportType: ReportType
) {
  const currentFormTemplate = formTemplateForReportType(reportType);
  const formTemplateWithAdminDisabled =
    copyAdminDisabledStatusToForms(currentFormTemplate);
  const stringifiedTemplate = JSON.stringify(formTemplateWithAdminDisabled);

  const currentTemplateHash = createHash("md5")
    .update(stringifiedTemplate)
    .digest("hex");

  const mostRecentTemplateVersion = await getNewestTemplateVersion(reportType);
  const mostRecentTemplateVersionHash = mostRecentTemplateVersion?.md5Hash;

  if (currentTemplateHash === mostRecentTemplateVersionHash) {
    return {
      formTemplate: copyAdminDisabledStatusToForms(
        await getTemplate(
          reportBucket,
          getFormTemplateKey(mostRecentTemplateVersion?.id)
        )
      ),
      formTemplateVersion: mostRecentTemplateVersion,
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

    // If we didn't find any form templates, start version at 1.
    const newFormTemplateVersionItem: FormTemplate = {
      versionNumber: mostRecentTemplateVersion?.versionNumber
        ? (mostRecentTemplateVersion.versionNumber += 1)
        : 1,
      md5Hash: currentTemplateHash,
      id: newFormTemplateId,
      lastAltered: new Date().toString(),
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

// returns reportJson with forms that mirror the adminDisabled status of the report
export const copyAdminDisabledStatusToForms = (
  reportJson: ReportJson
): ReportJson => {
  const reportAdminDisabledStatus = !!reportJson.adminDisabled;
  const writeAdminDisabledStatus = (routes: ReportRoute[]) => {
    routes.forEach((route: ReportRoute) => {
      // if children, recurse (only parent routes have children)
      if (route.children) {
        writeAdminDisabledStatus(route.children);
      } else {
        // else if form present downstream, copy adminDisabled status to form
        if (route.form) route.form.adminDisabled = reportAdminDisabledStatus;
        if (route.drawerForm)
          route.drawerForm.adminDisabled = reportAdminDisabledStatus;
        if (route.modalForm)
          route.modalForm.adminDisabled = reportAdminDisabledStatus;
      }
    });
  };
  writeAdminDisabledStatus(reportJson.routes);
  return reportJson;
};

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

export function isLayoutElement(
  field: FormField | FormLayoutElement
): field is FormLayoutElement {
  /*
   * This function is duplicated in ui-src/src/types/formFields.ts
   * If you change it here, change it there!
   */
  return (field as FormField).validation === undefined;
}

export function getValidationFromFormTemplate(reportJson: ReportJson) {
  return compileValidationJsonFromRoutes(
    flattenReportRoutesArray(copyAdminDisabledStatusToForms(reportJson).routes)
  );
}
