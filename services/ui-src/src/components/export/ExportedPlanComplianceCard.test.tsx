import { render, screen } from "@testing-library/react";
// components
import { ExportedPlanComplianceCard } from "components";
// utils
import { mockNaaarReportStore } from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockNaaarReportStore,
});

const mockStandardFormattedData = {
  count: "1",
  standardType: "mock type",
  description: "mock description",
  provider: "mock provider",
  analysisMethods: "mock method 1, mock method 2",
  region: "mock region",
  population: "mock population",
};

const mockPlanFormattedData = {
  name: "mock plan",
};

const ExportedPlanComplianceCardComponent = (
  <ExportedPlanComplianceCard
    standardData={mockStandardFormattedData}
    planData={mockPlanFormattedData}
  />
);

describe("<ExportedPlanComplianceCard />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("Test ExportedPlanComplianceCard section displays all available information for standards and plans", () => {
    test("complete card", () => {
      render(ExportedPlanComplianceCardComponent);

      // standards
      const {
        count,
        standardType,
        description,
        provider,
        analysisMethods,
        region,
        population,
      } = mockStandardFormattedData;
      expect(screen.getByText(count)).toBeVisible();
      expect(screen.getByText(standardType)).toBeVisible();
      expect(screen.getByText(description)).toBeVisible();
      expect(screen.getByText(provider)).toBeVisible();
      expect(screen.getByText(analysisMethods)).toBeVisible();
      expect(screen.getByText(region)).toBeVisible();
      expect(screen.getByText(population)).toBeVisible();

      // plans

      // TODO: add back when other plan info is merged

      // expect(screen.getByText(mockPlanFormattedData.name)).toBeVisible();
    });
  });

  describe("Test ExportedPlanComplianceCard accessibility", () => {
    testA11y(ExportedPlanComplianceCardComponent);
  });
});
