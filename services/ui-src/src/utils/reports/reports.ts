import {
  AnyObject,
  FieldChoice,
  FormField,
  ReportShape,
  ReportJson,
  ReportRoute,
} from "types";

// returns reportJson with forms that mirror the adminDisabled status of the report
export const copyAdminDisabledStatusToForms = (
  reportJson: ReportJson
): ReportJson => {
  const reportAdminDisabledStatus = !!reportJson.adminDisabled;
  const writeAdminDisabledStatus = (routes: ReportRoute[]) => {
    routes.forEach((route: ReportRoute) => {
      // if children, recurse
      if (route?.children) {
        writeAdminDisabledStatus(route.children);
      }
      // else if form (children & form are always mutually exclusive)
      else if (route?.form) {
        // copy adminDisabled status to form
        route.form.adminDisabled = reportAdminDisabledStatus;
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

export const compileValidationJson = (routeArray: ReportRoute[]): AnyObject => {
  const validationSchema: AnyObject = {};
  const getValidationFromFields = (fieldArray: FormField[]) => {
    fieldArray.forEach((field: FormField) => {
      // compile field's validation schema
      validationSchema[field.id] = field.validation;
      // if field has choices/options
      const fieldChoices = field.props?.choices;
      if (fieldChoices) {
        fieldChoices.forEach((choice: FieldChoice) => {
          // if given field choice has nested children
          const nestedChildren = choice.children;
          if (nestedChildren) {
            getValidationFromFields(nestedChildren);
          }
        });
      }
    });
  };
  routeArray.forEach((route: ReportRoute) => {
    const routeFormFields = route.form?.fields;
    if (routeFormFields) {
      getValidationFromFields(routeFormFields);
    }
  });
  return validationSchema;
};

export const addValidationToReportJson = (
  reportJson: ReportRoute[],
  validationSchema: AnyObject
): ReportRoute[] => {
  const mapSchemaToForms = (routes: ReportRoute[], schema: AnyObject) => {
    routes.map((route: ReportRoute) => {
      // if children, recurse; if none, push to routes array
      if (route?.children) {
        mapSchemaToForms(route.children, validationSchema);
      }
      // else if form (children & form are always mutually exclusive)
      else if (route?.form) {
        // add corresponding validation schema to form
        const correspondingValidationSchema = schema[route.form.id];
        route.form.validation = correspondingValidationSchema || {};
      }
    });
  };
  mapSchemaToForms(reportJson, validationSchema);
  return reportJson;
};

export const sortReportsOldestToNewest = (
  reportsArray: ReportShape[]
): ReportShape[] =>
  reportsArray.sort((stateA, stateB) => stateA.createdAt - stateB.createdAt);
