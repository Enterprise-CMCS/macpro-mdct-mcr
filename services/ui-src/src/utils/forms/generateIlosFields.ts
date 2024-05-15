import { AnyObject, FormField, FormJson, FormLayoutElement } from "types";

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
              availableIlos(ilos, fields)
            ),
          ],
        },
      },
    ],
  };
};

const availableIlos = (
  ilos: AnyObject[],
  fields: FormField | FormLayoutElement
) => {
  const updatedIlosChoices: AnyObject[] = [];
  ilos.forEach((item) => {
    updatedIlosChoices.push({
      ...item,
      label: item.name,
      checked: false,
      children: [
        {
          id: `${fields.id}-otherText`,
          type: "number",
          validation: {
            type: "number",
            nested: true,
            parentFieldName: fields.id,
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
