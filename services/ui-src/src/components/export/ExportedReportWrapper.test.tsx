import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, ExportedReportWrapper } from "components";
// utils
import {
  mockDrawerReportPageJson,
  mockModalDrawerReportPageJson,
  mockReviewSubmitPageJson,
  mockStandardReportPageJson,
  mockReportContext,
} from "utils/testing/setupJest";
// types
import { AnyObject } from "yup/lib/types";

const mockDrawerContent = (modifiedFields?: AnyObject) => ({
  ...mockDrawerReportPageJson,
  ...modifiedFields,
});

const exportedDrawerReportWrapperComponent = (context: any, content: any) => (
  <ReportContext.Provider value={context}>
    <ExportedReportWrapper section={content} />
  </ReportContext.Provider>
);

const mockModalDrawerContent = (modifiedFields?: AnyObject) => ({
  ...mockModalDrawerReportPageJson,
  ...modifiedFields,
});

const exportedModalDrawerReportWrapperComponent = (
  context: any,
  content: any
) => (
  <ReportContext.Provider value={context}>
    <ExportedReportWrapper section={content} />
  </ReportContext.Provider>
);

const mockStandardContent = (modifiedFields?: AnyObject) => ({
  ...mockStandardReportPageJson,
  ...modifiedFields,
});

const exportedStandardReportWrapperComponent = (context: any, content: any) => (
  <ReportContext.Provider value={context}>
    <ExportedReportWrapper section={content} />
  </ReportContext.Provider>
);

const mockReviewAndSubmitContent = (modifiedFields?: AnyObject) => ({
  ...mockReviewSubmitPageJson,
  ...modifiedFields,
});

const exportedReviewAndSubmitReportWrapperComponent = (
  context: any,
  content: any
) => (
  <ReportContext.Provider value={context}>
    <ExportedReportWrapper section={content} />
  </ReportContext.Provider>
);

describe("ExportedReportWrapper", () => {
  test("Is Exported Drawer Report Section present", () => {
    render(
      exportedDrawerReportWrapperComponent(
        mockReportContext,
        mockDrawerContent()
      )
    );
    expect(
      screen.getByText(mockDrawerContent().verbiage.intro.subsection)
    ).toBeVisible();
  });

  test("Is Exported Modal Drawer Report Section present", () => {
    render(
      exportedModalDrawerReportWrapperComponent(
        mockReportContext,
        mockModalDrawerContent()
      )
    );
    expect(
      screen.getByText(mockModalDrawerContent().verbiage.intro.subsection)
    ).toBeVisible();
  });

  test("Is Exported Standard Report Section present", () => {
    render(
      exportedStandardReportWrapperComponent(
        mockReportContext,
        mockStandardContent()
      )
    );
    expect(
      screen.getByText(mockStandardContent().verbiage.intro.subsection)
    ).toBeVisible();
  });

  test("Is Review and Submit Section NOT present", () => {
    render(
      exportedReviewAndSubmitReportWrapperComponent(
        mockReportContext,
        mockReviewAndSubmitContent()
      )
    );
    expect(
      screen.queryByText(mockReviewAndSubmitContent().name)
    ).not.toBeInTheDocument();
  });
});

describe("Test ExportedReportWrapper accessibility", () => {
  it("ExportedDrawerReportWrapper should not have basic accessibility issues", async () => {
    const { container } = render(
      exportedDrawerReportWrapperComponent(
        mockReportContext,
        mockDrawerContent()
      )
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("ExportedModalDrawerReportWrapper should not have basic accessibility issues", async () => {
    const { container } = render(
      exportedModalDrawerReportWrapperComponent(
        mockReportContext,
        mockModalDrawerContent()
      )
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("ExportedStandardDrawerReportWrapper should not have basic accessibility issues", async () => {
    const { container } = render(
      exportedStandardReportWrapperComponent(
        mockReportContext,
        mockStandardContent()
      )
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
