import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { ReportPage } from "components";

const reportPageComponent = (
  <ReportPage data-testid="report-page">
    <p>Test text</p>
  </ReportPage>
);

describe("Test ReportPage", () => {
  test("Check that ReportPage renders", () => {
    const { getByTestId } = render(reportPageComponent);
    expect(getByTestId("report-page")).toBeVisible();
  });
});

describe("Test ReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(reportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
