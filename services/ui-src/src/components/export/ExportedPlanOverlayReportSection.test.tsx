import { screen, render } from "@testing-library/react";
// components
import { ExportedPlanOverlayReportSection } from "./ExportedPlanOverlayReportSection";
// constants
import {
  exceptionsStatus,
  nonComplianceStatus,
  nonCompliantLabels,
  planComplianceStandardKey,
} from "../../constants";
// types
import { EntityShape } from "types";
// utils
import { mockNaaarPlanCompliancePageJson } from "utils/testing/mockForm";
import { mockNaaarReportStore } from "utils/testing/mockZustand";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

jest.mock("../../utils/reports/entities", () => ({
  getFormattedEntityData: jest
    .fn()
    .mockReturnValue({ heading: "mock heading" }),
}));

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

  test("ExportedPlanOverlayReportSection displays compliance tables with plans but no response", () => {
    const notAnsweredText = "Not answered";
    render(exportedPlanOverlaySectionComponent);
    expect(
      screen.getAllByRole("row", {
        name: `${mockFormHeading1} ${mockFormHint1} ${notAnsweredText}`,
      })[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("row", {
        name: `${mockFormHeading2} ${mockFormHint2} ${notAnsweredText}`,
      })[0]
    ).toBeInTheDocument();
  });

  test("ExportedPlanOverlayReportSection displays non-compliance subsection for 438.68 when not compliant", () => {
    const reportWithComplianceAnswers = JSON.parse(
      JSON.stringify(mockNaaarReportStore)
    );
    // set up standards
    const standards = reportWithComplianceAnswers.report.fieldData.standards;
    standards[0].exceptionsNonCompliance = nonComplianceStatus;
    standards.push({
      ...standards[0],
      id: `${standards[0].id}-2`,
      exceptionsNonCompliance: exceptionsStatus,
    });

    // mark plan non-compliant for 438.68 and 438.206
    const plans = reportWithComplianceAnswers.report.fieldData.plans;
    plans[0] = {
      ...plans[0],
      planCompliance43868_assurance: [
        {
          key: "mockPlanComplianceAssuranceKey1",
          value: nonCompliantLabels["438.68"],
        },
      ],
      planCompliance438206_assurance: [
        {
          key: "mockPlanComplianceAssuranceKey2",
          value: nonCompliantLabels["438.206"],
        },
      ],
      [`${planComplianceStandardKey}-${standards[0].id}-mock-nonCompliance`]:
        "any value",
      [`${planComplianceStandardKey}-${standards[1].id}-mock-exceptions`]:
        "any value",
    };

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
    // mark plans compliant for 438.68
    reportWithComplianceAnswers.report.fieldData.plans[0].planCompliance43868_assurance =
      [
        {
          key: "mockPlanComplianceAssuranceKey1",
          value: "Yes, it is compliant",
        },
      ];
    // mark plans compliant for 438.206
    reportWithComplianceAnswers.report.fieldData.plans[0].planCompliance438206_assurance =
      [
        {
          key: "mockPlanComplianceAssuranceKey2",
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

  testA11yAct(exportedPlanOverlaySectionComponent);
});
