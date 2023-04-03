import { render } from "@testing-library/react";
import { ReportContext } from "components";
import { ExportedReportPage, reportTitle } from "./ExportedReportPage";
import { axe } from "jest-axe";
import { ReportShape, ReportType } from "types";

const mockMcparContext = {
  report: {
    reportType: "MCPAR",
    dueDate: 1712505600000,
    lastAltered: 1712505600000,
    lastAlteredBy: "Name",
    status: "In Progress",
    programName: "test",
    formTemplate: {
      routes: [
        {
          path: "test",
          name: "test",
          pageType: "test",
        },
      ],
    },
    fieldData: {
      stateName: "test",
    },
  },
};

const mockMcparContextCombinedData = {
  report: {
    reportType: "MCPAR",
    dueDate: 1712505600000,
    lastAltered: 1712505600000,
    lastAlteredBy: "Name",
    status: "In Progress",
    programName: "test",
    combinedData: true,
    formTemplate: {
      routes: [
        {
          path: "test",
          name: "test",
          pageType: "test",
        },
      ],
    },
    fieldData: {
      stateName: "test",
    },
  },
};

const mockMlrContext = {
  report: {
    reportType: "MLR",
    dueDate: 1712505600000,
    lastAltered: 1712505600000,
    lastAlteredBy: "Name",
    status: "In Progress",
    programName: "test",
    formTemplate: {
      routes: [
        {
          path: "test",
          name: "test",
          pageType: "test",
        },
      ],
    },
    fieldData: {
      stateName: "TestState",
    },
  },
};

const exportedReportPage = (context: any) => (
  <ReportContext.Provider value={context}>
    <ExportedReportPage />
  </ReportContext.Provider>
);

describe("Test ExportedReportPage Functionality", () => {
  test("Is the export page visible", async () => {
    const { getByTestId } = render(exportedReportPage(mockMcparContext));
    const page = getByTestId("exportedReportPage");
    expect(page).toBeVisible();
    const results = await axe(page);
    expect(results).toHaveNoViolations();
  });

  test("Is the export page visible w/Combined Data", async () => {
    const { getByTestId } = render(
      exportedReportPage(mockMcparContextCombinedData)
    );
    const page = getByTestId("exportedReportPage");
    expect(page).toBeVisible();
    const results = await axe(page);
    expect(results).toHaveNoViolations();
  });

  test("Does the export page have the correct title for MLR reports", () => {
    const page = render(exportedReportPage(mockMlrContext));
    const title = page.getByText(
      "TestState: Medicaid Medical Loss Ratio (MLR) & Remittance Calculations"
    );
    expect(title).toBeVisible();
  });
});

describe("ExportedReportPage fails gracefully when appropriate", () => {
  const unknownReportType = "some new report type" as ReportType;

  it("Should throw an error when rendering the title for an unknown report type", () => {
    expect(() => reportTitle(unknownReportType, {}, {} as ReportShape)).toThrow(
      Error
    );
  });
});
