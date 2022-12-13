import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ExportedReportSubsection } from "./ExportedReportSubsection";
import { ReportContext } from "components";
// utils
import { mockForm, mockStandardReportPageJson } from "utils/testing/setupJest";

const mockContext = {
  report: {
    fieldData: {
      test_dropdown: {
        value: "test_dropdown",
        label: "test_dropdown",
      },
      plans: [
        {
          id: "123-123-123-123",
          name: "plan 1",
          "mock-text-field": "test",
        },
      ],
    },
  },
};

const mockDrawerForm = {
  ...mockStandardReportPageJson,
  pageType: "drawer",
  drawerForm: mockForm,
};

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

const exportedReportSubsectionDrawerComponent = (context: any) => (
  <ReportContext.Provider value={context}>
    <ExportedReportSubsection content={mockDrawerForm} />
  </ReportContext.Provider>
);

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

  test("Is ExportedReportSubsection with present drawer form", () => {
    render(exportedReportSubsectionDrawerComponent(mockContext));
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
