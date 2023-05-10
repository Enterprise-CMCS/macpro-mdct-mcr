import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { Alert } from "components";

const alertComponent = (
  <Alert
    title="Test alert!"
    description="This is for testing."
    link="test-link"
  />
);

describe("Test Alert Item", () => {
  beforeEach(() => {
    render(alertComponent);
  });

  test("Alert is visible", () => {
    expect(screen.getByText("Test alert!")).toBeVisible();
    expect(screen.getByText("This is for testing.")).toBeVisible();
    expect(screen.getByText("test-link")).toBeVisible();
  });
});

describe("Test Alert accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(alertComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
