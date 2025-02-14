import { AnyObject, FormJson } from "types";

// dynamically generate fields for choices
export const generateDrawerItemFields = (
  form: FormJson,
  items: AnyObject[],
  entityType: string
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
  entityType: string
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
        id: `standard_${item.id}`,
        label: item.name || item.custom_analysis_method_name,
      };
    });
  }
  return form;
};

const availableItems = (items: AnyObject[], entityType: string) => {
  const ilosFieldName = "plan_ilosUtilizationByPlan";
  const providerTypeFieldName = "standard_coreProviderTypeCoveredByStandard";
  const updatedItemChoices: AnyObject[] = [];
  items.forEach((item) => {
    if (entityType === "standards") {
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
      ...(entityType === "ilos"
        ? {
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
          }
        : entityType === "standards" && {
            children: [
              {
                id: `standard_${item.id}-otherText`,
                type: "text",
                validation: {
                  type: "textOptional",
                  nested: true,
                  parentFieldName: `${providerTypeFieldName}`,
                  parentOptionId: item.id,
                },
                props: {
                  label: "Specialist details (optional)",
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
  entityType: string
) => {
  const updatedChoiceList: AnyObject[] = [];
  if (entityType === "plan") {
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
  } else if (entityType === "standards") {
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
