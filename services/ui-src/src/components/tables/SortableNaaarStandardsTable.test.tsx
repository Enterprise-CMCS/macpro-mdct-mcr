import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { SortableNaaarStandardsTable } from "components";
// utils
import { useStore } from "utils";
import {
  mockNaaarReportStore,
  mockNaaarStandards,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";
// types
import { FormJson } from "types";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockNaaarReportStore,
});

const mockOpenDeleteEntityModal = jest.fn();
const mockOpenRowDrawer = jest.fn();

const sortableTableComponent = (
  <RouterWrappedComponent>
    <SortableNaaarStandardsTable
      entities={mockNaaarStandards}
      openRowDrawer={mockOpenRowDrawer}
      openDeleteEntityModal={mockOpenDeleteEntityModal}
    />
  </RouterWrappedComponent>
);

const primaryCareId = "standard_coreProviderType-UZK4hxPVnuYGcIgNzYFHCk"; // pragma: allowlist secret
const mockDrawerForm = {
  id: "danas",
  fields: [
    {
      id: "standard_coreProviderType",
      type: "radio",
      validation: "radio",
      props: {
        choices: [
          {
            id: primaryCareId,
            label: "Primary care",
            children: [
              {
                id: primaryCareId,
                type: "text",
                validation: {
                  type: "text",
                  nested: true,
                  parentFieldName: "standard_coreProviderType",
                  parentOptionId: primaryCareId,
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as FormJson;

const completeStandard = {
  ...mockNaaarStandards[0],
  id: "complete-standard",
  standard_coreProviderType: [{ key: primaryCareId, value: "Primary care" }],
  [primaryCareId]: "Family physician",
};

const incompleteStandard = {
  ...mockNaaarStandards[0],
  id: "incomplete-standard",
  standard_coreProviderType: [{ key: primaryCareId, value: "Primary care" }],
};
delete (incompleteStandard as any)[primaryCareId];

const tableWithStatusComponent = (
  <RouterWrappedComponent>
    <SortableNaaarStandardsTable
      entities={[completeStandard, incompleteStandard]}
      drawerForm={mockDrawerForm}
      openRowDrawer={mockOpenRowDrawer}
      openDeleteEntityModal={mockOpenDeleteEntityModal}
    />
  </RouterWrappedComponent>
);

describe("<SortableNaaarStandardsTable /> status column", () => {
  test("does not render a status column without a drawer form", () => {
    render(sortableTableComponent);
    expect(
      screen.queryByRole("columnheader", { name: /Status/ })
    ).not.toBeInTheDocument();
    expect(screen.queryByAltText("warning icon")).not.toBeInTheDocument();
  });

  test("flags standards missing a required nested field", () => {
    render(tableWithStatusComponent);
    expect(screen.getByRole("columnheader", { name: /Status/ })).toBeVisible();
    expect(screen.getAllByAltText("complete icon")).toHaveLength(1);
    expect(screen.getAllByAltText("warning icon")).toHaveLength(1);
    expect(screen.getByText("Error")).toBeVisible();
    expect(screen.getByText("Complete")).toBeVisible();
  });

  testA11yAct(tableWithStatusComponent);
});

describe("<SortableNaaarStandardsTable />", () => {
  beforeEach(() => {
    render(sortableTableComponent);
  });
  test("Check that NAAAR table view renders", async () => {
    expect(
      screen.getByRole("table", {
        name: "Access and Network Adequacy Standards",
      })
    ).toBeVisible;
  });

  test("SortableNaaarStandardsTable opens the drawer upon clicking Edit", async () => {
    const editButton = screen.getByRole("button", { name: "Edit standard 1" });
    await act(async () => {
      await userEvent.click(editButton);
    });
    expect(mockOpenRowDrawer).toHaveBeenCalledTimes(1);
  });

  test("SortableNaaarStandardsTable opens the delete modal on click", async () => {
    const deleteButton = screen.getByRole("button", {
      name: "Delete standard 1",
    });
    await act(async () => {
      await userEvent.click(deleteButton);
    });
    expect(mockOpenDeleteEntityModal).toHaveBeenCalledTimes(1);
  });

  testA11yAct(sortableTableComponent);
});
