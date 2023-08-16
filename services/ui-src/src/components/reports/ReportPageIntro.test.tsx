import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportPageIntro } from "components";
// utils
import { mockVerbiageIntro } from "utils/testing/setupJest";

const reportPageComponent = <ReportPageIntro text={mockVerbiageIntro} />;

describe("Test ReportPageIntro", () => {
  test("Check that ReportPageIntro renders", () => {
    render(reportPageComponent);
    expect(screen.getByText(mockVerbiageIntro.section)).toBeVisible();
  });
});

describe("Test ReportPageIntro accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(reportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
