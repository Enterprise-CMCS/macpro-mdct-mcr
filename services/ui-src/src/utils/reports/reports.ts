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
    if (typeof field.validation === "object") {
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
    if (route.pageType === "modalDrawer" && route.entityType) {
      Object.assign(validationSchema, { [route.entityType]: "objectArray" });
    }
    // if standard form present, add validation to schema
    const standardFormFields = route.form?.fields;
    if (standardFormFields) addValidationToAccumulator(standardFormFields);
    // if modal form present, add validation to schema
    const modalFormFields = route.modalForm?.fields;
    if (modalFormFields) addValidationToAccumulator(modalFormFields);
    // if drawer form present, add validation to schema
    const drawerFormFields = route.drawerForm?.fields;
    if (drawerFormFields) addValidationToAccumulator(drawerFormFields);
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
    // if standard form present, map to return object
    const standardFormFields = route.form?.fields;
    if (standardFormFields) mapFieldIdsToObject(standardFormFields);
    // if modal form present, map to return object
    const modalFormFields = route.modalForm?.fields;
    if (modalFormFields) mapFieldIdsToObject(modalFormFields);
    // if drawer form present, map to return object
    const drawerFormFields = route.drawerForm?.fields;
    if (drawerFormFields) mapFieldIdsToObject(drawerFormFields);
  });
  return objectToReturn;
};
