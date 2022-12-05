import { ExportedReportSubsection } from "./ExportedReportSubsection";
import { render, cleanup } from "@testing-library/react";
import { axe } from "jest-axe";
import { mockStandardReportPageJson } from "utils/testing/setupJest";

afterEach(cleanup);

afterEach(() => {
  jest.clearAllMocks();
});

const mockContentAlt = {
  ...mockStandardReportPageJson,
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

describe("ExportedReportSubsection", () => {
  test("Is ExportedReportSubsection present with all optional fields", async () => {
    const { getByTestId } = render(
      <ExportedReportSubsection content={mockStandardReportPageJson} />
    );
    const section = getByTestId("fieldsSubSection");
    expect(section).toBeVisible();
  });

  test("Is ExportedReportSubsection present without optional fields", async () => {
    const { getByTestId } = render(
      <ExportedReportSubsection content={mockContentAlt} />
    );
    const section = getByTestId("fieldsSubSection");
    expect(section).toBeVisible();
  });
});

describe("Test ExportedReportSubsection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { getByTestId } = render(
      <ExportedReportSubsection content={mockStandardReportPageJson} />
    );
    const section = getByTestId("fieldsSubSection");
    const results = await axe(section);
    expect(results).toHaveNoViolations();
  });
});
