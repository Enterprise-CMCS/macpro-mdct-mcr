import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, ExportedModalDrawerReportSection } from "components";
// utils
import {
  mockModalDrawerReportPageJson,
  mockReport,
  mockReportContext,
} from "utils/testing/setupJest";
// types
import { ModalDrawerReportPageShape, ReportContextShape } from "types";

const exportedReportSectionComponent = (
  context: ReportContextShape = mockReportContext,
  content: ModalDrawerReportPageShape = mockModalDrawerReportPageJson
) => (
  <ReportContext.Provider value={context}>
    <ExportedModalDrawerReportSection section={content} />
  </ReportContext.Provider>
);

describe("ExportedModalDrawerReportSection renders", () => {
  test("ExportedModalDrawerReportSection renders", () => {
    const { getByTestId } = render(exportedReportSectionComponent());
    const section = getByTestId("exportedModalDrawerReportSection");
    expect(section).toBeVisible();
  });
});

describe("ExportedModalDrawerReportSection displays correct verbiage if no entities are present", () => {
  test("Correct message is shown if entityType is accessMeasures", () => {
    render(
      exportedReportSectionComponent({
        ...mockReportContext,
        report: {
          ...mockReport,
          fieldData: {},
        },
      })
    );
    const entityMessage = screen.getByText("0 - No access measures entered");
    expect(entityMessage).toBeVisible();
  });

  test("Correct message is shown if entityType is qualityMeasures", () => {
    render(
      exportedReportSectionComponent(mockReportContext, {
        ...mockModalDrawerReportPageJson,
        entityType: "qualityMeasures",
      })
    );
    const entityMessage = screen.getByText(
      "0 - No quality & performance measures entered"
    );
    expect(entityMessage).toBeVisible();
  });

  test("Correct message is shown if entityType is sanctions", () => {
    render(
      exportedReportSectionComponent(mockReportContext, {
        ...mockModalDrawerReportPageJson,
        entityType: "sanctions",
      })
    );
    const entityMessage = screen.getByText("0 - No sanctions entered");
    expect(entityMessage).toBeVisible();
  });
});

describe("Test ExportedModalDrawerReportSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(exportedReportSectionComponent());
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
