import { render, screen } from "@testing-library/react";
// components
import { ExportedReportFieldRow } from "components";
import { Table } from "@chakra-ui/react";
// utils
import { mockMcparReportStore } from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockMcparReportStore,
});

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

const numberedField = {
  id: "test-numbered",
  validation: "string",
  type: "drawer",
  props: { hint: "hint", label: "D1.1 Numbered label" },
};

const exportRow = (
  <Table>
    <tbody>
      <ExportedReportFieldRow formField={field} pageType="drawer" />
    </tbody>
  </Table>
);

const otherTextRow = (
  <Table>
    <tbody>
      <ExportedReportFieldRow formField={otherTextField} pageType="drawer" />
    </tbody>
  </Table>
);

const dynamicRow = (
  <Table>
    <tbody>
      <ExportedReportFieldRow formField={fieldWithLabel} pageType="drawer" />
    </tbody>
  </Table>
);

const noHintRow = (
  <Table>
    <tbody>
      <ExportedReportFieldRow
        formField={field}
        pageType="drawer"
        showHintText={false}
      />
    </tbody>
  </Table>
);

const numberedRowWithColumn = (
  <Table>
    <tbody>
      <ExportedReportFieldRow
        formField={numberedField}
        pageType="drawer"
        hasNumberColumn={true}
      />
    </tbody>
  </Table>
);

const rowWithoutNumberColumn = (
  <Table>
    <tbody>
      <ExportedReportFieldRow
        formField={numberedField}
        pageType="drawer"
        hasNumberColumn={false}
      />
    </tbody>
  </Table>
);

const unnumberedRowWithColumn = (
  <Table>
    <tbody>
      <ExportedReportFieldRow
        formField={fieldWithLabel}
        pageType="drawer"
        hasNumberColumn={true}
      />
    </tbody>
  </Table>
);

describe("<ExportedReportFieldRow />", () => {
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

  test("displays hint text by default", async () => {
    render(exportRow);
    const hint = screen.getByText("hint");
    expect(hint).toBeVisible();
  });

  test("hides hint text when appropriate", async () => {
    render(noHintRow);
    const hint = screen.queryByText(/hint/);
    expect(hint).not.toBeInTheDocument();
  });

  test("renders the Number cell populated when hasNumberColumn is true and the field has a number", async () => {
    render(numberedRowWithColumn);
    expect(screen.getByRole("columnheader", { hidden: true })).toBeVisible;
    const numberCell = screen.getByText("D11"); // confirm actual rendered string first
    expect(numberCell).toBeVisible();
  });

  test("omits the Number cell entirely when hasNumberColumn is false", async () => {
    render(rowWithoutNumberColumn);
    const row = screen.getByTestId("exportRow");
    expect(row.querySelectorAll("th")).toHaveLength(0);
  });

  test("renders a blank Number cell when hasNumberColumn is true but the field has no number", async () => {
    render(unnumberedRowWithColumn);
    const row = screen.getByTestId("exportRow");
    const numberCell = row.querySelector("th");
    expect(numberCell).toBeVisible();
    expect(numberCell).toHaveTextContent("");
  });

  testA11yAct(exportRow);
});
