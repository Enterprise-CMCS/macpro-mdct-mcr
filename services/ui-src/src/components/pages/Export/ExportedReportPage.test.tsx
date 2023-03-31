import { render } from "@testing-library/react";
import { ReportContext } from "components";
import { ExportedReportPage } from "./ExportedReportPage";
import { axe } from "jest-axe";

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
});
