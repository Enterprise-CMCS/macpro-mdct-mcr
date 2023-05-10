import { render } from "@testing-library/react";
import { ReportContext } from "components/reports/ReportProvider";
// components
import { EntityRow } from "./EntityRow";
import { Table } from "./Table";
// utils
import {
  mockMlrReportContext,
  mockVerbiageIntro,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

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
        <EntityRow
          entity={{
            ...mockMlrReportContext.report.fieldData.program[1],
            report_mlrNumerator: null,
          }}
          verbiage={mockVerbiageIntro}
        ></EntityRow>
      </Table>
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const completeRowComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMlrReportContext}>
      <Table content={{}}>
        <EntityRow
          entity={mockMlrReportContext.report.fieldData.program[1]}
          verbiage={mockVerbiageIntro}
        ></EntityRow>
      </Table>
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test EntityRow", () => {
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
