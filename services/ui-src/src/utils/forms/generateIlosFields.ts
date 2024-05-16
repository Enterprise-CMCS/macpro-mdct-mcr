import { AnyObject, FormJson } from "types";

export const generateIlosFields = (form: FormJson, ilos: AnyObject[]) => {
  const fields = form.fields[0];
  return {
    ...form,
    fields: [
      {
        ...form.fields[0],
        props: {
          ...form.fields[0].props,
          choices: [
            ...updatedIlosChoiceList(
              fields.props?.choices,
              availableIlos(ilos)
            ),
          ],
        },
      },
    ],
  };
};

const availableIlos = (ilos: AnyObject[]) => {
  const updatedIlosChoices: AnyObject[] = [];
  ilos.forEach((item) => {
    updatedIlosChoices.push({
      ...item,
      label: item.name,
      checked: false,
      children: [
        {
          id: `plan_ilosUtilizationOfferedByPlan-otherText-${item.id}`,
          type: "number",
          validation: {
            type: "number",
            nested: true,
            parentFieldName: "plan_ilosUtilizationOfferedByPlan",
          },
          props: {
            decimalPlacesToRoundTo: 0,
          },
        },
      ],
    });
  });
  return updatedIlosChoices;
};

const updatedIlosChoiceList = (
  choices: AnyObject[],
  ilosChoices: AnyObject[]
) => {
  const updatedChoiceList: AnyObject[] = [];
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
                  choices: [...ilosChoices],
                },
              },
            ],
          }
        : { ...choice }
    );
  });
  return updatedChoiceList;
};
