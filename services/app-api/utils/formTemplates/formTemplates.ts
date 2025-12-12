import { QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import dynamodbLib from "../dynamo/dynamodb-lib";
import s3Lib, { getFormTemplateKey } from "../s3/s3-lib";
import KSUID from "ksuid";
import { logger } from "../debugging/debug-lib";
import { createHash } from "crypto";
// types
import {
  AnyObject,
  FieldChoice,
  FormField,
  FormLayoutElement,
  FormTemplate,
  ModalOverlayReportPageShape,
  ReportJson,
  ReportJsonFile,
  ReportRoute,
  ReportType,
} from "../types";
// utils
import { getTemplate } from "../../handlers/formTemplates/populateTemplatesTable";
import { isFeaturedFlagEnabled } from "../featureFlags/featureFlags";
// routes
import { mcparReportJson, mlrReportJson, naaarReportJson } from "../../forms";
// flagged routes
import * as mcparFlags from "../../forms/routes/mcpar/flags";
import * as mlrFlags from "../../forms/routes/mlr/flags";
import * as naaarFlags from "../../forms/routes/naaar/flags";

export async function getNewestTemplateVersion(reportType: ReportType) {
  const queryParams: QueryCommandInput = {
    TableName: process.env.FormTemplateVersionsTable!,
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
    TableName: process.env.FormTemplateVersionsTable!,
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

export const formTemplateForReportType = async (
  reportType: ReportType,
  _options: { [key: string]: boolean } = {}
) => {
  const routeMap: Record<ReportType, ReportJsonFile> = {
    [ReportType.MCPAR]: mcparReportJson,
    [ReportType.MLR]: mlrReportJson,
    [ReportType.NAAAR]: naaarReportJson,
  };

  // Get LaunchDarkly flags from folder names in forms/routes/[reportType]/flags
  const flagMap: Record<ReportType, any> = {
    [ReportType.MCPAR]: mcparFlags,
    [ReportType.MLR]: mlrFlags,
    [ReportType.NAAAR]: naaarFlags,
  };

  const flagsByReportType = flagMap[reportType];
  const flagNames = Object.keys(flagsByReportType);

  // Loop through flags and replace routes if flag is enabled
  for (const flagName of flagNames) {
    const enabled = await isFeaturedFlagEnabled(flagName);

    if (enabled) {
      routeMap[reportType] = flagsByReportType[flagName];
      break;
    }
  }

  return structuredClone(routeMap[reportType] as ReportJson);
};

export async function getOrCreateFormTemplate(
  reportBucket: string,
  reportType: ReportType,
  options: { [key: string]: boolean } = {}
) {
  let currentFormTemplate = await formTemplateForReportType(
    reportType,
    options
  );

  if (options.isPccm) {
    currentFormTemplate = generatePCCMTemplate(currentFormTemplate);
  }

  if (options.hasNaaarSubmission) {
    currentFormTemplate = filterFormTemplateRoutes(
      currentFormTemplate,
      ["Access Measures"],
      ["accessMeasures"]
    );
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
        TableName: process.env.FormTemplateVersionsTable!,
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
    // if add entity drawer form present, add validation to schema
    const addEntityDrawerFormFields =
      route.addEntityDrawerForm?.fields.filter(isFieldElement);
    if (addEntityDrawerFormFields)
      addValidationToAccumulator(addEntityDrawerFormFields);
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
  const formLayoutElementTypes = [
    "sectionHeader",
    "sectionContent",
    "sectionDivider",
  ];
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

export const generatePCCMTemplate = (originalReportTemplate: ReportJson) => {
  const routesToIncludeInPCCM = {
    "A: Program Information": [
      "Point of Contact",
      "Reporting Period",
      "Add Plans",
    ],
    "B: State-Level Indicators": ["I: Program Characteristics"],
    "C: Program-Level Indicators": ["I: Program Characteristics"],
    "D: Plan-Level Indicators": [
      "I: Program Characteristics",
      "VIII: Sanctions",
    ],
    "F: Notes": [],
    "Review & Submit": [],
  } as { [key: string]: string[] };

  const entitiesToIncludeInPCCM = ["plans", "sanctions"];

  const makePCCMTemplateModifications = (reportTemplate: ReportJson) => {
    // Find Question C1.I.3 Program type in Section C.I and disable it
    const programTypeQuestion =
      reportTemplate.routes[2].children![0].form!.fields[3];
    if (programTypeQuestion.id !== "program_type") {
      throw new Error("Update PCCM logic!");
    }
    programTypeQuestion.props!.disabled = true;
  };

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

export const filterFormTemplateRoutes = (
  originalReportTemplate: ReportJson,
  routesToRemove: string[],
  entitiesToRemove: string[]
) => {
  const filterRoutesByName = (
    routes: ReportRoute[],
    routesToRemove: string[]
  ) => {
    return routes
      .map((route) => {
        if (route.children) {
          route.children = filterRoutesByName(route.children, routesToRemove);
        }
        return route;
      })
      .filter((route) => !routesToRemove.includes(route.name));
  };

  const filterEntitiesByName = (
    entities: { [key: string]: { [key: string]: boolean } },
    entitiesToRemove: string[]
  ) => {
    entitiesToRemove.forEach((key) => {
      delete entities[key];
    });
  };

  const reportTemplate = structuredClone(originalReportTemplate);
  filterRoutesByName(reportTemplate.routes, routesToRemove);
  filterEntitiesByName(reportTemplate.entities, entitiesToRemove);
  return reportTemplate;
};

export const filterByFlag = (route: ReportRoute, flag: string) => {
  return route?.flag !== flag;
};
