import {
  AnyObject,
  FieldChoice,
  FormField,
  ReportShape,
  ReportRoute,
  isFieldElement,
} from "types";

export const sortReportsOldestToNewest = (
  reportsArray: ReportShape[]
): ReportShape[] =>
  reportsArray.sort((stateA, stateB) => stateA.createdAt - stateB.createdAt);

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
    // Use groupId for a single validation across different field ids
    const fieldId = field.groupId ?? field.id;
    // compile field's validation schema
    validationSchema[fieldId] = field.validation;
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
    const standardFormFields = route.form?.fields.filter(isFieldElement);
    if (standardFormFields) mapFieldIdsToObject(standardFormFields);
    // if modal form present, map to return object
    const modalFormFields = route.modalForm?.fields.filter(isFieldElement);
    if (modalFormFields) mapFieldIdsToObject(modalFormFields);
    // if drawer form present, map to return object
    const drawerFormFields = route.drawerForm?.fields.filter(isFieldElement);
    if (drawerFormFields) mapFieldIdsToObject(drawerFormFields);
  });
  return objectToReturn;
};
