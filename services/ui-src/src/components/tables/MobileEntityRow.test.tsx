import { render } from "@testing-library/react";
import { ReportContext } from "components/reports/ReportProvider";
import {
  mockMlrReportContext,
  mockVerbiageIntro,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { MobileEntityRow } from "./MobileEntityRow";
import { Table } from "./Table";

const incompleteRowComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider
      value={{
        ...mockMlrReportContext,
        report: {
          ...mockMlrReportContext.report,
          formTemplate: {
            ...mockMlrReportContext.report.formTemplate,
            validationJson: {
              report_mlrNumerator: "number",
            },
          },
        },
      }}
    >
      <Table content={{}}>
        <MobileEntityRow
          entity={{
            ...mockMlrReportContext.report.fieldData.program[1],
            report_mlrNumerator: null,
          }}
          verbiage={mockVerbiageIntro}
        ></MobileEntityRow>
      </Table>
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const completeRowComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMlrReportContext}>
      <Table content={{}}>
        <MobileEntityRow
          entity={mockMlrReportContext.report.fieldData.program[1]}
          verbiage={mockVerbiageIntro}
        ></MobileEntityRow>
      </Table>
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test MobileEntityRow", () => {
  test("It should render an error if an entity is incomplete", async () => {
    const { findByText } = render(incompleteRowComponent);
    expect(
      await findByText("Select “Enter MLR” to complete this report.")
    ).toBeVisible();
  });
  test("It should NOT render an error if an entity is complete", async () => {
    const { queryByText } = render(completeRowComponent);
    expect(queryByText("Select “Enter MLR” to complete this report.")).toBe(
      null
    );
  });
});
