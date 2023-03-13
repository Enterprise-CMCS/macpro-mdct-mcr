import { AnyObject } from "yup/lib/types";
import { CompletionData } from "../types/types";
import { validateFieldData } from "./validation";

export const isComplete = (completionStatus: CompletionData): Boolean => {
  const flatten = (obj: AnyObject, out: AnyObject) => {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] == "object") {
        out = flatten(obj[key], out);
      } else {
        out[key] = obj[key];
      }
    });
    return out;
  };

  const flattenedStatus = flatten(completionStatus, {});

  for (const status in flattenedStatus) {
    if (flattenedStatus[status] === false) {
      return false;
    }
  }
  return true;
};

// Entry point for calculating completion status
export const calculateCompletionStatus = async (
  fieldData: AnyObject,
  formTemplate: AnyObject
) => {
  // Parent Dictionary for holding all route completion status

  const validationJson = formTemplate.validationJson;

  const calculateRoutesCompletion = async (routes: AnyObject[]) => {
    var completionDict: CompletionData = {};
    // Iterate over each route
    if (routes) {
      for (const route of routes) {
        // Determine the status of each child in the route
        const routeCompletionDict = await calculateRouteCompletion(route);
        // Add completion status to parent dictionary
        completionDict = { ...completionDict, ...routeCompletionDict };
      }
    }
    return completionDict;
  };

  const calculateRouteCompletion = async (route: any) => {
    // Determine which type of page we are calculating status for
    switch (route.pageType) {
      case "standard":
        // Standard forms use simple validation
        return {
          [route.path]: await calculateFormCompletion(route.form),
        };
      case "drawer":
      case "modalDrawer":
        // Drawers and Modal Drawers are evaluated similarly, validated against a selected entity
        return {
          [route.path]: await calculateEntityCompletion(
            [route.drawerForm, route.modalForm],
            route.entityType
          ),
        };
      case "reviewSubmit":
        // Don't evaluate the review and submit page
        return;
      default:
        // Default behavior indicates that we are not on a form to be evaluated, which implies we have child routes to evaluate
        return {
          [route.path]: await calculateRoutesCompletion(route.children),
        };
    }
  };

  const calculateEntityCompletion = async (
    nestedFormTemplates: any[],
    entityType: string
  ) => {
    //value for holding combined result
    var areAllFormsComplete = true;
    // iterate over form templates
    for (var nestedFormTemplate of nestedFormTemplates) {
      //if valid formTemplate and data for entity
      if (nestedFormTemplate) {
        if (fieldData[entityType]) {
          // iterate over each entity (eg access measure)
          for (var dataForEntity of fieldData[entityType]) {
            // get completion status for entity, using the correct form template
            const isEntityComplete = await calculateFormCompletion(
              nestedFormTemplate,
              dataForEntity
            );
            // update combined result, breaking if the entity is not complete
            areAllFormsComplete &&= isEntityComplete;
            if (!areAllFormsComplete) break;
          }
        } else {
          areAllFormsComplete &&= formTemplate.entities && !formTemplate.entities[entityType]?.required;
        }
      }
      // Break if the form is not complete
      if (!areAllFormsComplete) break;
    }
    return areAllFormsComplete;
  };

  const calculateFormCompletion = async (
    nestedFormTemplate: any,
    dataForObject: AnyObject = fieldData,
    required: boolean = true
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
          required
        );
        // all fields successfully validated if validatedFields is not undefined
        return validatedFields !== undefined;
      } catch (err) {
        // Validation error occurred, return false
        return false;
      }
    };

    // Iterate over all fields in form
    if (nestedFormTemplate.fields) {
      for (var formField of nestedFormTemplate.fields) {
        if (formField.repeat) {
          // This is a repeated field, and must be handled differently
          for (var repeatEntity of fieldData[formField.repeat]) {
            // Iterate over each entity from the repeat section, build new value id, and validate it
            repeatersValid &&= await areFieldsValid({
              [formField.id]:
                dataForObject[`${formField.id}_${repeatEntity.id}`],
            });
          }
        } else {
          // Key: Form Field ID, Value: Report Data for field
          fieldsToBeValidated[formField.id] = dataForObject[formField.id];
        }
      }
    }

    // Validate all fields en masse, passing flag that uses required validation schema
    return repeatersValid && areFieldsValid(fieldsToBeValidated);
  };

  return await calculateRoutesCompletion(formTemplate.routes);
};
