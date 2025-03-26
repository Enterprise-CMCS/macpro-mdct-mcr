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
import { mapNaaarStandardsData } from "./SortableNaaarStandardsTable";
import { EntityShape } from "types";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockNaaarReportStore,
});

const mockOpenDeleteEntityModal = jest.fn();
const mockOpenRowDrawer = jest.fn();

const mockStandards: EntityShape[] = [
  {
    id: "mockStandard",
    "standard_standardDescription-mockId": "Mock Description",
    "standard_analysisMethodsUtilized-mockId": [
      { key: "mockAnalysis1", value: "Mock Method 1" },
      { key: "mockAnalysis2", value: "Mock Method 2" },
    ],
    standard_coreProviderTypeCoveredByStandard: [
      { key: "mockProviderType-mockId", value: "Mock Provider" },
    ],
    "standard_coreProviderTypeCoveredByStandard-mockId-otherText":
      "Mock Other Provider",
    standard_standardType: [
      { key: "mockStandardType", value: "Mock Standard Type" },
    ],
    standard_populationCoveredByStandard: [
      { key: "mockPopulation", value: "Mock Population" },
    ],
    standard_applicableRegion: [{ key: "mockRegion", value: "Other, specify" }],
    "standard_applicableRegion-otherText": "Mock Other Region",
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

describe("<SortableNaaarStandardsTable />", () => {
  describe("Test SortableNaaarStandardsTable component", () => {
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
      const editButton = screen.getByRole("button", { name: "Edit" });
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

  describe("mapNaaarStandardsData()", () => {
    test("returns correct data shape", () => {
      const tableData = mapNaaarStandardsData(mockStandards);
      const expectedData = [
        {
          count: 1,
          provider: "Mock Provider; Mock Other Provider",
          standardType: "Mock Standard Type",
          description: "Mock Description",
          analysisMethods: "Mock Method 1, Mock Method 2",
          population: "Mock Population",
          region: "Mock Other Region",
          entity: mockStandards[0],
        },
      ];

      expect(tableData).toEqual(expectedData);
    });

    test("omits undefined properties", () => {
      const incompleteData: EntityShape[] = [
        {
          id: "mockStandard",
          standard_coreProviderTypeCoveredByStandard: [
            { key: "mockProviderType", value: "Mock Provider" },
          ],
          standard_standardType: [
            { key: "mockStandardType", value: "Mock Standard Type" },
          ],
          standard_populationCoveredByStandard: [
            { key: "mockPopulation", value: "Mock Population" },
          ],
        },
      ];
      const tableData = mapNaaarStandardsData(incompleteData);
      const expectedData = [
        {
          count: 1,
          provider: "Mock Provider",
          standardType: "Mock Standard Type",
          population: "Mock Population",
          entity: incompleteData[0],
        },
      ];

      expect(tableData).toEqual(expectedData);
    });
  });
});
