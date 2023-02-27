import { AnyObject } from "yup/lib/types";
import { CompletionData } from "../types/types";
import { validateFieldData } from "./validation";

// Entry point for calculating completion status
export const calculateCompletionStatus = async (
  fieldData: any,
  routes: any[],
  validationJson: any
) => {
  // Parent Dictionary for holding all route completion status
  let completionDict: CompletionData = {};

  // Iterate over each route
  for (const route of routes) {
    // Determine the status of each child in the route
    const routeCompletionDict = await calculateRouteCompletion(
      fieldData,
      route,
      validationJson
    );
    // Add completion status to parent dictionary
    completionDict = { ...completionDict, ...routeCompletionDict };
  }
  return completionDict;
};

// Entry point for calculating a routes status, can be called recursively
const calculateRouteCompletion = async (
  fieldData: any,
  route: any,
  validationJson: any
) => {
  // Determine which type of page we are calculating status for
  switch (route.pageType) {
    case "standard":
      // Standard forms use simple validation
      return {
        [route.path]: await calculateFormCompletion(
          fieldData,
          route.form,
          validationJson
        ),
      };
    case "drawer":
    case "modalDrawer":
      // Drawers and Modal Drawers are evaluated similarly, validated against a selected entity
      return {
        [route.path]: await calculateEntityCompletion(
          fieldData,
          [route.drawerForm, route.modalForm],
          validationJson,
          route.entityType
        ),
      };
    case "reviewSubmit":
      // Don't evaluate the review and submit page
      return;
    default:
      // Default behavior indicates that we are not on a form to be evaluated, which implies we have child routes to evaluate
      return {
        [route.path]: await calculateCompletionStatus(
          fieldData,
          route.children,
          validationJson
        ),
      };
  }
};

const calculateEntityCompletion = async (
  reportData: any,
  formTemplates: any[],
  validationJson: any,
  entityType: string
) => {
  //value for holding combined result
  var areAllFormsComplete = true;
  // iterate over form templates
  for (var formTemplate of formTemplates) {
    //if valid formTemplate and data for entity
    if (formTemplate && reportData[entityType]) {
      // iterate over each entity (eg access measure)
      for (var dataForEntity of reportData[entityType]) {
        // get completion status for entity, using the correct form template
        const isEntityComplete = await calculateFormCompletion(
          dataForEntity,
          formTemplate,
          validationJson,
          reportData
        );
        // update combined result, breaking if the entity is not complete
        areAllFormsComplete &&= isEntityComplete;
        if (!areAllFormsComplete) break;
      }
    }
    // Break if the form is not complete
    if (!areAllFormsComplete) break;
  }
  return areAllFormsComplete;
};

const calculateFormCompletion = async (
  reportData: any,
  formTemplate: any,
  validationJson: any,
  rootData: AnyObject = reportData
) => {
  // Build an object of k:v for fields to validate
  let fieldsToBeValidated: Record<string, string> = {};
  // Repeat fields can't be validated at same time, so holding their completion status here
  let repeatersValid = true; //default to true in case of no repeat fields

  const areFieldsValid = async (
    fieldsToBeValidated: Record<string, string>
  ) => {
    try {
      let validatedFields: any = await validateFieldData(
        validationJson,
        fieldsToBeValidated,
        true
      );
      // all fields successfully validated if validatedFields is not undefined
      return validatedFields !== undefined;
    } catch (err) {
      // Validation error occurred, return false
      return false;
    }
  };

  // Iterate over all fields in form
  if (formTemplate?.fields) {
    for (var formField of formTemplate.fields) {
      if (formField.repeat) {
        // This is a repeated field, and must be handled differently
        for (var repeatEntity of rootData[formField.repeat]) {
          // Iterate over each entity from the repeat section, build new value id, and validate it
          repeatersValid &&= await areFieldsValid({
            [formField.id]: reportData[`${formField.id}_${repeatEntity.id}`],
          });
        }
      } else {
        // Key: Form Field ID, Value: Report Data for field
        fieldsToBeValidated[formField.id] = reportData[formField.id];
      }
    }
  }

  // Validate all fields en masse, passing flag that uses required validation schema
  return repeatersValid && areFieldsValid(fieldsToBeValidated);
};
