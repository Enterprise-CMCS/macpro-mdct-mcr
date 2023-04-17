import { render } from "@testing-library/react";
import { ReportContext } from "components/reports/ReportProvider";
import { axe } from "jest-axe";
import { ModalOverlayReportPageShape, ReportType } from "types";
import {
  mockMlrReportContext,
  mockMlrReportFieldData,
  mockModalOverlayReportPageJson,
} from "utils/testing/setupJest";
import {
  ExportedModalOverlayReportSection,
  renderModalOverlayTableBody,
  renderStatusIcon,
} from "./ExportedModalOverlayReportSection";
import mlrVerbiage from "../../verbiage/pages/mlr/mlr-export";

const mockReportContext = mockMlrReportContext;
const mockReportContextOther = Object.assign({}, mockReportContext);
const exportedModalOverlayReportSectionComponent = (
  <ReportContext.Provider value={mockReportContext}>
    <ExportedModalOverlayReportSection
      section={mockModalOverlayReportPageJson as ModalOverlayReportPageShape}
    />
  </ReportContext.Provider>
);

const exportedModalOverlayReportSectionComponentOther = (
  <ReportContext.Provider value={mockReportContextOther}>
    <ExportedModalOverlayReportSection
      section={mockModalOverlayReportPageJson as ModalOverlayReportPageShape}
    />
  </ReportContext.Provider>
);

const mlrTableHeader = Object.values(
  mlrVerbiage.modalOverlayTableHeaders as Record<string, string>
);

const mockMlrProgram = {
  id: "1",
  programName: "Test Program",
  programType: [
    {
      key: "programType",
      value: "Behavioral Health Only",
    },
  ],
  report_eligibilityGroup: [
    {
      key: "report_eligibilityGroup",
      value: "Standalone CHIP",
    },
  ],
  planName: "Test MCO Name",
  reportingPeriodStartDate: "01/01/2021",
  reportingPeriodEndDate: "01/01/2022",
  reportingPeriodDiscrepancy: [
    {
      key: "reportingPeriodDiscrepancy",
      value: "No",
    },
  ],
  miscellaneousNotes: "Notes",
  "report_eligibilityGroup-otherText": "",
  report_reportingPeriodDiscrepancyExplanation: "",
};

const mockMlrProgramOther = {
  id: "1",
  programName: "Test Program",
  programType: [
    {
      key: "programType",
      value: "Behavioral Health Only",
    },
  ],
  report_eligibilityGroup: [
    {
      key: "report_eligibilityGroup",
      value: "Standalone CHIP",
    },
  ],
  planName: "Test MCO Name",
  reportingPeriodStartDate: "01/01/2021",
  reportingPeriodEndDate: "01/01/2022",
  reportingPeriodDiscrepancy: [
    {
      key: "reportingPeriodDiscrepancy",
      value: "No",
    },
  ],
  miscellaneousNotes: "Notes",
  "report_eligibilityGroup-otherText": "Eligibility group explanation",
  report_reportingPeriodDiscrepancyExplanation:
    "My reporting period discrepancy explanation",
};

describe("Test ExportedModalOverlayReportSection", () => {
  test("ExportedModalOverlayReportSection renders", () => {
    const { getByTestId } = render(exportedModalOverlayReportSectionComponent);
    const section = getByTestId("exportTable");
    expect(section).toBeVisible();
  });
});

describe("Test renderModalOverlayTableBody", () => {
  it("Should render data correctly", async () => {
    mockReportContext.report.fieldData.program = [mockMlrProgram];
    const { container, findByAltText, findByText } = render(
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

    // Correct status
    expect(await findByAltText("warning icon")).toBeVisible();

    // Correct index
    expect(await findByText("1")).toBeVisible();

    // Correct info column
    expect(
      await findByText(mockMlrProgram.programName, { exact: false })
    ).toBeVisible();
    expect(
      await findByText(mockMlrProgram.report_eligibilityGroup[0].value, {
        exact: false,
      })
    ).toBeVisible();
    expect(
      await findByText(
        `${mockMlrProgram.reportingPeriodStartDate} to ${mockMlrProgram.reportingPeriodEndDate}`,
        { exact: false }
      )
    ).toBeVisible();
    expect(
      await findByText(mockMlrProgram.planName, { exact: false })
    ).toBeVisible();

    // Correct program type
    expect(await findByText(mockMlrProgram.programType[0].value)).toBeVisible();

    // Correct discrepancy
    expect(await findByText(`N/A`)).toBeVisible();

    // Correct notes
    expect(await findByText(mockMlrProgram.miscellaneousNotes));
  });

  it('Should render "other" explanations if they are filled.', async () => {
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

  it("Should render empty state with no entities.", async () => {
    mockReportContextOther.report.fieldData.program = [];
    const { findByText } = render(
      exportedModalOverlayReportSectionComponentOther
    );

    expect(await findByText("No entities found.")).toBeVisible();
  });

  it("Should throw an error using an unsupported report", async () => {
    expect(() =>
      renderModalOverlayTableBody(
        {},
        ReportType.MCPAR,
        mockMlrReportFieldData.program
      )
    ).toThrow(Error);
  });
});

describe("Test renderStatusIcon", () => {
  it("Should render a green check if complete", async () => {
    const { findByAltText } = render(renderStatusIcon(true));
    expect(await findByAltText("success icon")).toBeVisible();
  });
  it("Should render a red x if incomplete", async () => {
    const { findByAltText } = render(renderStatusIcon(false));
    expect(await findByAltText("warning icon")).toBeVisible();
  });
});

describe("Test ExportedModalOverlayReportSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(exportedModalOverlayReportSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
