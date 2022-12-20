import { render } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, ExportedStandardReportSection } from "components";
// utils
import {
  mockReportContext,
  mockStandardReportPageJson,
} from "utils/testing/setupJest";
// types
import { AnyObject } from "yup/lib/types";

const mockContent = (modifiedFields?: AnyObject) => ({
  ...mockStandardReportPageJson,
  ...modifiedFields,
});

const exportedReportSectionComponent = (context: any, content: any) => (
  <ReportContext.Provider value={context}>
    <ExportedStandardReportSection section={content} />
  </ReportContext.Provider>
);

describe("ExportedStandardReportSection", () => {
  test("Is Exported Standard Report Section present", () => {
    const { getByTestId } = render(
      exportedReportSectionComponent(mockReportContext, mockContent())
    );
    const section = getByTestId("exportedStandardReportSection");
    expect(section).toBeVisible();
  });

  test("Is Exported Standard Report Section with a two column layout.", () => {
    const { getByTestId } = render(
      exportedReportSectionComponent(
        mockReportContext,
        mockContent({
          form: {
            fields: [
              {
                id: "test_id",
                type: "dynamic",
                validation: "dynamic",
                props: {
                  label: "Test Dynamic Field",
                },
              },
            ],
          },
        })
      )
    );
    const section = getByTestId("exportedStandardReportSection");
    const columns = section.getElementsByTagName("th")?.length;
    expect(columns).toBe(2);
  });
});

describe("ExportedStandardReportSection Section Heading", () => {
  test("Exported Drawer Report Section section heading defaults to name field.", () => {
    const { getByTestId } = render(
      exportedReportSectionComponent(
        mockReportContext,
        mockContent({
          verbiage: {
            intro: {
              spreadsheet: "MOCK_SPREADSHEET",
              section: "mock section",
              info: "<p>This is some info.</p>",
            },
          },
        })
      )
    );
    const section = getByTestId("exportedStandardReportSection");
    const sectionHeading = section.querySelector("h3")?.innerHTML;
    expect(sectionHeading).toEqual("mock-route-1");
  });
});

describe("Test ExportedStandardReportSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(
      exportedReportSectionComponent(mockReportContext, mockContent())
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
