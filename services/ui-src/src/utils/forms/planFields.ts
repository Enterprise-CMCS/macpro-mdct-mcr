import { AnyObject, FormJson } from "types";

export const generatePlanFields = (form: FormJson, plan: AnyObject[]) => {
  const fields = form.fields[0];
  return {
    ...form,
    fields: [
      {
        ...form.fields[0],
        props: {
          ...form.fields[0].props,
          choices: [
            ...updatedPlanChoiceList(
              fields.props?.choices,
              availablePlans(plan)
            ),
          ],
        },
      },
    ],
  };
};

const availablePlans = (plan: AnyObject[]) => {
  const updatedPlanChoices: AnyObject[] = [];
  plan.forEach((item) => {
    updatedPlanChoices.push({
      ...item,
      label: item.name,
      checked: false,
      children: [
        {
          id: `analysis_applicable_${item.id}`,
          type: "number",
          validation: {
            type: "number",
            nested: true,
            parentFieldName: "analysis_applicable",
            parentOptionId: item.id,
          },
          props: {
            decimalPlacesToRoundTo: 0,
          },
        },
      ],
    });
  });
  return updatedPlanChoices;
};

const updatedPlanChoiceList = (
  choices: AnyObject[],
  planChoices: AnyObject[]
) => {
  const updatedChoiceList: AnyObject[] = [];
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
                  choices: [...planChoices],
                },
              },
            ],
          }
        : { ...choice }
    );
  });
  return updatedChoiceList;
};
