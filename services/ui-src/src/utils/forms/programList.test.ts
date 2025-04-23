import { addProgramNameTextField } from "utils";

const mockProgramListForm = {
  id: "mock-id",
  props: {},
  fields: [
    {
      id: "programName",
      props: {
        options: "programList",
      },
      type: "dropdown",
      validation: "dropdown",
    },
  ],
};

const programNameOtherText = {
  id: "programName-otherText",
  type: "text",
  validation: "text",
  props: { label: "Specify a new program name" },
};

describe("addProgramNameTextField()", () => {
  const result = addProgramNameTextField(mockProgramListForm);
  it("should splice in an other text field for the form", () => {
    expect(result.fields.length).toBe(2);
    expect(result.fields[1]).toStrictEqual(programNameOtherText);
  });
});
