import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { ReportPageFooter } from "components";
import { RouterWrappedComponent } from "utils/testing/setupJest";

const mockProps = {
  formId: "mock form id",
  previousRoute: "/mock-previous-route",
  nextRoute: "/mock-next-route",
};

const reportPageComponent = (
  <RouterWrappedComponent>
    <ReportPageFooter {...mockProps} data-testid="report-page-footer" />
  </RouterWrappedComponent>
);

describe("Test ReportPageFooter", () => {
  test("Check that ReportPageFooter renders", () => {
    const { getByTestId } = render(reportPageComponent);
    expect(getByTestId("report-page-footer")).toBeVisible();
  });
});

describe("Test ReportPageFooter accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(reportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
