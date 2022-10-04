import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { ReportPageIntro } from "components";

const mockText = {
  section: "mock section",
  subsection: "mock subsection",
  spreadsheet: "mock item",
  info: [
    {
      type: "html",
      content: "mock html",
    },
  ],
};

const reportPageComponent = (
  <ReportPageIntro text={mockText} data-testid="report-page-intro" />
);

describe("Test ReportPageIntro", () => {
  test("Check that ReportPageIntro renders", () => {
    const { getByTestId } = render(reportPageComponent);
    expect(getByTestId("report-page-intro")).toBeVisible();
  });
});

describe("Test ReportPageIntro accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(reportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
