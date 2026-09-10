import { render, screen } from "@testing-library/react";
// components
import { ExportedReportFieldTable } from "components";
// types
import { DrawerReportPageShape, EntityType } from "types";
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
import { testA11yAct } from "utils/testing/commonTests";

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
  entityType: EntityType.PLANS,
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

const mockNumberedPageJson = {
  ...mockStandardReportPageJson,
  form: {
    id: "numbered",
    fields: [
      {
        ...mockFormField,
        id: "numberedField",
        props: {
          label: "D1.1 Numbered question",
        },
      },
    ],
  },
};

const mockMixedPageJson = {
  ...mockStandardReportPageJson,
  form: {
    id: "mixed",
    fields: [
      {
        ...mockFormField,
        id: "numberedField",
        props: {
          label: "D1.1 Numbered question",
        },
      },
      {
        ...mockFormField,
        id: "unnumberedField",
        props: {
          label: "Unnumbered question",
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

const pageWithGatingField = {
  ...mockDrawerReportPageJson,
  path: "/mcpar/plan-level-indicators/prior-authorization",
  form: {
    id: "dpa-gating",
    fields: [
      {
        id: "plan_priorAuthorizationReporting",
        type: "radio",
        validation: "radio",
        props: {
          label: "Are you reporting data prior to June 2026?",
          choices: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "Not reporting data" },
          ],
        },
      },
    ],
  },
  drawerForm: {
    id: "dpa",
    fields: [
      {
        id: "testField",
        type: "text",
        props: { label: "Test Field Label" },
      },
    ],
  },
};

describe("<ExportedReportFieldRow />", () => {
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

  test("includes drawerForm fields and renders gating radio answer for Prior Authorization", () => {
    mockedUseStore.mockReturnValue({
      ...mockMcparReportStore,
      report: {
        ...mockMcparReportStore.report!,
        fieldData: {
          plan_priorAuthorizationReporting: [
            { key: "plan_priorAuthorizationReporting-yes", value: "Yes" },
          ],
          plans: [{ id: "123", name: "Test Plan" }],
        },
      },
    });

    render(
      <ExportedReportFieldTable
        section={pageWithGatingField as DrawerReportPageShape}
      />
    );

    expect(
      screen.getByRole("cell", { name: "Test Field Label" })
    ).toBeVisible();

    // when present, gating radio answer renders correctly
    expect(
      screen.getByRole("row", {
        name: "Are you reporting data prior to June 2026? Yes",
      })
    ).toBeVisible();
  });

  test("omits the Number column when no field in the table has a question number", () => {
    render(exportedStandardTableComponent);
    expect(
      screen.queryByRole("columnheader", { name: "Number" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Indicator" })
    ).toBeVisible();
  });

  test("renders the Number column populated when a field has a question number", () => {
    render(<ExportedReportFieldTable section={mockNumberedPageJson} />);
    expect(screen.getByRole("columnheader", { name: "Number" })).toBeVisible();
    expect(
      screen.getByRole("row", { name: "D11 Numbered question Not answered" })
    ).toBeVisible();
  });

  test("renders a blank Number cell for unnumbered rows in a table with at least one numbered row", () => {
    render(<ExportedReportFieldTable section={mockMixedPageJson} />);
    expect(screen.getByRole("columnheader", { name: "Number" })).toBeVisible();
    expect(
      screen.getByRole("row", { name: "D11 Numbered question Not answered" })
    ).toBeVisible();
    expect(
      screen.getByRole("row", { name: "Unnumbered question Not answered" })
    ).toBeVisible();
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

  testA11yAct(exportedStandardTableComponent);
});
