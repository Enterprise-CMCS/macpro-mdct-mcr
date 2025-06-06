// types
import { DEFAULT_ANALYSIS_METHODS } from "../constants/constants";
import {
  AnyObject,
  CompletionData,
  FormJson,
  FieldChoice,
  Choice,
  FormField,
  ReportRoute,
  EntityType,
} from "../types";
// utils
import { validateFieldData } from "./completionValidation";

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
  formTemplate: AnyObject,
  validationSchema?: AnyObject
) => {
  // Parent Dictionary for holding all route completion status
  const validationJson = validationSchema ?? formTemplate.validationJson;

  const areFieldsValid = async (
    fieldsToBeValidated: Record<string, string>
  ) => {
    let areAllFieldsValid = false;
    try {
      // all fields successfully validated if validatedFields is not undefined
      areAllFieldsValid =
        (await validateFieldData(validationJson, fieldsToBeValidated)) !==
        undefined;
    } catch {
      // Silently ignore error, will result in false
    }
    return areAllFieldsValid;
  };

  const calculateFormCompletion = async (
    nestedFormTemplate: FormJson,
    dataForObject: AnyObject = fieldData
  ) => {
    // Build an object of k:v for fields to validate
    let fieldsToBeValidated: Record<string, string> = {};
    // Repeat fields can't be validated at same time, so holding their completion status here
    let repeatersValid = true; //default to true in case of no repeat fields

    const getNestedFields = (
      fieldChoices: FieldChoice[],
      selectedChoices: Choice[]
    ) => {
      let selectedChoicesIds = selectedChoices
        .map((choice: Choice) => choice.key)
        .map((choiceId: string) => choiceId?.split("-").pop());
      let selectedChoicesWithChildren = fieldChoices?.filter(
        (fieldChoice: FieldChoice) =>
          selectedChoicesIds.includes(fieldChoice.id) && fieldChoice.children
      );
      let fieldIds: string[] = [];
      selectedChoicesWithChildren?.forEach((selectedChoice: FieldChoice) => {
        selectedChoice.children?.forEach((childChoice: FormField) => {
          fieldIds.push(childChoice.id);
          if (childChoice.props?.choices && dataForObject?.[childChoice.id]) {
            let childFields = getNestedFields(
              childChoice.props?.choices,
              dataForObject[childChoice.id]
            );
            fieldIds.push(...childFields);
          }
        });
      });
      return fieldIds;
    };
    // Iterate over all fields in form
    for (var formField of nestedFormTemplate?.fields || []) {
      if (formField.repeat) {
        // This is a repeated field, and must be handled differently
        if (fieldData[formField.repeat] !== undefined)
          for (var repeatEntity of fieldData[formField.repeat]) {
            // Iterate over each entity from the repeat section, build new value id, and validate it
            repeatersValid &&= await areFieldsValid({
              [formField.id]:
                dataForObject[`${formField.id}_${repeatEntity.id}`],
            });
          }
        else {
          repeatersValid = false;
        }
      } else {
        // Key: Form Field ID, Value: Report Data for field
        if (Array.isArray(dataForObject[formField.id])) {
          let nestedFields: string[] = getNestedFields(
            formField.props?.choices,
            dataForObject[formField.id]
          );
          nestedFields?.forEach((nestedField: string) => {
            fieldsToBeValidated[nestedField] = dataForObject[nestedField]
              ? dataForObject[nestedField]
              : null;
          });
        }

        fieldsToBeValidated[formField.id] = dataForObject[formField.id]
          ? dataForObject[formField.id]
          : null;
      }
    }
    // Validate all fields en masse, passing flag that uses required validation schema
    return repeatersValid && (await areFieldsValid(fieldsToBeValidated));
  };

  const calculateEntityCompletion = async (
    nestedFormTemplates: FormJson[],
    entityType: EntityType
  ) => {
    //value for holding combined result
    var areAllFormsComplete = true;
    for (var nestedFormTemplate of nestedFormTemplates) {
      if (fieldData[entityType] && fieldData[entityType].length > 0) {
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
        // handle ILOS edge case: if there are no ILOS added, this section is not required; otherwise it is
        if (
          route.path === "/mcpar/plan-level-indicators/ilos" &&
          !fieldData["ilos"]?.length
        ) {
          routeCompletion = { [route.path]: true };
          return;
        }
        // handle Prior Authorization cases: if the user is not reporting prior to June 2026, this section is not required
        if (
          route.path === "/mcpar/state-level-indicators/prior-authorization" &&
          fieldData["state_priorAuthorizationReporting"]?.[0].value ===
            "Not reporting data"
        ) {
          routeCompletion = { [route.path]: true };
          return;
        }
        if (
          route.path === "/mcpar/plan-level-indicators/prior-authorization" &&
          fieldData["plan_priorAuthorizationReporting"]?.[0].value ===
            "Not reporting data"
        ) {
          routeCompletion = { [route.path]: true };
          return;
        }
        // handle Patient Access API case: if the user is not reporting prior to June 2026, this section is not required
        if (
          route.path === "/mcpar/plan-level-indicators/patient-access-api" &&
          fieldData["plan_patientAccessApiReporting"]?.[0].value ===
            "Not reporting data"
        ) {
          routeCompletion = { [route.path]: true };
          return;
        }
        routeCompletion = {
          [route.path]: await calculateEntityCompletion(
            [route.drawerForm],
            route.entityType
          ),
        };
        // handle Analysis Methods case: this section allows users to add custom methods, which use different form questions
        if (
          route.path ===
            "/naaar/state-and-program-information/analysis-methods" &&
          route.addEntityDrawerForm
        ) {
          let areAllFormsComplete = true;
          for (const entity of fieldData[route.entityType]) {
            // get completion status for entity, using the correct form template
            const applicableForm = DEFAULT_ANALYSIS_METHODS.includes(
              entity.name
            )
              ? route.drawerForm
              : route.addEntityDrawerForm;

            areAllFormsComplete = await calculateFormCompletion(
              applicableForm,
              entity
            );

            // if any form is incomplete, exit loop and return false
            if (!areAllFormsComplete) break;
          }
          routeCompletion = { [route.path]: areAllFormsComplete };
          break;
        }
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
      case "modalOverlay":
        if (!route.modalForm || !route.overlayForm) break;
        routeCompletion = {
          [route.path]: await calculateEntityCompletion(
            [route.modalForm, route.overlayForm],
            route.entityType
          ),
        };
        break;
      case "planOverlay": {
        let isComplete = false;

        if (route.path === "/naaar/plan-compliance") {
          const plans = fieldData.plans || [];
          isComplete =
            plans.length > 0 &&
            plans.every((plan: AnyObject) => plan.isComplete === true);
        }

        routeCompletion = { [route.path]: isComplete };
        break;
      }
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
