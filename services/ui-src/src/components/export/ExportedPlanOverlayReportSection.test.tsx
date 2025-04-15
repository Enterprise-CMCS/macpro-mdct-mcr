import { screen, render } from "@testing-library/react";
// components
import { ExportedPlanOverlayReportSection } from "./ExportedPlanOverlayReportSection";
// constants
import { nonCompliantLabel } from "../../constants";
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

const mockForm1 = mockNaaarPlanCompliancePageJson.details.forms[0].verbiage;
const mockForm2 = mockNaaarPlanCompliancePageJson.details.forms[1].verbiage;
const mockFormHeading1 = mockForm1.heading;
const mockFormHint1 = mockForm1.hint;
const mockFormHeading2 = mockForm2.heading;
const mockFormHint2 = mockForm2.hint;

describe("<ExportedPlanOverlayReportSection />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseStore.mockReturnValue(mockNaaarReportStore);
  });

  test("ExportedPlanOverlayReportSection component renders nothing when no plans exist", () => {
    const reportWithNoPlans = JSON.parse(JSON.stringify(mockNaaarReportStore));
    reportWithNoPlans.report.fieldData.plans = undefined;
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

  test("ExportedPlanOverlayReportSection displays compliance tables", () => {
    render(exportedPlanOverlaySectionComponent);
    expect(
      screen.getAllByRole("row", {
        name: `${mockFormHeading1} ${mockFormHint1}`,
      })[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("row", {
        name: `${mockFormHeading2} ${mockFormHint2}`,
      })[0]
    ).toBeInTheDocument();
  });

  test("ExportedPlanOverlayReportSection displays non-compliance subsection for 438.68 when not compliant", () => {
    const reportWithComplianceAnswers = JSON.parse(
      JSON.stringify(mockNaaarReportStore)
    );
    reportWithComplianceAnswers.report.fieldData.plans[0].planCompliance43868_assurance =
      [
        {
          key: "mockPlanComplianceAssuranceKey1",
          value: nonCompliantLabel,
        },
      ];
    mockedUseStore.mockReturnValue(reportWithComplianceAnswers);

    render(exportedPlanOverlaySectionComponent);
    expect(
      screen.getByRole("heading", {
        name: "Non-compliant standards for 438.68",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Exceptions standards for 438.68" })
    ).toBeInTheDocument();
  });

  test("ExportedPlanOverlayReportSection does not display non-compliance subsection for 438.68 when compliant", () => {
    const reportWithComplianceAnswers = JSON.parse(
      JSON.stringify(mockNaaarReportStore)
    );
    reportWithComplianceAnswers.report.fieldData.plans[0].planCompliance43868_assurance =
      [
        {
          key: "mockPlanComplianceAssuranceKey1",
          value: "Yes, it is compliant",
        },
      ];
    mockedUseStore.mockReturnValue(reportWithComplianceAnswers);

    render(exportedPlanOverlaySectionComponent);
    expect(
      screen.queryByRole("heading", {
        name: "Non-compliant standards for 438.68",
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Exceptions standards for 438.68" })
    ).not.toBeInTheDocument();
  });

  testA11y(exportedPlanOverlaySectionComponent);
});
