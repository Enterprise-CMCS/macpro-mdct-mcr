import { render } from "@testing-library/react";
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
import { testA11yAct } from "utils/testing/commonTests";

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

describe("<EntityStatusIcon />", () => {
  test("should show a success icon if all required data is entered", () => {
    const { container } = render(entityStatusIconComponent);
    expect(container.querySelector("img[alt='complete icon']")).toBeVisible();
  });
  test("should show special text on a pdf page if required data is entered", async () => {
    const { findByText } = render(entityStatusIconPdfComponent);
    expect(await findByText("Complete")).toBeVisible();
  });
  test("should show a complete icon if only an optional value is missing", () => {
    const { container } = render(entityStatusIconComponentOptional);
    expect(container.querySelector("img[alt='complete icon']")).toBeVisible();
  });
  test("should show a complete icon if only a nested optional value is missing", () => {
    const { container } = render(entityStatusIconComponentOptionalNested);
    expect(container.querySelector("img[alt='complete icon']")).toBeVisible();
  });

  testA11yAct(entityStatusIconComponent);
  testA11yAct(entityStatusIconComponentIncomplete);
  testA11yAct(entityStatusIconPdfComponent);
  testA11yAct(entityStatusIconComponentIncompletePdf);
});
