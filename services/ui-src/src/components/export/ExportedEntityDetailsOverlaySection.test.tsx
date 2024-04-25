import { render } from "@testing-library/react";
import { axe } from "jest-axe";
// types
import { ModalOverlayReportPageShape, ReportType } from "types";
// utils
import { useStore } from "utils";
import {
  mockMlrReportStore,
  mockMlrReportContext,
  mockModalOverlayReportPageWithOverlayJson,
} from "utils/testing/setupJest";
// components
import {
  ExportedEntityDetailsOverlaySection,
  getEntityTableComponents,
  getFormSections,
  renderEntityDetailTables,
} from "./ExportedEntityDetailsOverlaySection";

const exportedEntityDetailsOverlaySectionComponent = (
  content: ModalOverlayReportPageShape = mockModalOverlayReportPageWithOverlayJson
) => (
  <ExportedEntityDetailsOverlaySection
    data-testid="exportedEntityDetailsOverlaySection"
    section={content}
  />
);

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockMlrReportStore,
});

describe("ExportedEntityDetailsOverlaySection", () => {
  test("ExportedEntityDetailsOverlaySection is visible", async () => {
    const { findByTestId, findByText } = render(
      exportedEntityDetailsOverlaySectionComponent()
    );
    expect(
      await findByTestId("exportedEntityDetailsOverlaySection")
    ).toBeVisible();
    expect(await findByText("mock subsection")).toBeVisible();
  });
  test("ExportedEntityDetailsOverlaySection renders the correct number of tables", () => {
    const { getAllByRole } = render(
      exportedEntityDetailsOverlaySectionComponent()
    );
    const tables = getAllByRole("table");
    for (const t of tables) {
      expect(t).toBeVisible();
    }
    expect(tables).toHaveLength(2);
  });
});

describe("getEntityTableComponents", () => {
  test("it correctly renders display data", async () => {
    const results = getEntityTableComponents(
      mockMlrReportContext.report.fieldData.program,
      mockModalOverlayReportPageWithOverlayJson,
      [mockModalOverlayReportPageWithOverlayJson.overlayForm.fields]
    );

    const { findByText } = render(<div>{results}</div>);

    expect(await findByText("Standalone CHIP"));
  });

  test("it correctly renders display data with other text fields", async () => {
    mockMlrReportContext.report.fieldData.program[0][
      "report_eligibilityGroup-otherText"
    ] = "Other Text";
    const results = getEntityTableComponents(
      mockMlrReportContext.report.fieldData.program,
      mockModalOverlayReportPageWithOverlayJson,
      [mockModalOverlayReportPageWithOverlayJson.overlayForm.fields]
    );

    const { findByText } = render(<div>{results}</div>);

    expect(await findByText("Other Text"));
  });
});

describe("getFormSections", () => {
  test("it does not error on empty arrays", () => {
    const sections = getFormSections([]);
    expect(sections).toHaveLength(1);
    expect(sections[0]).toHaveLength(0);
  });

  test("it does not split if there is no splitting to do", () => {
    const sections = getFormSections([
      { id: "a", type: "sectionHeader" },
      { id: "b", type: "checkbox" },
    ]);
    expect(sections).toHaveLength(1);
    expect(sections[0].map(({ id }) => id)).toEqual(["a", "b"]);
  });

  test("it splits out a new subsection for each header", () => {
    const sections = getFormSections([
      { id: "a", type: "sectionHeader" },
      { id: "b", type: "checkbox" },
      { id: "c", type: "checkbox" },
      { id: "d", type: "sectionHeader" },
      { id: "e", type: "sectionHeader" },
      { id: "f", type: "checkbox" },
    ]);
    expect(sections).toHaveLength(3);
    expect(sections[0].map(({ id }) => id)).toEqual(["a", "b", "c"]);
    expect(sections[1].map(({ id }) => id)).toEqual(["d"]);
    expect(sections[2].map(({ id }) => id)).toEqual(["e", "f"]);
  });
});

describe("renderEntityDetailTables", () => {
  test("it throws when using an unsupported report type", () => {
    expect(() =>
      renderEntityDetailTables(
        ReportType.NAAAR,
        [],
        mockModalOverlayReportPageWithOverlayJson
      )
    ).toThrow(Error);
    expect(() =>
      renderEntityDetailTables(
        ReportType.MCPAR,
        [],
        mockModalOverlayReportPageWithOverlayJson
      )
    ).toThrow(Error);
    expect(() =>
      renderEntityDetailTables(
        "Foo" as ReportType,
        [],
        mockModalOverlayReportPageWithOverlayJson
      )
    ).toThrow(Error);
  });
});

describe("ExportedEntityDetailsOverlaySection has no accessibility issues", () => {
  it("should have no violations", async () => {
    const { container } = render(
      exportedEntityDetailsOverlaySectionComponent()
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
