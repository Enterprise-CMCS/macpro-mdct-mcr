import { FieldsSubsection } from "./FieldsSubsection";
import { render } from "@testing-library/react";

const mockContent = {
  path: "test",
  name: "test",
  form: {
    fields: [
      {
        id: "fieldId",
        props: {
          type: "dynamic",
          label: "Test Label",
          hint: "Test Hint",
        },
      },
      {
        id: "fieldId",
        props: {
          label: "Test Label",
          hint: "Test Hint",
        },
      },
    ],
  },
  verbiage: {
    intro: {
      subsection: "test",
      info: "test",
      spreadsheet: "test",
    },
  },
};

const mockContentAlt = {
  path: "test",
  name: "test",
  form: {
    fields: [
      {
        id: "fieldId",
      },
    ],
  },
};

describe("Fields Subsection", () => {
  test("Is Fields Subsection present with all optional fields", () => {
    const { getByTestId } = render(<FieldsSubsection content={mockContent} />);
    const section = getByTestId("fieldsSubSection");
    expect(section).toBeVisible();
  });
  test("Is Fields Subsection present without optional fields", () => {
    const { getByTestId } = render(
      <FieldsSubsection content={mockContentAlt} />
    );
    const section = getByTestId("fieldsSubSection");
    expect(section).toBeVisible();
  });
});
