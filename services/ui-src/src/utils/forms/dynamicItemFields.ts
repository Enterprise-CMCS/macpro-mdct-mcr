import {
  GeomappingChildJson,
  PlanProviderChildJson,
  SecretShopperAppointmentAvailabilityChildJson,
} from "../../constants";
import { AnyObject, EntityType, FormJson } from "types";

// dynamically generate fields for choices
export const generateDrawerItemFields = (
  form: FormJson,
  items: AnyObject[],
  entityType: EntityType
) => {
  const fields = form.fields[0];
  return {
    ...form,
    fields: [
      {
        ...form.fields[0],
        props: {
          ...form.fields[0].props,
          choices: [
            ...updatedItemChoiceList(
              fields.props?.choices,
              availableItems(items, entityType),
              entityType
            ),
          ],
        },
      },
    ],
  };
};

export const generateAddEntityDrawerItemFields = (
  form: FormJson,
  items: AnyObject[],
  entityType: EntityType
) => {
  form.fields[3] = {
    ...form.fields[3],
    props: {
      ...form.fields[3].props,
      choices: [...availableItems(items, entityType)],
    },
  };
  return form;
};

export const generateAnalysisMethodChoices = (
  form: FormJson,
  items: AnyObject[]
) => {
  const standardTypeField = form.fields?.[1].props?.choices;
  for (let i = 0; i < standardTypeField.length; i++) {
    // handle additional fields for the last option
    const idx = i === standardTypeField.length - 1 ? 2 : 1;
    standardTypeField[i].children[idx].props.choices = items.map((item) => {
      return {
        id: `${item.id}`,
        label: item.name || item.custom_analysis_method_name,
      };
    });
  }
  return form;
};

const availableItems = (items: AnyObject[], entityType: string) => {
  const ilosFieldName = "plan_ilosUtilizationByPlan";
  const updatedItemChoices: AnyObject[] = [];
  items.forEach((item) => {
    if (entityType === EntityType.STANDARDS) {
      item = {
        ...item,
        id: item.key,
        name: item.value,
      };
      delete item.key;
      delete item.value;
    }
    updatedItemChoices.push({
      ...item,
      label: item.name,
      checked: false,
      ...(entityType === EntityType.ILOS && {
        children: [
          {
            id: `${ilosFieldName}_${item.id}`,
            type: "number",
            validation: {
              type: "number",
              nested: true,
              parentFieldName: `${ilosFieldName}`,
              parentOptionId: item.id,
            },
            props: {
              decimalPlacesToRoundTo: 0,
            },
          },
        ],
      }),
    });
  });
  return updatedItemChoices;
};

const updatedItemChoiceList = (
  choices: AnyObject[],
  itemChoices: AnyObject[],
  entityType: EntityType
) => {
  const updatedChoiceList: AnyObject[] = [];
  if (entityType === EntityType.PLANS) {
    choices.map((choice: AnyObject) => {
      updatedChoiceList.push(
        choice.children
          ? {
              ...choice,
              children: [
                choice.children[0],
                {
                  ...choice.children[1],
                  props: {
                    ...choice.children[1].props,
                    choices: [...itemChoices],
                  },
                },
              ],
            }
          : { ...choice }
      );
    });
  } else if (entityType === EntityType.STANDARDS) {
    itemChoices.map((choice: AnyObject) => {
      updatedChoiceList.push({
        ...choice,
      });
    });
  } else {
    choices.map((choice: AnyObject) => {
      updatedChoiceList.push(
        choice.children
          ? {
              ...choice,
              children: [
                {
                  ...choice.children[0],
                  props: {
                    ...choice.children[0].props,
                    choices: [...itemChoices],
                  },
                },
              ],
            }
          : { ...choice }
      );
    });
  }
  return updatedChoiceList;
};

function createIDForChildrenOfAnalysisMethod(obj: AnyObject, parentId: string) {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (key === "id") {
      const newId = `${parentId}_${value}`;
      obj[key] = newId;
      parentId = newId;
    }

    if (Array.isArray(value)) {
      for (let arrayObj of value) {
        createIDForChildrenOfAnalysisMethod(arrayObj, parentId);
      }
    } else if (typeof value === "object") {
      createIDForChildrenOfAnalysisMethod(value, parentId);
    }
  });
}
// dynamically filter by partialId to find the analysis methods
export const availableAnalysisMethods = (
  analysisMethodsFieldId: string,
  items: AnyObject[]
) => {
  const GeomappingJson = structuredClone(GeomappingChildJson);
  const SecretShopperJson = structuredClone(
    SecretShopperAppointmentAvailabilityChildJson
  );
  const PlanProviderJson = structuredClone(PlanProviderChildJson);
  const updatedItemChoices = items.map((item) => {
    const id = `${analysisMethodsFieldId}_${item.id}`;
    const analysisMethod = { id, label: item.name };
    switch (item.name) {
      case "Geomapping":
        createIDForChildrenOfAnalysisMethod(GeomappingJson, id);
        return { ...analysisMethod, children: GeomappingJson };
      case "Plan Provider Directory Review":
        createIDForChildrenOfAnalysisMethod(PlanProviderJson, id);
        return { ...analysisMethod, children: PlanProviderJson };
      case "Secret Shopper: Appointment Availability":
        createIDForChildrenOfAnalysisMethod(SecretShopperJson, id);
        return { ...analysisMethod, children: SecretShopperJson };
      default:
        return analysisMethod;
    }
  });
  return updatedItemChoices;
};
