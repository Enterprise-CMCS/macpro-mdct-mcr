import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReviewSubmit } from "routes";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";

const dashboardView = (
  <RouterWrappedComponent>
    <ReviewSubmit />
  </RouterWrappedComponent>
);

describe("Test /mcpar/review-and-submit view", () => {
  beforeEach(() => {
    render(dashboardView);
  });

  test("Check that /mcpar/review-and-submit view renders", () => {
    expect(screen.getByTestId("review-and-submit-view")).toBeVisible();
  });
});

describe("Test /mcpar/review-and-submit view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dashboardView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
