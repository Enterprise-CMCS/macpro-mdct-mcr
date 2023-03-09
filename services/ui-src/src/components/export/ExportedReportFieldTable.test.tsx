import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import {
  mockDrawerReportPageJson,
  mockFormField,
  mockNestedFormField,
  mockMcparReportContext,
  mockStandardReportPageJson,
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
mockStandardContext.report.fieldData = {
  ...mockStandardContext.report.fieldData,
  ...fieldData,
};

const mockDrawerContext = { ...mockMcparReportContext };
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
});

describe("Test ExportedReportFieldRow accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(exportedStandardTableComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
