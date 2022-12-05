import { ExportedReportSubsection } from "./ExportedReportSubsection";
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
    id: "formId",
    fields: [
      {
        id: "fieldId",
        type: "text",
        validation: "test",
        props: {
          label: "Test Label",
          hint: "Test Hint",
        },
      },
      {
        id: "fieldId2",
        type: "text",
        validation: "test",
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
      section: "test",
    },
  },
};

const mockContentAlt = {
  path: "test",
  name: "test",
  form: {
    id: "formId",
    fields: [
      {
        id: "dynamicTest",
        type: "dynamic",
        validation: "test",
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
      section: "test",
      spreadsheet: "test",
    },
  },
};

describe("Fields Subsection", () => {
  test("Is Fields Subsection present with all optional fields", async () => {
    const { getByTestId } = render(
      <ExportedReportSubsection content={mockContent} />
    );
    const section = getByTestId("fieldsSubSection");
    expect(section).toBeVisible();
    const results = await axe(section);
    expect(results).toHaveNoViolations();
  });

  test("Is Fields Subsection present without optional fields", async () => {
    const { getByTestId } = render(
      <ExportedReportSubsection content={mockContentAlt} />
    );
    const section = getByTestId("fieldsSubSection");
    expect(section).toBeVisible();
    const results = await axe(section);
    expect(results).toHaveNoViolations();
  });
});
