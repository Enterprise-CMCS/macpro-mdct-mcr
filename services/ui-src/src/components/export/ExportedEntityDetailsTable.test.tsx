import { render, screen } from "@testing-library/react";
// components
import { ExportedEntityDetailsTable } from "components";
// utils
import {
  mockMlrReportContext,
  mockMlrReportStore,
  mockModalOverlayReportPageWithOverlayJson,
  mockUseStore,
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
  test("renders successfully", async () => {
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
    expect(screen.getByText("header content")).toBeVisible();
  });

  testA11y(exportedEntityDetailsTableComponent());
});

describe("new test", () => {
  test("new test", () => {
    const mockField = {
      id: "1",
      type: "text",
      validation: "text",
      props: {
        choices: [
          {
            id: "choice-1",
            children: [
              {
                id: "nested-1",
                type: "text",
                props: { content: "Nested Field 1" },
              },
              {
                id: "nested-2",
                type: "text",
                props: { content: "Nested Field 2" },
              },
            ],
          },
        ],
      },
    };

    jest.mock("utils/state/useStore");
    const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
    mockedUseStore.mockReturnValue({
      ...mockMlrReportStore,
    });

    render(
      <ExportedEntityDetailsTable
        caption="Test Table"
        fields={[mockField]}
        entity={mockMlrReportContext.report.fieldData.program[0]}
        showHintText={false}
      />
    );

    const nestedField1 = screen.getByText("Nested Field 1");
    const nestedField2 = screen.getByText("Nested Field 2");

    expect(nestedField1).toBeInTheDocument();
    expect(nestedField2).toBeInTheDocument();
  });
});
