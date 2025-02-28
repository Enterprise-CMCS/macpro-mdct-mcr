import { render, screen } from "@testing-library/react";
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
    <SortableNaaarStandardsTable entities={mockStandards} />
  </RouterWrappedComponent>
);

describe("Test SortableNaaarStandardsTable component", () => {
  test("Check that NAAAR table view renders", async () => {
    render(sortableTableComponent);
    expect(screen.getByText("mock-population")).toBeVisible;
  });

  testA11y(sortableTableComponent);
});
