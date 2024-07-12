import { AnyObject, EntityShape, FormJson } from "types";

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
          id: `plan_ilosUtilizationByPlan_${item.id}`,
          type: "number",
          validation: {
            type: "number",
            nested: true,
            parentFieldName: "plan_ilosUtilizationByPlan",
            parentOptionId: item.id,
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

// if reporting on ILOS, verify that its questions are completed
export const isIlosCompleted = (
  reportingOnIlos: boolean,
  entity: EntityShape
) => {
  let isIlosCompleted = false;
  if (
    (reportingOnIlos && entity["plan_ilosOfferedByPlan"]) ||
    entity["plan_ilosUtilizationByPlan"]
  ) {
    isIlosCompleted = entity["plan_ilosOfferedByPlan"][0].value.startsWith(
      "Yes"
    )
      ? entity["plan_ilosUtilizationByPlan"].length > 0
      : entity["plan_ilosOfferedByPlan"][0];
  }
  return isIlosCompleted;
};
