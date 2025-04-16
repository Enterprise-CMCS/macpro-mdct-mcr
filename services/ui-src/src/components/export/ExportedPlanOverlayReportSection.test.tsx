import { screen, render } from "@testing-library/react";
// components
import { ExportedPlanOverlayReportSection } from "./ExportedPlanOverlayReportSection";
// types
import { EntityShape } from "types";
// utils
import { mockNaaarPlanCompliancePageJson } from "utils/testing/mockForm";
import { mockNaaarReportStore } from "utils/testing/mockZustand";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const exportedPlanOverlaySectionComponent = (
  <ExportedPlanOverlayReportSection section={mockNaaarPlanCompliancePageJson} />
);

const sectionName = mockNaaarPlanCompliancePageJson.name;
const plans = mockNaaarReportStore.report!.fieldData.plans;
const planNames = plans.map((plan: EntityShape) => plan.name);

describe("<ExportedPlanOverlayReportSection />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseStore.mockReturnValue(mockNaaarReportStore);
  });

  test("ExportedPlanOverlayReportSection component renders nothing when no plans exist", () => {
    const reportWithNoPlans = {
      ...mockNaaarReportStore,
      report: {
        ...mockNaaarReportStore.report,
        fieldData: {
          ...mockNaaarReportStore.report!.fieldData,
          plans: undefined,
        },
      },
    };
    mockedUseStore.mockReturnValue(reportWithNoPlans);

    render(exportedPlanOverlaySectionComponent);
    expect(screen.queryByText(sectionName)).not.toBeInTheDocument();
    for (const planName of planNames) {
      expect(screen.queryByText(planName)).not.toBeInTheDocument();
    }
  });

  test("ExportedPlanOverlayReportSection displays report plans", () => {
    render(exportedPlanOverlaySectionComponent);
    for (const planName of planNames) {
      expect(
        screen.getByRole("heading", { name: planName })
      ).toBeInTheDocument();
    }
  });

  testA11y(exportedPlanOverlaySectionComponent);
});
