import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { ExportedReportFieldRow } from "./ExportedReportFieldRow";
import { mockReportContext } from "utils/testing/setupJest";
import { ReportContext } from "components";
import { Table } from "@chakra-ui/react";

const field = {
  id: "test",
  validation: "string",
  type: "drawer",
  props: { hint: "hint", number: 123 },
};
const otherTextField = {
  id: "test-otherText",
  validation: "string",
  type: "dynamic",
  props: { hint: "hint" },
};
const fieldWithLabel = {
  id: "test",
  validation: "string",
  type: "drawer",
  props: { hint: "hint", label: "test label" },
};

const exportRow = (
  <ReportContext.Provider value={mockReportContext}>
    <Table sx={{}}>
      <ExportedReportFieldRow formField={field} pageType="drawer" />
    </Table>
  </ReportContext.Provider>
);

const otherTextRow = (
  <ReportContext.Provider value={mockReportContext}>
    <Table sx={{}}>
      <ExportedReportFieldRow formField={otherTextField} pageType="drawer" />
    </Table>
  </ReportContext.Provider>
);

const dynamicRow = (
  <ReportContext.Provider value={mockReportContext}>
    <Table sx={{}}>
      <ExportedReportFieldRow formField={fieldWithLabel} pageType="drawer" />
    </Table>
  </ReportContext.Provider>
);

describe("ExportedReportFieldRow", () => {
  test("Is present", async () => {
    render(exportRow);
    const row = screen.getByTestId("exportRow");
    expect(row).toBeVisible();
  });

  test("is not visible when ", async () => {
    render(otherTextRow);
    const row = screen.queryByTestId("exportRow");
    expect(row).toBeNull();
  });

  test("displays alternate prop fields", async () => {
    render(dynamicRow);
    const row = screen.getByTestId("exportRow");
    expect(row).toBeVisible();
  });
});

describe("Test ExportedReportFieldRow accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(exportRow);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
