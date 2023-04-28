import { ReportContext } from "components/reports/ReportProvider";
import { mockMlrReportContext } from "utils/testing/setupJest";
import { EntityStatusIcon } from "./EntityStatusIcon";
import { render } from "@testing-library/react";

const entityStatusIconComponent = (
  <ReportContext.Provider value={mockMlrReportContext}>
    <EntityStatusIcon
      entity={mockMlrReportContext.report.fieldData.program[0]}
    ></EntityStatusIcon>
  </ReportContext.Provider>
);

const entityStatusIconComponentIncomplete = (
  <ReportContext.Provider
    value={{
      ...mockMlrReportContext,
      report: {
        ...mockMlrReportContext.report,
        formTemplate: {
          ...mockMlrReportContext.report.formTemplate,
          validationJson: {
            report_numberField: "number",
          },
        },
      },
    }}
  >
    <EntityStatusIcon
      entity={{
        ...mockMlrReportContext.report.fieldData.program[0],
        report_numberField: null,
      }}
    ></EntityStatusIcon>
  </ReportContext.Provider>
);

const entityStatusIconComponentIncompleteNested = (
  <ReportContext.Provider
    value={{
      ...mockMlrReportContext,
      report: {
        ...mockMlrReportContext.report,
        formTemplate: {
          ...mockMlrReportContext.report.formTemplate,
          validationJson: {
            report_numberField: {
              type: "number",
              nested: true,
              parentFieldName: "parentField",
              parentOptionId: "No",
            },
          },
        },
      },
    }}
  >
    <EntityStatusIcon
      entity={{
        ...mockMlrReportContext.report.fieldData.program[0],
        parentField: [
          {
            key: "parentField-No",
            value: "No",
          },
        ],
        report_numberField: null,
      }}
    ></EntityStatusIcon>
  </ReportContext.Provider>
);

const entityStatusIconComponentOptional = (
  <ReportContext.Provider
    value={{
      ...mockMlrReportContext,
      report: {
        ...mockMlrReportContext.report,
        formTemplate: {
          ...mockMlrReportContext.report.formTemplate,
          validationJson: {
            report_optionalField: {
              type: "numberOptional",
            },
          },
        },
      },
    }}
  >
    <EntityStatusIcon
      entity={{
        ...mockMlrReportContext.report.fieldData.program[0],
        report_optionalField: null,
      }}
    ></EntityStatusIcon>
  </ReportContext.Provider>
);

const entityStatusIconComponentOptionalNested = (
  <ReportContext.Provider
    value={{
      ...mockMlrReportContext,
      report: {
        ...mockMlrReportContext.report,
        formTemplate: {
          ...mockMlrReportContext.report.formTemplate,
          validationJson: {
            report_optionalField: {
              type: "numberOptional",
              nested: true,
              parentFieldName: "parentField",
              parentOptionId: "No",
            },
          },
        },
      },
    }}
  >
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

describe("EntityStatusIcon functionality tests", () => {
  test("should show a success icon if all required data is entered", () => {
    const { container } = render(entityStatusIconComponent);
    expect(container.querySelector("img[alt='complete icon']")).toBeVisible();
  });
  test("should show a false icon if some required data is missing", () => {
    const { container } = render(entityStatusIconComponentIncomplete);
    expect(container.querySelector("img[alt='warning icon']")).toBeVisible();
  });
  test("should show a false icon if nested required value is missing", () => {
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
