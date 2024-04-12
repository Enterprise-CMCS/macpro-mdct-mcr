import { render } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext } from "components/reports/ReportProvider";
import { EntityStatusIcon } from "./EntityStatusIcon";
// utils
import {
  mockMlrReportContext,
  mockMlrReportStore,
  mockStateUserStore,
} from "utils/testing/setupJest";
import { useStore } from "utils";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockMlrReportStore,
});

const entityStatusIconComponent = (
  <ReportContext.Provider value={mockMlrReportContext}>
    <EntityStatusIcon
      entity={mockMlrReportContext.report.fieldData.program[0]}
    ></EntityStatusIcon>
  </ReportContext.Provider>
);

const entityStatusIconPdfComponent = (
  <ReportContext.Provider value={mockMlrReportContext}>
    <EntityStatusIcon
      entity={mockMlrReportContext.report.fieldData.program[0]}
      isPdf={true}
    ></EntityStatusIcon>
  </ReportContext.Provider>
);

const entityStatusIconComponentIncomplete = (
  <ReportContext.Provider value={mockMlrReportContext}>
    <EntityStatusIcon
      entity={{
        ...mockMlrReportContext.report.fieldData.program[0],
        report_numberField: null,
      }}
    ></EntityStatusIcon>
  </ReportContext.Provider>
);

const entityStatusIconComponentIncompletePdf = (
  <ReportContext.Provider value={mockMlrReportContext}>
    <EntityStatusIcon
      entity={{
        ...mockMlrReportContext.report.fieldData.program[0],
        report_numberField: null,
      }}
      isPdf={true}
    ></EntityStatusIcon>
  </ReportContext.Provider>
);

const entityStatusIconComponentIncompleteNested = (
  <ReportContext.Provider value={mockMlrReportContext}>
    <EntityStatusIcon
      entity={{
        id: "1",
        "report_modal-text-field": "1",
        "report_optional-text-field": "2",
        "report_text-field": "3",
        "report_number-field": 4,
        "report_nested-field": [
          { key: "report_nested-field", value: "option 3" },
        ],
        "report_nested-text-field": null,
      }}
    ></EntityStatusIcon>
  </ReportContext.Provider>
);

const entityStatusIconComponentOptional = (
  <ReportContext.Provider value={mockMlrReportContext}>
    <EntityStatusIcon
      entity={{
        ...mockMlrReportContext.report.fieldData.program[0],
        report_optionalField: null,
      }}
    ></EntityStatusIcon>
  </ReportContext.Provider>
);

const entityStatusIconComponentOptionalNested = (
  <ReportContext.Provider value={mockMlrReportContext}>
    <EntityStatusIcon
      entity={{
        ...mockMlrReportContext.report.fieldData.program[0],
        parentField: [
          {
            key: "parentField-No",
            value: "No",
          },
        ],
        report_optionalField: null,
      }}
    ></EntityStatusIcon>
  </ReportContext.Provider>
);

// TODO: update these tests upon EntityProvider migration
describe("EntityStatusIcon functionality tests", () => {
  test("should show a success icon if all required data is entered", () => {
    const { container } = render(entityStatusIconComponent);
    expect(container.querySelector("img[alt='complete icon']")).toBeVisible();
  });
  test("should show special text on a pdf page if required data is entered", async () => {
    const { findByText } = render(entityStatusIconPdfComponent);
    expect(await findByText("Complete")).toBeVisible();
  });
  test.skip("should show a false icon if some required data is missing", () => {
    const { container } = render(entityStatusIconComponentIncomplete);
    expect(container.querySelector("img[alt='warning icon']")).toBeVisible();
  });
  test.skip("should show special text on a pdf page if required data is missing", async () => {
    const { findByText } = render(entityStatusIconComponentIncompletePdf);
    expect(await findByText("Error")).toBeVisible();
  });
  test.skip("should show a false icon if nested required value is missing", () => {
    const { container } = render(entityStatusIconComponentIncompleteNested);
    expect(container.querySelector("img[alt='warning icon']")).toBeVisible();
  });
  test("should show a complete icon if only an optional value is missing", () => {
    const { container } = render(entityStatusIconComponentOptional);
    expect(container.querySelector("img[alt='complete icon']")).toBeVisible();
  });
  test("should show a complete icon if only a nested optional value is missing", () => {
    const { container } = render(entityStatusIconComponentOptionalNested);
    expect(container.querySelector("img[alt='complete icon']")).toBeVisible();
  });
});

describe("EntityStatusIcon accessibility tests", () => {
  test("success icon has no issues", async () => {
    const { container } = render(entityStatusIconComponent);
    expect(await axe(container)).toHaveNoViolations();
  });
  test("warning icon has no issues", async () => {
    const { container } = render(entityStatusIconComponentIncomplete);
    expect(await axe(container)).toHaveNoViolations();
  });
  test("success icon on pdf has no issues", async () => {
    const { container } = render(entityStatusIconPdfComponent);
    expect(await axe(container)).toHaveNoViolations();
  });
  test("warning icon on pdf has no issues", async () => {
    const { container } = render(entityStatusIconComponentIncompletePdf);
    expect(await axe(container)).toHaveNoViolations();
  });
});
