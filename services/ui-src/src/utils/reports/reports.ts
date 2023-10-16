import {
  AnyObject,
  FieldChoice,
  FormField,
  ReportJson,
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

// saving
// Section A: Program Information
//  Point of Contact
//  Reporting Period
//  Add Plans
// Section B: State-Level Indicators
//  Program Characteristics and Enrollment
// Section C: Program-Level Indicators
//  Program Characteristics
// Section D: Plan-Level Indicators
//  Program Characteristics and Enrollment
//  Sanctions
// Review and Submit

// entities to keep
// plans
// sanctions

const routesToInclude = {
  sectionA: ["Point of Contact", "Reporting Period", "Add Plans"],
  sectionB: ["I: Program Characteristics"],
  sectionC: ["I: Program Characteristics"],
  sectionD: ["I: Program Characteristics", "VIII: Sanctions"],
};
const entitiesToInclude = ["plans", "sanctions"];

export const generatePCCMTemplate = (reportTemplate: any) => {
  let filteredEntities: any = {};

  for (const key of entitiesToInclude) {
    if (reportTemplate.entities[key]) {
      filteredEntities[key] = reportTemplate.entities[key];
    }
  }

  // Section A
  const indexOfSectionA = reportTemplate.routes.findIndex((route: any) =>
    route.name.includes("A:")
  );
  const filteredSectionAChildren: any = [];
  for (const route of routesToInclude.sectionA) {
    const indexOfSubSection = reportTemplate.routes[
      indexOfSectionA
    ].children.findIndex((subSection: any) => subSection.name === route);
    filteredSectionAChildren.push(
      reportTemplate.routes[indexOfSectionA].children[indexOfSubSection]
    );
  }
  reportTemplate.routes[indexOfSectionA].children = filteredSectionAChildren;

  // Section B
  const indexOfSectionB = reportTemplate.routes.findIndex((route: any) =>
    route.name.includes("B:")
  );
  const filteredSectionBChildren: any = [];
  for (const route of routesToInclude.sectionB) {
    const indexOfSubSection = reportTemplate.routes[
      indexOfSectionB
    ].children.findIndex((subSection: any) => subSection.name === route);
    filteredSectionBChildren.push(
      reportTemplate.routes[indexOfSectionB].children[indexOfSubSection]
    );
  }
  reportTemplate.routes[indexOfSectionB].children = filteredSectionBChildren;

  // Section C
  const indexOfSectionC = reportTemplate.routes.findIndex((route: any) =>
    route.name.includes("C:")
  );
  const filteredSectionCChildren: any = [];
  for (const route of routesToInclude.sectionC) {
    const indexOfSubSection = reportTemplate.routes[
      indexOfSectionC
    ].children.findIndex((subSection: any) => subSection.name === route);
    filteredSectionCChildren.push(
      reportTemplate.routes[indexOfSectionC].children[indexOfSubSection]
    );
  }
  reportTemplate.routes[indexOfSectionC].children = filteredSectionCChildren;

  // Section D
  const indexOfSectionD = reportTemplate.routes.findIndex((route: any) =>
    route.name.includes("D:")
  );
  const filteredSectionDChildren: any = [];
  for (const route of routesToInclude.sectionD) {
    const indexOfSubSection = reportTemplate.routes[
      indexOfSectionD
    ].children.findIndex((subSection: any) => subSection.name === route);
    filteredSectionDChildren.push(
      reportTemplate.routes[indexOfSectionD].children[indexOfSubSection]
    );
  }
  reportTemplate.routes[indexOfSectionD].children = filteredSectionDChildren;

  // Section E
  const indexOfSectionE = reportTemplate.routes.findIndex((route: any) =>
    route.name.includes("E:")
  );
  delete reportTemplate.routes[indexOfSectionE];

  reportTemplate.entities = filteredEntities;
  return reportTemplate;
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
