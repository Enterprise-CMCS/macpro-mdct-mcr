import {
  CompletionData,
  AnyObject,
  ReportRoute,
  FormJson,
  Choice,
  FieldChoice,
} from "../types/types";
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

  const areFieldsValid = async (
    fieldsToBeValidated: Record<string, string>,
    required: boolean
  ) => {
    let areAllFieldsValid = false;
    try {
      // all fields successfully validated if validatedFields is not undefined
      areAllFieldsValid =
        (await validateFieldData(
          validationJson,
          fieldsToBeValidated,
          required
        )) !== undefined;
    } catch (err) {
      // Silently ignore error, will result in false
    }
    return areAllFieldsValid;
  };

  const calculateFormCompletion = async (
    nestedFormTemplate: FormJson,
    dataForObject: AnyObject = fieldData,
    required: boolean = true
  ) => {
    // Build an object of k:v for fields to validate
    let fieldsToBeValidated: Record<string, string> = {};
    // Repeat fields can't be validated at same time, so holding their completion status here
    let repeatersValid = true; //default to true in case of no repeat fields
    let childrenValid = true; //default to true in case of no children

    // Iterate over all fields in form
    for (var formField of nestedFormTemplate.fields || []) {
      if (formField.repeat) {
        // This is a repeated field, and must be handled differently
        for (var repeatEntity of fieldData[formField.repeat]) {
          // Iterate over each entity from the repeat section, build new value id, and validate it
          repeatersValid &&= await areFieldsValid(
            {
              [formField.id]:
                dataForObject[`${formField.id}_${repeatEntity.id}`],
            },
            required
          );
        }
      } else {
        // Key: Form Field ID, Value: Report Data for field
        if (formField.id == "state_encounterDataValidationEntity"){
          console.log(formField.id)
        }
        if (Array.isArray(dataForObject[formField.id])) {
          childrenValid &&= await calculateChildrenCompletion(
            dataForObject[formField.id],
            formField.props?.choices
          );
        }
        //TODO If
        fieldsToBeValidated[formField.id] = dataForObject[formField.id];

        console.log("breakpoint")
      }
    }

    // Validate all fields en masse, passing flag that uses required validation schema
    return (
      repeatersValid &&
      childrenValid &&
      areFieldsValid(fieldsToBeValidated, required)
    );
  };

  const calculateChildrenCompletion = async (
    selectedChoices: Choice[],
    fieldChoice: FieldChoice[]
  ) => {
    let areAllChildrenValid = true;
    let selectedChoicesIds = selectedChoices
      .map((choice: Choice) => choice.key)
      .map((choiceId: string) => choiceId?.split("-").pop());
    let selectedChoicesWithChildren = fieldChoice?.filter(
      (fieldChoice: FieldChoice) =>
        selectedChoicesIds.includes(fieldChoice.id) && fieldChoice.children
    );
    
    if (selectedChoices.length > 1)
      selectedChoicesWithChildren.forEach((child: any) =>
        console.log(selectedChoicesIds, child.children)
      );

    // let selectedOption = dataForObject[formField.id]
    return areAllChildrenValid;
  };

  const calculateEntityCompletion = async (
    nestedFormTemplates: FormJson[],
    entityType: string
  ) => {
    //value for holding combined result
    var areAllFormsComplete = true;
    for (var nestedFormTemplate of nestedFormTemplates) {
      if (fieldData[entityType]) {
        // iterate over each entity (eg access measure)
        for (var dataForEntity of fieldData[entityType]) {
          // get completion status for entity, using the correct form template
          const isEntityComplete = await calculateFormCompletion(
            nestedFormTemplate,
            dataForEntity
          );
          // update combined result
          areAllFormsComplete &&= isEntityComplete;
        }
      } else {
        //Entity not present in report data, so check to see if it is required and update combined result
        areAllFormsComplete &&=
          formTemplate.entities && !formTemplate.entities[entityType]?.required;
      }
    }
    return areAllFormsComplete;
  };

  const calculateRouteCompletion = async (route: ReportRoute) => {
    let routeCompletion;
    // Determine which type of page we are calculating status for
    switch (route.pageType) {
      case "standard":
        if (!route.form) break;
        // Standard forms use simple validation
        routeCompletion = {
          [route.path]: await calculateFormCompletion(route.form),
        };
        break;
      case "drawer":
        if (!route.drawerForm) break;
        routeCompletion = {
          [route.path]: await calculateEntityCompletion(
            [route.drawerForm],
            route.entityType
          ),
        };
        break;
      case "modalDrawer":
        if (!route.drawerForm || !route.modalForm) break;
        routeCompletion = {
          [route.path]: await calculateEntityCompletion(
            [route.drawerForm, route.modalForm],
            route.entityType
          ),
        };
        break;
      case "reviewSubmit":
        // Don't evaluate the review and submit page
        break;
      default:
        if (!route.children) break;
        // Default behavior indicates that we are not on a form to be evaluated, which implies we have child routes to evaluate
        routeCompletion = {
          [route.path]: await calculateRoutesCompletion(route.children),
        };
        break;
    }
    return routeCompletion;
  };

  const calculateRoutesCompletion = async (routes: ReportRoute[]) => {
    var completionDict: CompletionData = {};
    // Iterate over each route
    for (var route of routes || []) {
      // Determine the status of each child in the route
      const routeCompletionDict = await calculateRouteCompletion(route);
      // Add completion status to parent dictionary
      completionDict = { ...completionDict, ...routeCompletionDict };
    }
    return completionDict;
  };

  return await calculateRoutesCompletion(formTemplate.routes);
};
