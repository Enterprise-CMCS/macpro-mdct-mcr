import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import {
  mockDrawerReportPageJson,
  mockFormField,
  mockNestedFormField,
  mockMcparReportContext,
  mockStandardReportPageJson,
  mockMlrReportStore,
  mockMcparReportStore,
  mockVerbiageIntro,
  mockDrawerForm,
} from "utils/testing/setupJest";
import { useStore } from "utils";
// components
import { ExportedReportFieldTable } from "components";
// types
import { DrawerReportPageShape } from "types";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockMcparReportStore,
});

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
      id: "123",
      name: "example-plan1",
      plan_ilosUtilizationByPlan: [],
      plan_ilosOfferedByPlan: [],
      ...fieldData,
    },
    {
      id: "456",
      name: "example-plan2",
      plan_ilosUtilizationByPlan: [],
      plan_ilosOfferedByPlan: [],
      ...fieldData,
    },
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
const mockMissingPlansPageJson = {
  name: "mock-route-2a",
  path: "/mcpar/plan-level-indicators/ilos",
  pageType: "drawer",
  entityType: "plans",
  verbiage: {
    intro: mockVerbiageIntro,
    dashboardTitle: "Mock dashboard title",
    drawerTitle: "Mock drawer title",
  },
  drawerForm: mockDrawerForm,
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
  <ExportedReportFieldTable section={mockStandardPageJson} />
);

const exportedDrawerTableComponent = (
  <ExportedReportFieldTable
    section={mockDrawerPageJson as DrawerReportPageShape}
  />
);

const exportedMissingEntitiesComponent = (
  <ExportedReportFieldTable
    section={mockMissingPlansPageJson as DrawerReportPageShape}
  />
);

const emptyTableComponent = (
  <ExportedReportFieldTable section={mockEmptyPageJson} />
);

const noHintComponent = <ExportedReportFieldTable section={noHintJson} />;

const hintComponent = <ExportedReportFieldTable section={hintJson} />;

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

  test("handles drawer pages with missing plans", async () => {
    const missingEntitiesStore = {
      ...mockMcparReportStore,
      report: {
        fieldData: {},
      },
    };
    mockedUseStore.mockReturnValue({
      ...missingEntitiesStore,
    });
    render(exportedMissingEntitiesComponent);
    const row = screen.getByTestId("missingEntityMessage");
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

  test("hides the hint text within MLR reports", async () => {
    mockedUseStore.mockReturnValue({
      ...mockMlrReportStore,
    });
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
