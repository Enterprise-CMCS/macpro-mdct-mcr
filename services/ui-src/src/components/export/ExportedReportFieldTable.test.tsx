import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import {
  mockDrawerReportPageJson,
  mockFormField,
  mockNestedFormField,
  mockMcparReportContext,
  mockStandardReportPageJson,
  mockMlrReportContext,
} from "utils/testing/setupJest";
import { ReportContext } from "components";
import { ExportedReportFieldTable } from "./ExportedReportFieldTable";
import { DrawerReportPageShape } from "types";

// Contexts
const reportJsonFields = [{ ...mockNestedFormField, id: "parent" }];
const fieldData = {
  parent: [{ key: "parent-option3uuid", value: "option 3" }],
  child: "testAnswer",
};

const nestedParent = mockNestedFormField;
nestedParent.props.choices[2].children = [{ ...mockFormField, id: "child" }];

const mockStandardContext = { ...mockMcparReportContext };
mockStandardContext.report = { ...mockStandardContext.report };
mockStandardContext.report.fieldData = {
  ...mockStandardContext.report.fieldData,
  ...fieldData,
};

const mockDrawerContext = { ...mockMcparReportContext };
mockMcparReportContext.report = { ...mockMcparReportContext.report };
mockDrawerContext.report.fieldData = {
  ...mockDrawerContext.report.fieldData,
  plans: [
    {
      id: 123,
      name: "example-plan1",
      ...fieldData,
    },
    { id: 456, name: "example-plan2", ...fieldData },
  ],
};

// Report JSON
const mockStandardPageJson = {
  ...mockStandardReportPageJson,
  form: {
    id: "standard",
    fields: reportJsonFields,
  },
};
const mockDrawerPageJson = {
  ...mockDrawerReportPageJson,
  drawerForm: { id: "drawer", fields: reportJsonFields },
};
const mockEmptyPageJson = {
  ...mockStandardReportPageJson,
  form: {
    id: "standard",
    fields: [],
  },
};
const noHintJson = {
  ...mockStandardReportPageJson,
  form: {
    id: "apoc",
    fields: [
      {
        ...mockFormField,
        props: {
          label: "X. Mock Field label",
          hint: "Mock Hint Text",
        },
      },
    ],
  },
};

const hintJson = {
  ...mockStandardReportPageJson,
  form: {
    id: "not-apoc",
    fields: [
      {
        ...mockFormField,
        props: {
          label: "X. Mock Field label",
          hint: "Mock Hint Text",
        },
      },
    ],
  },
};

const exportedStandardTableComponent = (
  <ReportContext.Provider value={mockStandardContext}>
    <ExportedReportFieldTable section={mockStandardPageJson} />
  </ReportContext.Provider>
);
const exportedDrawerTableComponent = (
  <ReportContext.Provider value={mockDrawerContext}>
    <ExportedReportFieldTable
      section={mockDrawerPageJson as DrawerReportPageShape}
    />
  </ReportContext.Provider>
);
const emptyTableComponent = (
  <ReportContext.Provider value={mockDrawerContext}>
    <ExportedReportFieldTable section={mockEmptyPageJson} />
  </ReportContext.Provider>
);

const noHintComponent = (
  <ReportContext.Provider value={mockMlrReportContext}>
    <ExportedReportFieldTable section={noHintJson} />
  </ReportContext.Provider>
);

const hintComponent = (
  <ReportContext.Provider value={mockMlrReportContext}>
    <ExportedReportFieldTable section={hintJson} />
  </ReportContext.Provider>
);

describe("ExportedReportFieldRow", () => {
  test("Is present", async () => {
    render(exportedStandardTableComponent);
    const row = screen.getByTestId("exportTable");
    expect(row).toBeVisible();
  });

  test("handles drawer pages with children", async () => {
    render(exportedDrawerTableComponent);
    const row = screen.getByTestId("exportTable");
    expect(row).toBeVisible();
  });

  test("handles a table with no form fields", async () => {
    render(emptyTableComponent);
    const row = screen.getByTestId("exportTable");
    expect(row).toBeVisible();
  });

  test("shows the hint text in most cases", async () => {
    render(hintComponent);
    const hint = screen.queryByText(/Mock Hint Text/);
    expect(hint).toBeVisible();
  });

  test("hides the hint text within the Primary Contact section of MLR", async () => {
    render(noHintComponent);
    const hint = screen.queryByText(/Mock Hint Text/);
    expect(hint).not.toBeInTheDocument();
  });
});

describe("Test ExportedReportFieldRow accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(exportedStandardTableComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
