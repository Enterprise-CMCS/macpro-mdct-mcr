import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ExportedReportSubsection } from "./ExportedReportSubsection";
import { ReportContext } from "components";
// utils
import {
  mockForm,
  mockFormField,
  mockStandardReportPageJson,
} from "utils/testing/setupJest";

const mockContext = {
  report: {
    fieldData: {
      test_dropdown: {
        value: "456-456-456-456",
        label: "test_dropdown",
      },
      plans: [
        {
          id: "123-123-123-123",
          name: "plan 1",
          "mock-text-field": "test",
        },
        {
          name: "test 3",
          id: "456-456-456-456",
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

const mockContentDropdown = {
  ...mockStandardReportPageJson,
  form: {
    ...mockForm,
    fields: [
      mockFormField,
      {
        id: "test_dropdown",
        type: "dropdown",
        validation: "dropdown",
        props: {
          options: "plans",
          label: "test label",
        },
      },
    ],
  },
};

const exportedReportSubsectionComponent = (
  <ExportedReportSubsection content={mockStandardReportPageJson} />
);

const exportedReportSubsectionAltComponent = (
  <ExportedReportSubsection content={mockContentAlt} />
);

const exportedReportSubsectionWithDropdownComponent = (context: any) => (
  <ReportContext.Provider value={context}>
    <ExportedReportSubsection content={mockContentDropdown} />
  </ReportContext.Provider>
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

  test("Is ExportedReportSubsection present with dropdown field", () => {
    render(exportedReportSubsectionWithDropdownComponent(mockContext));
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
