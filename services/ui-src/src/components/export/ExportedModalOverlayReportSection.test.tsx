import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, MockedFunction, test, vi } from "vitest";
// components
import {
  ExportedModalOverlayReportSection,
  renderModalOverlayTableBody,
} from "./ExportedModalOverlayReportSection";
// types
import { ModalOverlayReportPageShape, ReportType } from "types";
// utils
import {
  mockMlrReportContext,
  mockMlrReportStore,
  mockModalOverlayReportPageJson,
} from "utils/testing/setupTests";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";
// verbiage
import mlrVerbiage from "verbiage/pages/mlr/mlr-export";

const mockReportContext = mockMlrReportContext;
const mockReportContextOther = Object.assign({}, mockReportContext);

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockMlrReportStore,
});

const exportedModalOverlayReportSectionComponent = (
  <ExportedModalOverlayReportSection
    section={mockModalOverlayReportPageJson as ModalOverlayReportPageShape}
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
  report_inurredClaims: "1",
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
  report_inurredClaims: "1",
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
  test("ExportedModalOverlayReportSection renders", () => {
    const { getByTestId } = render(exportedModalOverlayReportSectionComponent);
    const section = getByTestId("exportTable");
    expect(section).toBeVisible();
  });

  describe("Test renderModalOverlayTableBody", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
    test("Should render data correctly", async () => {
      mockReportContext.report.fieldData.program = [mockMlrProgram];
      const { container, findByText } = render(
        exportedModalOverlayReportSectionComponent
      );
      expect(await container.querySelectorAll("th").length).toEqual(
        mlrTableHeader.length
      );

      // All table headers are present
      expect(container.querySelectorAll("th").length).toBe(6);

      // Every entity has a row (+1 for header)
      expect(container.querySelectorAll("tr").length).toBe(
        mockReportContext.report.fieldData.program.length + 1
      );

      // Check that icon is visible and has empty alt-text
      const completeIcon = screen.getByRole("img");
      expect(completeIcon).toBeVisible();
      expect(completeIcon).toHaveAttribute("alt", "");

      // Correct index
      expect(await findByText("1")).toBeVisible();

      // Correct info column
      expect(
        await findByText(mockMlrProgram.report_programName, { exact: false })
      ).toBeVisible();
      expect(
        await findByText(mockMlrProgram.report_eligibilityGroup[0].value, {
          exact: false,
        })
      ).toBeVisible();
      expect(
        await findByText(
          `${mockMlrProgram.report_reportingPeriodStartDate} to ${mockMlrProgram.report_reportingPeriodEndDate}`,
          { exact: false }
        )
      ).toBeVisible();
      expect(
        await findByText(mockMlrProgram.report_planName, { exact: false })
      ).toBeVisible();

      // Correct program type
      expect(
        await findByText(mockMlrProgram.report_programType[0].value)
      ).toBeVisible();

      // Correct discrepancy
      expect(await findByText(`N/A`)).toBeVisible();

      // Correct notes
      expect(
        await findByText(mockMlrProgram.report_miscellaneousNotes)
      ).toBeInTheDocument();
    });

    test('Should render "other" explanations if they are filled.', async () => {
      mockReportContextOther.report.fieldData.program = [mockMlrProgramOther];

      const { findByText } = render(
        exportedModalOverlayReportSectionComponentOther
      );

      expect(
        await findByText(
          mockMlrProgramOther["report_eligibilityGroup-otherText"],
          {
            exact: false,
          }
        )
      ).toBeVisible();

      expect(
        await findByText(
          mockMlrProgramOther["report_reportingPeriodDiscrepancyExplanation"],
          {
            exact: false,
          }
        )
      ).toBeVisible();
    });

    test("Should render empty state with no entities.", async () => {
      mockReportContextOther.report.fieldData.program = [];
      const { findByText } = render(
        exportedModalOverlayReportSectionComponentOther
      );

      expect(await findByText("No entities found.")).toBeVisible();
    });

    test("Should throw an error using an unsupported report", async () => {
      expect(() => renderModalOverlayTableBody(ReportType.MCPAR, [])).toThrow(
        Error
      );
    });
  });
  testA11y(exportedModalOverlayReportSectionComponent);
});
