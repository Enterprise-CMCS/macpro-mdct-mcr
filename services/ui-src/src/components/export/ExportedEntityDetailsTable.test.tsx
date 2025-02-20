import { render } from "@testing-library/react";
import { describe, expect, MockedFunction, test, vi } from "vitest";
// components
import { ExportedEntityDetailsTable } from "components";
// utils
import {
  mockMlrReportContext,
  mockMlrReportStore,
  mockModalOverlayReportPageWithOverlayJson,
} from "utils/testing/setupTests";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockMlrReportStore,
});

const exportedEntityDetailsTableComponent = () => (
  <ExportedEntityDetailsTable
    fields={mockModalOverlayReportPageWithOverlayJson.overlayForm.fields}
    entity={mockMlrReportContext.report.fieldData.program[0]}
    data-testid="exportedEntityDetailsTable"
  ></ExportedEntityDetailsTable>
);
describe("<ExportedEntityDetailsTable />", () => {
  test("renders successfully", async () => {
    const { findAllByText, findByTestId } = render(
      exportedEntityDetailsTableComponent()
    );
    expect(
      await findByTestId("exportedEntityDetailsTable")
    ).toBeInTheDocument();

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

  testA11y(exportedEntityDetailsTableComponent());
});
