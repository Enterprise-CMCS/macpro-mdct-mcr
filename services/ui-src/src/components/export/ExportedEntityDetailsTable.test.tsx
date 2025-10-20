import { render, screen } from "@testing-library/react";
// components
import { ExportedEntityDetailsTable } from "components";
// types
import { ReportType } from "types";
// utils
import {
  mockMlrReportContext,
  mockMlrReportStore,
  mockModalOverlayReportPageWithOverlayJson,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockMlrReportStore,
});
jest.mock("./ExportedEntityDetailsTable", () => ({
  ...jest.requireActual("./ExportedEntityDetailsTable"),
  renderFieldRow: jest.fn(),
}));

const exportedEntityDetailsTableComponent = () => (
  <ExportedEntityDetailsTable
    fields={mockModalOverlayReportPageWithOverlayJson.overlayForm.fields}
    entity={mockMlrReportContext.report.fieldData.program[0]}
    data-testid="exportedEntityDetailsTable"
    caption={"header content"}
  ></ExportedEntityDetailsTable>
);
describe("<ExportedEntityDetailsTable />", () => {
  beforeAll(() => {
    localStorage.setItem("selectedReportType", ReportType.MLR);
  });
  afterAll(() => {
    localStorage.setItem("selectedReportType", "");
  });
  test("renders successfully", async () => {
    const { findAllByText } = render(exportedEntityDetailsTableComponent());
    const table = await screen.findByRole("table");
    expect(table).toBeVisible();
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
    expect(screen.getByText("header content")).toBeVisible();
  });

  testA11y(exportedEntityDetailsTableComponent());
});
