import { AnyObject, FormJson } from "types";

// first attempt to combine ilos and plans functions

export const generateDrawerItemFields = (
  form: FormJson,
  items: AnyObject[],
  itemType: string
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
              availableItems(items),
              itemType
            ),
          ],
        },
      },
    ],
  };
};

export const parentFieldName = (itemType: string) => {
  if (itemType === "plan") {
    return "analysis_applicable";
  } else {
    return "plan_ilosUtilizationByPlan";
  }
};

const availableItems = (items: AnyObject[]) => {
  const updatedItemChoices: AnyObject[] = [];
  items.forEach((item) => {
    updatedItemChoices.push({
      ...item,
      label: item.name,
      checked: false,
      children: [
        {
          id: `${parentFieldName}_${item.id}`,
          type: "number",
          validation: {
            type: "number",
            nested: true,
            parentFieldName: `${parentFieldName}`,
            parentOptionId: item.id,
          },
          props: {
            decimalPlacesToRoundTo: 0,
          },
        },
      ],
    });
  });
  return updatedItemChoices;
};

const updatedItemChoiceList = (
  choices: AnyObject[],
  itemChoices: AnyObject[],
  itemType: string
) => {
  const updatedChoiceList: AnyObject[] = [];
  if (itemType === "plan") {
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
