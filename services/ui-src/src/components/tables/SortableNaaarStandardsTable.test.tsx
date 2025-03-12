import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { SortableNaaarStandardsTable } from "components";
// utils
import { useStore } from "utils";
import {
  mockNaaarReportStore,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { testA11y } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockNaaarReportStore,
});

const mockOpenDeleteEntityModal = jest.fn();
const mockOpenRowDrawer = jest.fn();

const mockStandards = [
  {
    id: "mock-id",
    standard_coreProviderTypeCoveredByStandard: [
      { key: "mock-key", value: "mock-provider" },
    ],
    standard_standardType: [{ key: "mock-key", value: "mock-standard" }],
    standard_standardDescription: "mock standard description",
    standard_analysisMethodsUtilized: [
      {
        key: "mock-key",
        value: "mock method",
      },
    ],
    standard_populationCoveredByStandard: [
      { key: "mock-key", value: "mock-population" },
    ],
    standard_applicableRegion: [{ key: "mock-key", value: "mock-region" }],
  },
];

const sortableTableComponent = (
  <RouterWrappedComponent>
    <SortableNaaarStandardsTable
      entities={mockStandards}
      openRowDrawer={mockOpenRowDrawer}
      openDeleteEntityModal={mockOpenDeleteEntityModal}
    />
  </RouterWrappedComponent>
);

describe("Test SortableNaaarStandardsTable component", () => {
  beforeEach(() => {
    render(sortableTableComponent);
  });
  test("Check that NAAAR table view renders", async () => {
    expect(screen.getByText("mock-population")).toBeVisible;
  });

  test("SortableNaaarStandardsTable opens the drawer upon clicking Edit", async () => {
    const editButton = screen.getByRole("button", { name: "edit" });
    await userEvent.click(editButton);
    expect(mockOpenRowDrawer).toBeCalledTimes(1);
  });

  test("SortableNaaarStandardsTable opens the delete modal on click", async () => {
    const deleteButton = screen.getByRole("button", { name: "delete" });
    await userEvent.click(deleteButton);
    expect(mockOpenDeleteEntityModal).toBeCalledTimes(1);
  });

  testA11y(sortableTableComponent);
});
