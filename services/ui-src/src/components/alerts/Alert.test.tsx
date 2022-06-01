import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { Alert } from "components";

const alertComponent = (
  <Alert
    title="Test alert!"
    description="This is for testing."
    data-testid="test-alert"
  />
);

describe("Test Alert Item", () => {
  beforeEach(() => {
    render(alertComponent);
  });

  test("Alert is visible", () => {
    expect(screen.getByTestId("test-alert")).toBeVisible();
  });
});

describe("Test Alert accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(alertComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
