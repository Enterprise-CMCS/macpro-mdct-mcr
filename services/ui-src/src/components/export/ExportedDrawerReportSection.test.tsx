import { render } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, ExportedDrawerReportSection } from "components";
// utils
import {
  mockDrawerReportPageJson,
  mockReportContext,
} from "utils/testing/setupJest";
// types
import { AnyObject } from "yup/lib/types";

const mockContent = (modifiedFields?: AnyObject) => ({
  ...mockDrawerReportPageJson,
  ...modifiedFields,
});

const exportedReportSectionComponent = (context: any, content: any) => (
  <ReportContext.Provider value={context}>
    <ExportedDrawerReportSection section={content} />
  </ReportContext.Provider>
);

describe("ExportedDrawerReportSection", () => {
  test("Is Exported Drawer Report Section present", () => {
    const { getByTestId } = render(
      exportedReportSectionComponent(mockReportContext, mockContent())
    );
    const section = getByTestId("exportedDrawerReportSection");
    expect(section).toBeVisible();
  });

  test("Is Exported Drawer Report Section present with a field without props", () => {
    const { getByTestId } = render(
      exportedReportSectionComponent(
        mockReportContext,
        mockContent({
          drawerForm: {
            fields: [
              {
                id: "mock-drawer-text-field",
                type: "text",
                validation: "text",
              },
            ],
          },
        })
      )
    );
    const section = getByTestId("exportedDrawerReportSection");
    expect(section).toBeVisible();
  });
});

describe("ExportedDrawerReportSection Section Heading", () => {
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
    const section = getByTestId("exportedDrawerReportSection");
    const sectionHeading = section.querySelector("h3")?.innerHTML;
    expect(sectionHeading).toEqual("mock-route-2a");
  });
});

describe("Test ExportedDrawerReportSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(
      exportedReportSectionComponent(mockReportContext, mockContent())
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
