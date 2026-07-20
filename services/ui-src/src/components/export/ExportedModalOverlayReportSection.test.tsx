import { render, screen, within } from "@testing-library/react";
// components
import {
  ExportedModalOverlayReportSection,
  renderStatusIcon,
} from "./ExportedModalOverlayReportSection";
// types
import { EntityType, ModalOverlayReportPageShape } from "types";
// utils
import {
  mockMcparReportContext,
  mockMcparReportStore,
  mockMlrReportContext,
  mockMlrReportStore,
  mockModalOverlayReportPageJson,
  mockNaaarReportStore,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";
// verbiage
import mlrVerbiage from "verbiage/pages/mlr/mlr-export";

const mockMlrReportContextOther = Object.assign({}, mockMlrReportContext);

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const exportedMcparModalOverlayReportSectionComponent = (
  <ExportedModalOverlayReportSection
    section={{
      ...(mockModalOverlayReportPageJson as ModalOverlayReportPageShape),
      entityType: EntityType.PLANS,
    }}
  />
);

const exportedMlrModalOverlayReportSectionComponent = (
  <ExportedModalOverlayReportSection
    section={mockModalOverlayReportPageJson as ModalOverlayReportPageShape}
  />
);

const exportedMlrModalOverlayReportSectionComponentOther = (
  <ExportedModalOverlayReportSection
    section={mockModalOverlayReportPageJson as ModalOverlayReportPageShape}
  />
);

const exportedNaaarStandardsComponent = (
  <ExportedModalOverlayReportSection
    section={{
      ...(mockModalOverlayReportPageJson as ModalOverlayReportPageShape),
      entityType: EntityType.STANDARDS,
    }}
  />
);

describe("<ExportedModalOverlayReportSection />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("renderModalOverlayTableBody()", () => {
    describe("MCPAR", () => {
      beforeEach(() => {
        mockedUseStore.mockReturnValue(mockMcparReportStore);
      });

      test("Should render data correctly for MCPAR", () => {
        mockMcparReportContext.report.fieldData.plans = [
          {
            id: "mock-plan-id",
            name: "Mock plan name",
            plan_ilosOfferedByPlan: [],
            plan_ilosUtilizationByPlan: [],
          },
        ];
        render(exportedMcparModalOverlayReportSectionComponent);

        expect(
          screen.getByRole("cell", { name: "Mock plan name" })
        ).toBeVisible();
      });

      test("Should render empty state with no entities", () => {
        mockMcparReportContext.report.fieldData.plans = [];
        render(exportedMcparModalOverlayReportSectionComponent);
        expect(screen.queryAllByRole("cell").length).toBe(0);
        expect(screen.getByText("No entities found.")).toBeVisible();
      });
    });

    describe("MLR", () => {
      const mlrTableHeader = Object.values(
        mlrVerbiage.modalOverlayTableHeaders as Record<string, string>
      );

      const mockMlrProgram = {
        id: "mock-program-id",
        report_programName: "Mock program name",
        report_programType: [
          {
            key: "report_programType",
            value: "Mock program type",
          },
          {
            key: "report_programType2",
            value: "Mock program type 2",
          },
        ],
        report_eligibilityGroup: [
          {
            key: "report_eligibilityGroup",
            value: "Mock eligibility group",
          },
        ],
        report_planName: "Mock plan name",
        report_reportingPeriodStartDate: "11/03/1992",
        report_reportingPeriodEndDate: "12/01/1993",
        report_reportingPeriodDiscrepancy: [
          {
            key: "report_reportingPeriodDiscrepancy",
            value: "No",
          },
        ],
        "report_eligibilityGroup-otherText": "",
        report_reportingPeriodDiscrepancyExplanation: "",
        report_incurredClaims: "1",
        report_healthCareQualityActivities: "1",
        report_mlrNumerator: "1",
        report_mlrNumeratorExplanation: "Mock numerator explanation",
        report_nonClaimsCosts: "1",
        report_mlrDenominator: "1",
        report_requiredMemberMonths: "12",
        report_miscellaneousNotes: "",
        report_contractIncludesMlrRemittanceRequirement: [
          {
            key: "contractIncludesRemittance",
            value: "No",
          },
        ],
        report_adjustedMlrPercentage: "1",
      };

      const mockMlrProgramOther = {
        ...mockMlrProgram,
        report_programType: [],
        report_planName: "",
        report_reportingPeriodStartDate: "01/01/2021",
        report_reportingPeriodEndDate: "01/01/2022",
        report_miscellaneousNotes: "Mock misc notes",
        "report_eligibilityGroup-otherText":
          "Mock eligibility group explanation",
        report_reportingPeriodDiscrepancyExplanation:
          "Mock discrepancy explanation",
      };

      beforeEach(() => {
        mockedUseStore.mockReturnValue(mockMlrReportStore);
      });

      test("Should render data correctly for MLR", () => {
        mockMlrReportContext.report.fieldData.program = [mockMlrProgram];
        render(exportedMlrModalOverlayReportSectionComponent);

        // All table headers are present
        expect(screen.getAllByRole("columnheader").length).toBe(
          mlrTableHeader.length
        );
        expect(screen.getAllByRole("columnheader").length).toBe(6);

        // Every entity has a row (+1 for header)
        expect(screen.getAllByRole("rowgroup").length).toBe(
          mockMlrReportContext.report.fieldData.program.length + 1
        );

        // Correct index
        expect(screen.getByRole("cell", { name: "1" })).toBeVisible();

        // Correct info column
        expect(
          screen.getByRole("cell", {
            name: "Mock plan name Mock program name Mock eligibility group 11/03/1992 to 12/01/1993",
          })
        ).toBeVisible();

        // Correct program type
        expect(
          screen.getByRole("cell", {
            name: "Mock program type, Mock program type 2",
          })
        ).toBeVisible();

        // Correct discrepancy and notes
        expect(screen.getAllByRole("cell", { name: "N/A" }).length).toBe(2);
      });

      test("Should render other explanations if they are filled", () => {
        mockMlrReportContextOther.report.fieldData.program = [
          mockMlrProgramOther,
        ];
        render(exportedMlrModalOverlayReportSectionComponentOther);

        // Correct info column
        expect(
          screen.getByRole("cell", {
            name: "Not entered Mock program name Mock eligibility group explanation 01/01/2021 to 01/01/2022",
          })
        ).toBeVisible();

        // Correct program type
        expect(screen.getByRole("cell", { name: "Not entered" })).toBeVisible();

        // Correct discrepancy
        expect(
          screen.getByRole("cell", {
            name: mockMlrProgramOther.report_reportingPeriodDiscrepancyExplanation,
          })
        ).toBeVisible();

        // Correct notes
        expect(
          screen.getByRole("cell", {
            name: mockMlrProgramOther.report_miscellaneousNotes,
          })
        ).toBeVisible();
      });

      test("Should render empty state with no entities", () => {
        mockMlrReportContextOther.report.fieldData.program = [];
        render(exportedMlrModalOverlayReportSectionComponentOther);
        expect(screen.queryAllByRole("cell").length).toBe(0);
        expect(screen.getByText("No entities found.")).toBeVisible();
      });
    });

    describe("NAAAR", () => {
      test("Should render data correctly for NAAAR", () => {
        mockedUseStore.mockReturnValue(mockNaaarReportStore);
        render(exportedNaaarStandardsComponent);

        // All table headers are present
        expect(screen.getAllByRole("columnheader").length).toBe(7);

        // Every entity has a row (+1 for header)
        const tbody = screen.getAllByRole("rowgroup")[1];
        const rows = within(tbody).getAllByRole("row");
        expect(rows.length).toBe(
          mockNaaarReportStore.report?.fieldData.standards.length
        );

        // index
        expect(screen.getByRole("cell", { name: "1" })).toBeVisible();

        // provider type
        expect(
          screen.getByRole("cell", {
            name: "Primary Care",
          })
        ).toBeVisible();

        // standard type
        expect(
          screen.getByRole("cell", { name: "Appointment wait time" })
        ).toBeVisible();

        // description
        expect(
          screen.getByRole("cell", { name: "standard description" })
        ).toBeVisible();

        // analysis methods, joined with a comma
        expect(
          screen.getByRole("cell", {
            name: "Geomapping, Plan Provider Directory Review",
          })
        ).toBeVisible();

        // population
        expect(screen.getByRole("cell", { name: "Pediatric" })).toBeVisible();

        // region
        expect(screen.getByRole("cell", { name: "Metro" })).toBeVisible();
      });

      test("Should render message for NAAAR with no standards", async () => {
        const mockEmptyStandardsNaaarStore = {
          ...mockNaaarReportStore,
        };
        mockEmptyStandardsNaaarStore.report!.fieldData.standards = undefined;
        mockedUseStore.mockReturnValue(mockEmptyStandardsNaaarStore);
        render(exportedNaaarStandardsComponent);

        // No table renders
        expect(screen.queryByRole("table")).toBeNull();

        // region
        expect(
          screen.getByTestId("exportedModalOverlayReportSection")
        ).toHaveTextContent(
          "Standard total count: 0 - No access standards entered"
        );
      });
    });

    describe("unknown report type", () => {
      beforeEach(() => {
        mockedUseStore.mockReturnValue(mockMcparReportStore);
      });

      test("Should render data correctly for unknown report type", () => {
        mockMcparReportContext.report.reportType = "unknown";

        expect(() =>
          render(exportedMcparModalOverlayReportSectionComponent)
        ).toThrow(
          "The modal overlay table headers for report type 'unknown' have not been implemented."
        );
      });
    });
  });

  describe("renderStatusIcon()", () => {
    test("returns success icon", () => {
      render(renderStatusIcon(true));
      expect(screen.getByRole("img", { name: "success icon" })).toBeVisible();
    });

    test("returns warning icon", () => {
      render(renderStatusIcon(false));
      expect(screen.getByRole("img", { name: "warning icon" })).toBeVisible();
    });
  });

  testA11yAct(exportedMlrModalOverlayReportSectionComponent);
});
