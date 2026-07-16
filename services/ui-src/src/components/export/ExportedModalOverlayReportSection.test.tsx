import { render, screen, within } from "@testing-library/react";
// components
import { ExportedModalOverlayReportSection } from "./ExportedModalOverlayReportSection";
// types
import { EntityType, ModalOverlayReportPageShape } from "types";
// utils
import {
  mockMlrReportContext,
  mockMlrReportStore,
  mockModalOverlayReportPageJson,
  mockNaaarReportStore,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";
// verbiage
import mlrVerbiage from "verbiage/pages/mlr/mlr-export";

const mockReportContext = mockMlrReportContext;
const mockReportContextOther = Object.assign({}, mockReportContext);

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const exportedModalOverlayReportSectionComponent = (
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

const mlrTableHeader = Object.values(
  mlrVerbiage.modalOverlayTableHeaders as Record<string, string>
);

const mockMlrProgram = {
  id: "123",
  report_programName: "Test",
  report_programType: [
    {
      key: "report_programType1",
      value: "Mock program type 1",
    },
    {
      key: "report_programType2",
      value: "Mock program type 2",
    },
  ],
  report_eligibilityGroup: [
    {
      key: "report_eligibilityGroup",
      value: "Standalone CHIP",
    },
  ],
  report_planName: "Test",
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
  report_mlrNumeratorExplanation: "Test",
  report_nonClaimsCosts: "1",
  report_mlrDenominator: "1",
  report_requiredMemberMonths: "12",
  report_miscellaneousNotes: "Notes",
  report_contractIncludesMlrRemittanceRequirement: [
    {
      key: "contractIncludesRemittance",
      value: "No",
    },
  ],
  report_adjustedMlrPercentage: "1",
};

const mockMlrProgramOther = {
  id: "1",
  report_programName: "Test Program",
  report_programType: [
    {
      key: "report_programType",
      value: "Behavioral Health Only",
    },
  ],
  report_eligibilityGroup: [
    {
      key: "report_eligibilityGroup",
      value: "Standalone CHIP",
    },
  ],
  report_planName: "Test MCO Name",
  report_reportingPeriodStartDate: "01/01/2021",
  report_reportingPeriodEndDate: "01/01/2022",
  report_reportingPeriodDiscrepancy: [
    {
      key: "report_reportingPeriodDiscrepancy",
      value: "No",
    },
  ],
  report_miscellaneousNotes: "Notes!!!",
  "report_eligibilityGroup-otherText": "Eligibility group explanation",
  report_reportingPeriodDiscrepancyExplanation:
    "My reporting period discrepancy explanation",
  report_incurredClaims: "1",
  report_healthCareQualityActivities: "1",
  report_mlrNumerator: "1",
  report_mlrNumeratorExplanation: "Test",
  report_nonClaimsCosts: "1",
  report_mlrDenominator: "1",
  report_requiredMemberMonths: "12",
  report_contractIncludesMlrRemittanceRequirement: [
    {
      key: "contractIncludesRemittance",
      value: "No",
    },
  ],
  report_adjustedMlrPercentage: "1",
};

const exportedModalOverlayReportSectionComponentOther = (
  <ExportedModalOverlayReportSection
    section={mockModalOverlayReportPageJson as ModalOverlayReportPageShape}
  />
);

describe("<ExportedModalOverlayReportSection />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseStore.mockReturnValue({
      ...mockMlrReportStore,
    });
  });
  test("ExportedModalOverlayReportSection renders", () => {
    const { getByTestId } = render(exportedModalOverlayReportSectionComponent);
    const section = getByTestId("exportTable");
    expect(section).toBeVisible();
  });

  describe("Test renderModalOverlayTableBody", () => {
    test("Should render data correctly for MLR", () => {
      mockReportContext.report.fieldData.program = [mockMlrProgram];
      render(exportedModalOverlayReportSectionComponent);

      // All table headers are present
      expect(screen.getAllByRole("columnheader").length).toBe(
        mlrTableHeader.length
      );
      expect(screen.getAllByRole("columnheader").length).toBe(6);

      // Every entity has a row (+1 for header)
      expect(screen.getAllByRole("rowgroup").length).toBe(
        mockReportContext.report.fieldData.program.length + 1
      );

      // Correct index
      expect(screen.getByRole("cell", { name: "1" })).toBeVisible();

      // Correct info column
      expect(
        screen.getByRole("cell", {
          name: "Test Test Standalone CHIP 11/03/1992 to 12/01/1993",
        })
      ).toBeVisible();

      // Correct program type
      expect(
        screen.getByRole("cell", {
          name: "Mock program type 1, Mock program type 2",
        })
      ).toBeVisible();

      // Correct discrepancy
      expect(screen.getByRole("cell", { name: "N/A" })).toBeVisible();

      // Correct notes
      expect(
        screen.getByRole("cell", {
          name: mockMlrProgram.report_miscellaneousNotes,
        })
      ).toBeVisible();
    });

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

    test('Should render "other" explanations if they are filled', () => {
      mockReportContextOther.report.fieldData.program = [mockMlrProgramOther];
      render(exportedModalOverlayReportSectionComponentOther);

      // Correct info column
      expect(
        screen.getByRole("cell", {
          name: "Test MCO Name Test Program Eligibility group explanation 01/01/2021 to 01/01/2022",
        })
      ).toBeVisible();

      // Correct program type
      expect(
        screen.getByRole("cell", {
          name: mockMlrProgramOther.report_programType[0].value,
        })
      ).toBeVisible();

      // Correct discrepancy
      expect(
        screen.getByRole("cell", {
          name: mockMlrProgramOther[
            "report_reportingPeriodDiscrepancyExplanation"
          ],
        })
      ).toBeVisible();
    });

    test("Should render empty state with no entities.", () => {
      mockReportContextOther.report.fieldData.program = [];
      render(exportedModalOverlayReportSectionComponentOther);
      expect(screen.queryAllByRole("cell").length).toBe(0);
      expect(screen.getByText("No entities found.")).toBeVisible();
    });
  });
  testA11yAct(exportedModalOverlayReportSectionComponent);
});
