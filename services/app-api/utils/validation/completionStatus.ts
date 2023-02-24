import { CompletionData } from "../types/types";
import { validateFieldData } from "./validation";

export const calculateCompletionStatus = async (
  fieldData: any,
  routes: any[],
  validationJson: any
) => {
  //Calculates the completion for all provided routes
  let completionDict: CompletionData = {};
  if (routes) {
    for (const route of routes) {
      const routeCompletionDict = await calculateRouteCompletion(
        fieldData,
        route,
        validationJson
      );
      completionDict = { ...completionDict, ...routeCompletionDict };
    }
  }
  return completionDict;
};

const calculateRouteCompletion = async (
  fieldData: any,
  route: any,
  validationJson: any
) => {
  switch (route.pageType) {
    case "standard":
      return {
        [route.path]: await calculateFormCompletion(
          fieldData,
          route.form,
          validationJson
        ),
      };
    case "drawer":
    case "modalDrawer":
      return {
        [route.path]: await calculateEntityCompletion(
          fieldData,
          [route.drawerForm, route.modalForm],
          validationJson,
          route.entityType
        ),
      };
    case "reviewSubmit":
      return;
    default:
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
  var areAllFormsComplete = true;
  for (var formTemplate of formTemplates) {
    if (formTemplate) {
      for (var dataForEntity of reportData[entityType]) {
        const isEntityComplete = await calculateFormCompletion(
          dataForEntity,
          formTemplate,
          validationJson
        );
        areAllFormsComplete &&= isEntityComplete;
        if (!areAllFormsComplete) break;
      }
    }
    if (!areAllFormsComplete) break;
  }
  return areAllFormsComplete;
};

const calculateFormCompletion = async (
  reportData: any,
  formTemplate: any,
  validationJson: any
) => {
  let unvalidatedFields: Record<string, string> = {};
  formTemplate?.fields.forEach((field: any) => {
    unvalidatedFields[field.id] = reportData[field.id];
  });
  try {
    let validatedFields = await validateFieldData(
      validationJson,
      unvalidatedFields,
      true
    );
    return validatedFields !== undefined;
  } catch (err) {
    return false;
  }
};
