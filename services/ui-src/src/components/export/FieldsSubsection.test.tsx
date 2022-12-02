import { FieldsSubsection } from "./FieldsSubsection";
import { render, cleanup } from "@testing-library/react";
import { axe } from "jest-axe";

afterEach(cleanup);

afterEach(() => {
  jest.clearAllMocks();
});

const mockContent = {
  path: "test",
  name: "test",
  form: {
    fields: [
      {
        id: "fieldId",
        type: "text",
        props: {
          label: "Test Label",
          hint: "Test Hint",
        },
      },
      {
        id: "fieldId2",
        type: "text",
        props: {
          label: "Test Label 2",
          hint: "Test Hint 2",
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
        id: "dynamicTest",
        type: "dynamic",
        props: {
          label: "label test",
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

describe("Fields Subsection", () => {
  test("Is Fields Subsection present with all optional fields", async () => {
    const { getByTestId } = render(<FieldsSubsection content={mockContent} />);
    const section = getByTestId("fieldsSubSection");
    expect(section).toBeVisible();
    const results = await axe(section);
    expect(results).toHaveNoViolations();
  });

  test("Is Fields Subsection present without optional fields", async () => {
    const { getByTestId } = render(
      <FieldsSubsection content={mockContentAlt} />
    );
    const section = getByTestId("fieldsSubSection");
    expect(section).toBeVisible();
    const results = await axe(section);
    expect(results).toHaveNoViolations();
  });
});
