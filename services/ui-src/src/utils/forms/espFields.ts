import { FormJson } from "types";

export const generateEspFields = (form: FormJson) => {
  const fields = form.fields;

  const programNameOtherText = {
    id: "programName-otherText",
    type: "text",
    validation: "text",
    props: { label: "Specify a new program name" },
  };

  const isProgramReplacingExistingProgram = {
    id: "isProgramReplacingExistingProgram",
    type: "radio",
    validation: "radio",
    props: {
      label: "Is this program replacing an existing program?",
      choices: [
        {
          id: "lADqpRjlro1yEons8JG2E3IY",
          label: "Yes",
          children: [
            {
              id: "existingProgramBeingReplaced",
              type: "dropdown",
              validation: "dropdown",
              props: {
                label: "Program name",
                hint: "Select from an existing program name.",
                options: "programListWithoutOtherSpecify",
              },
            },
          ],
        },
        {
          id: "x4YQ4NTyo21hDbYk1Ffj4a19",
          label: "No",
        },
      ],
    },
  };

  fields.splice(1, 0, programNameOtherText);
  fields.splice(2, 0, isProgramReplacingExistingProgram);

  return {
    ...form,
    fields: fields,
  };
};

export const resetJson = (form: FormJson) => {
  const fields = form.fields;
  fields.splice(1, 2);
  return {
    ...form,
    fields: fields,
  };
};
