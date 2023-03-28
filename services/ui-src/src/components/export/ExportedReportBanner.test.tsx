import { render, screen } from "@testing-library/react";
import { ReportContext } from "components";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ExportedReportBanner } from "./ExportedReportBanner";

let mockPrint: any;

const mcparContext = {
  report: {
    reportType: "MCPAR",
  },
};

const mlrContext = {
  report: {
    reportType: "MLR",
  }
}

const bannerWithContext = (context: any) => {
  return (
    <ReportContext.Provider value={context}>
      <ExportedReportBanner />
    </ReportContext.Provider>
  );
}

describe("ExportedReportBanner", () => {
  // temporarily mock window.print for the testing environment
  beforeEach(() => {
    mockPrint = window.print;
    jest.spyOn(window, "print").mockImplementation(() => {});
  });
  afterEach(() => {
    window.print = mockPrint;
  });

  test("Is ExportedReportBanner present", async () => {
    render(bannerWithContext(mcparContext));
    const banner = screen.getByTestId("exportedReportBanner");
    expect(banner).toBeVisible();
  });

  test("Does MCPAR export banner have MCPAR-specific verbiage", async () => {
    render(bannerWithContext(mcparContext));
    const introText = screen.getByText(/MCPAR/);
    expect(introText).toBeVisible();
  });

  test("Does MLR export banner have MLR-specific verbiage", async () => {
    render(bannerWithContext(mlrContext));
    const introText = screen.getByText(/MLR/);
    expect(introText).toBeVisible();
  });

  test("Download PDF button should be visible", async () => {
    render(bannerWithContext(mcparContext));
    const printButton = screen.getByText("Download PDF");
    expect(printButton).toBeVisible();
    await userEvent.click(printButton);
  });
});

describe("Test ExportedReportBanner accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(bannerWithContext(mcparContext));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
