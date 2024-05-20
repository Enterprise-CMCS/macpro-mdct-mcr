import { render } from "@testing-library/react";
import { ReportContext } from "components/reports/ReportProvider";
import { axe } from "jest-axe";
import {
  mockMlrReportContext,
  mockModalOverlayReportPageWithOverlayJson,
} from "utils/testing/setupJest";
import { ExportedEntityDetailsTable } from "./ExportedEntityDetailsTable";

const exportedEntityDetailsTableComponent = () => (
  <ReportContext.Provider value={mockMlrReportContext}>
    <ExportedEntityDetailsTable
      fields={mockModalOverlayReportPageWithOverlayJson.overlayForm.fields}
      entity={mockMlrReportContext.report.fieldData.program[0]}
      data-testid="exportedEntityDetailsTable"
    ></ExportedEntityDetailsTable>
  </ReportContext.Provider>
);
describe("ExportedEntityDetailsTable", () => {
  it("renders successfully", async () => {
    const { findAllByText, findByTestId } = render(
      exportedEntityDetailsTableComponent()
    );
    expect(await findByTestId("exportedEntityDetailsTable"));

    const expectedTextContent = [
      "N/A",
      "mock text field",
      "mock number field",
      "Not answered; required",
    ];

    for (const content of expectedTextContent) {
      for (const element of await findAllByText(content)) {
        expect(element).toBeVisible();
      }
    }
  });
});

describe("ExportedEntityDetailsTable has no accessibility issues", () => {
  it("should have no violations", async () => {
    const { container } = render(exportedEntityDetailsTableComponent());
    expect(await axe(container)).toHaveNoViolations();
  });
});
