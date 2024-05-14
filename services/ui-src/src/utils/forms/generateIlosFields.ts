import { AnyObject, FormJson } from "types";

export const generateIlosFields = (form: FormJson, ilos: AnyObject[]) => {
  const fields = form.fields[0];

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

  const updatedChoiceList: AnyObject[] = [];
  fields.props?.choices.map((choice: AnyObject) => {
    updatedChoiceList.push(
      choice.children
        ? {
            ...choice,
            children: [
              {
                ...choice.children[0],
                props: {
                  ...choice.children[0].props,
                  choices: [...updatedIlosChoices],
                },
              },
            ],
          }
        : { ...choice }
    );
  });

  return {
    ...form,
    fields: [
      {
        ...form.fields[0],
        props: {
          ...form.fields[0].props,
          choices: [...updatedChoiceList],
        },
      },
    ],
  };
};
