import { render } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, ExportedModalDrawerReportSection } from "components";
// utils
import {
  mockModalDrawerReportPageJson,
  mockReportContext,
} from "utils/testing/setupJest";
// types
import { AnyObject } from "yup/lib/types";

const mockContent = (modifiedFields?: AnyObject) => ({
  ...mockModalDrawerReportPageJson,
  ...modifiedFields,
});

const exportedReportSectionComponent = (context: any, content: any) => (
  <ReportContext.Provider value={context}>
    <ExportedModalDrawerReportSection section={content} />
  </ReportContext.Provider>
);

describe("ExportedModalDrawerReportSection", () => {
  test("Is Exported Drawer Report Section present", () => {
    const { getByTestId } = render(
      exportedReportSectionComponent(mockReportContext, mockContent())
    );
    const section = getByTestId("exportedModalDrawerReportSection");
    expect(section).toBeVisible();
  });
});

describe("ExportedModalDrawerReportSection", () => {
  test("Checking for appropriate messaging for entityType 'qualityMeasures'", () => {
    const { getByTestId } = render(
      exportedReportSectionComponent(
        mockReportContext,
        mockContent({
          entityType: "qualityMeasures",
        })
      )
    );
    const entityMessage = getByTestId("entityMessage");
    expect(entityMessage).toHaveTextContent("0 -- Not answered");
  });
});

describe("ExportedModalDrawerReportSection", () => {
  test("Checking for appropriate messaging for entityType 'sanctions'", () => {
    const { getByTestId } = render(
      exportedReportSectionComponent(
        mockReportContext,
        mockContent({
          entityType: "sanctions",
        })
      )
    );
    const entityMessage = getByTestId("entityMessage");
    expect(entityMessage).toHaveTextContent("0 -- Not answered");
  });
});

describe("ExportedModalDrawerReportSection", () => {
  test("Checking for appropriate messaging for entityType default", () => {
    const { getByTestId } = render(
      exportedReportSectionComponent(
        mockReportContext,
        mockContent({
          entityType: undefined,
        })
      )
    );
    const entityMessage = getByTestId("entityMessage");
    expect(entityMessage).toHaveTextContent("0 -- Not answered");
  });
});

describe("ExportedModalDrawerReportSection Section Heading", () => {
  test("Exported Drawer Report Section section heading defaults to name field.", () => {
    const { getByTestId } = render(
      exportedReportSectionComponent(
        mockReportContext,
        mockContent({
          verbiage: {
            intro: {
              spreadsheet: "MOCK_SPREADSHEET",
              section: "mock section",
              info: "This is some info.",
            },
          },
        })
      )
    );
    const section = getByTestId("exportedModalDrawerReportSection");
    const sectionHeading = section.querySelector("h3")?.innerHTML;
    expect(sectionHeading).toEqual("mock-route-2b");
  });
});

describe("Test ExportedModalDrawerReportSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(
      exportedReportSectionComponent(mockReportContext, mockContent())
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
