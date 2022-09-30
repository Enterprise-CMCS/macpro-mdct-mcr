import {
  AnyObject,
  FieldChoice,
  FormField,
  ReportShape,
  ReportJson,
  ReportRoute,
} from "types";

export const sortReportsOldestToNewest = (
  reportsArray: ReportShape[]
): ReportShape[] =>
  reportsArray.sort((stateA, stateB) => stateA.createdAt - stateB.createdAt);

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

export const compileValidationJsonFromFields = (
  fieldArray: FormField[]
): AnyObject => {
  const validationSchema: AnyObject = {};
  fieldArray.forEach((field: FormField) => {
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
            compileValidationJsonFromFields(nestedChildFields)
          );
        }
      });
    }
  });
  return validationSchema;
};

export const compileValidationJsonFromRoutes = (
  routeArray: ReportRoute[]
): AnyObject => {
  const validationSchema: AnyObject = {};
  routeArray.forEach((route: ReportRoute) => {
    const routeFormFields = route.form?.fields;
    if (routeFormFields) {
      Object.assign(
        validationSchema,
        compileValidationJsonFromFields(routeFormFields)
      );
    }
  });
  return validationSchema;
};

// saving method for future creation of fieldId map at product request
export const makeFieldIdList = (routes: ReportRoute[]): AnyObject => {
  const objectToReturn: AnyObject = {};
  const mapFieldIdsToObject = (fieldArray: FormField[]) =>
    fieldArray.map((field: FormField) => {
      objectToReturn[field.id] = field.props?.label;
      // if choices exist on field, check for children
      field.props?.choices?.map((fieldChoice: FieldChoice) => {
        // if children exist on choice, recurse through children
        if (fieldChoice?.children) {
          mapFieldIdsToObject(fieldChoice?.children);
        }
      });
    });
  routes.map((route: ReportRoute) => {
    if (route.form?.fields) mapFieldIdsToObject(route.form?.fields);
  });
  return objectToReturn;
};
