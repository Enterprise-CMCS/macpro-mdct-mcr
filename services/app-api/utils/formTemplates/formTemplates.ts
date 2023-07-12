import { AttributeValue, QueryInput } from "aws-sdk/clients/dynamodb";
import dynamodbLib from "../dynamo/dynamodb-lib";
import mlrForm from "../../forms/mlr.json";
import mcparForm from "../../forms/mcpar.json";
import s3Lib, { getFormTemplateKey } from "../s3/s3-lib";
import KSUID from "ksuid";
import { logger } from "../logging";
import {
  AnyObject,
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

export function getNewestTemplateVersionRequest(
  reportType: keyof typeof ReportType
): QueryInput {
  return {
    TableName: process.env.FORM_TEMPLATE_TABLE_NAME!,
    IndexName: "LastAlteredIndex",
    KeyConditionExpression: `reportType = :reportType`,
    ExpressionAttributeValues: {
      ":reportType": reportType as AttributeValue,
    },
    Limit: 1,
    ScanIndexForward: false, // true = ascending, false = descending
  };
}

export async function getOrCreateFormTemplate(
  reportBucket: string,
  reportType: ReportType
) {
  const currentFormTemplate = reportType === "MCPAR" ? mcparForm : mlrForm;

  const formTemplateWithAdminDisabled = copyAdminDisabledStatusToForms(
    currentFormTemplate as ReportJson
  );

  const stringifiedTemplate = JSON.stringify(formTemplateWithAdminDisabled);

  const currentTemplateHash = createHash("md5")
    .update(stringifiedTemplate)
    .digest("hex");

  const mostRecentTemplateVersion = (
    await dynamodbLib.query(getNewestTemplateVersionRequest(reportType))
  ).Items?.[0];

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
    try {
      await s3Lib.put({
        Key: getFormTemplateKey(newFormTemplateId),
        Body: JSON.stringify(
          copyAdminDisabledStatusToForms(currentFormTemplate as ReportJson)
        ),
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
      formTemplate: formTemplateWithAdminDisabled,
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

const formLayoutElementTypes = ["sectionHeader", "sectionContent"];

export function isFieldElement(
  field: FormField | FormLayoutElement
): field is FormField {
  return !formLayoutElementTypes.includes(field.type);
}
