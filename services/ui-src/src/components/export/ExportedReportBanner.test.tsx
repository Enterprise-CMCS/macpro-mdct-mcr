import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ExportedReportBanner } from "./ExportedReportBanner";

let mockPrint: any;

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
    render(<ExportedReportBanner />);
    const banner = screen.getByTestId("exportedReportBanner");
    expect(banner).toBeVisible();
  });

  test("Download PDF button should be visible", async () => {
    render(<ExportedReportBanner />);
    const printButton = screen.getByText("Download PDF");
    expect(printButton).toBeVisible();
    await userEvent.click(printButton);
  });
});

describe("Test ExportedReportBanner accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(<ExportedReportBanner />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
