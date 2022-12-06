import { cleanup, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ExportedReportSubsection } from "./ExportedReportSubsection";
// utils
import { mockStandardReportPageJson } from "utils/testing/setupJest";

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

const exportedReportSubsectionComponent = (
  <ExportedReportSubsection content={mockStandardReportPageJson} />
);

const exportedReportSubsectionAltComponent = (
  <ExportedReportSubsection content={mockContentAlt} />
);

afterEach(cleanup);

afterEach(() => {
  jest.clearAllMocks();
});

describe("ExportedReportSubsection", () => {
  test("Is ExportedReportSubsection present with all optional fields", () => {
    render(exportedReportSubsectionComponent);
    const section = screen.getByTestId("fieldsSubSection");
    expect(section).toBeVisible();
  });

  test("Is ExportedReportSubsection present without optional fields", () => {
    render(exportedReportSubsectionAltComponent);
    const section = screen.getByTestId("fieldsSubSection");
    expect(section).toBeVisible();
  });
});

describe("Test ExportedReportSubsection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(exportedReportSubsectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
