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

const mockReportContextWithoutEntities = {
  ...mockReportContext,
  report: undefined,
};

const mockContent = (modifiedFields?: AnyObject) => ({
  ...mockModalDrawerReportPageJson,
  ...modifiedFields,
});

const exportedReportSectionComponent = (context: any, content: any) => (
  <ReportContext.Provider value={mockReportContext}>
    <ExportedModalDrawerReportSection section={content} />
  </ReportContext.Provider>
);

const exportedReportSectionComponentWithoutEntities = (
  context: any,
  content: any
) => (
  <ReportContext.Provider value={mockReportContextWithoutEntities}>
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

  test("Checking for appropriate messaging for entityType 'qualityMeasures' if no entities", () => {
    const { getByTestId } = render(
      exportedReportSectionComponentWithoutEntities(
        mockReportContext,
        mockContent({
          entityType: "qualityMeasures",
        })
      )
    );
    const headerCount = getByTestId("headerCount");
    expect(headerCount).toHaveTextContent("Mock dashboard title");
    const entityMessage = getByTestId("entityMessage");
    expect(entityMessage).toHaveTextContent("0 - No quality measures entered");
  });

  test("Checking for appropriate messaging for entityType 'sanctions' if no entities", () => {
    const { getByTestId } = render(
      exportedReportSectionComponentWithoutEntities(
        mockReportContext,
        mockContent({
          entityType: "sanctions",
        })
      )
    );
    const headerCount = getByTestId("headerCount");
    expect(headerCount).toHaveTextContent("Mock dashboard title");
    const entityMessage = getByTestId("entityMessage");
    expect(entityMessage).toHaveTextContent("0 - No sanctions entered");
  });

  test("Checking for appropriate messaging for entityType 'accessMeasures' if no entities", () => {
    const { getByTestId } = render(
      exportedReportSectionComponentWithoutEntities(
        mockReportContext,
        mockContent({
          entityType: "accessMeasures",
        })
      )
    );
    const headerCount = getByTestId("headerCount");
    expect(headerCount).toHaveTextContent("Mock dashboard title");
    const entityMessage = getByTestId("entityMessage");
    expect(entityMessage).toHaveTextContent("0 - No access measures entered");
  });

  test("Checking for appropriate messaging for entityType 'accessMeasures' if there are entities", () => {
    const { getByTestId } = render(
      exportedReportSectionComponent(
        mockReportContext,
        mockContent({
          entityType: "accessMeasures",
        })
      )
    );
    const headerCount = getByTestId("headerCount");
    expect(headerCount).toHaveTextContent("Mock dashboard title");
    expect(headerCount).toHaveTextContent("1");
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
